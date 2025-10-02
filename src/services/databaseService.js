// Database service for handling both localStorage and Supabase
import { supabase, isSupabaseAvailable } from '../lib/supabase'

// Storage keys
const STORAGE_KEYS = {
  CONTENT: 'cms_content',
  LAST_SYNC: 'cms_last_sync',
  OFFLINE_CHANGES: 'cms_offline_changes'
}

// Default content structure
const DEFAULT_CONTENT = {
  personal: {
    name: "Kyle O'Connor",
    title: "UI Developer",
    location: "Manchester · United Kingdom",
    email: "info@kyleo.co.uk",
    bio: "Hello, I am Kyle O'Connor!\nCurrently a UI developer, AKA a front end developer, web designer or other similar terminology.\n\nI live in Tameside, more well known as a part of Greater Manchester. With a remote based job for a company in Surrey.\n\nInterested in any services, I'll see what I can do for you, email me."
  },
  expertise: {
    description: "I make sure a website or interface looks good, feels smooth, and is intuitive for all users.\n\nMy job is basically to turn a designer's vision into reality using code. However, due to factors like accessibility guidelines and common sense, I occasionally overrule the designer.\n\nHaving been doing it for almost a decade, I can confidently say I am an expert at front end."
  },
  social: {
    github: "https://github.com/kyleodotcodotuk",
    bitcoin: "https://strike.me/kyleocouk/"
  }
}

class DatabaseService {
  constructor() {
    this.isOnline = navigator.onLine
    this.syncInProgress = false
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncOfflineChanges()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Get content from localStorage
  getLocalContent() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTENT)
      return stored ? JSON.parse(stored) : DEFAULT_CONTENT
    } catch (error) {
      console.error('Error reading local content:', error)
      return DEFAULT_CONTENT
    }
  }

  // Save content to localStorage
  saveLocalContent(content) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content))
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString())
      return true
    } catch (error) {
      console.error('Error saving local content:', error)
      return false
    }
  }

  // Get content from Supabase
  async getRemoteContent() {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available')
    }

    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('content, updated_at')
        .eq('id', 1)
        .single()

      if (error) {
        throw error
      }

      return data ? data.content : DEFAULT_CONTENT
    } catch (error) {
      console.error('Error fetching remote content:', error)
      throw error
    }
  }

  // Save content to Supabase
  async saveRemoteContent(content) {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available')
    }

    try {
      const { data, error } = await supabase
        .from('cms_content')
        .upsert({
          id: 1,
          content: content,
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error saving remote content:', error)
      throw error
    }
  }

  // Get content with fallback strategy
  async getContent() {
    try {
      // If online and Supabase available, try remote first
      if (this.isOnline && isSupabaseAvailable()) {
        try {
          const remoteContent = await this.getRemoteContent()
          // Save to local as backup
          this.saveLocalContent(remoteContent)
          return remoteContent
        } catch (error) {
          console.warn('Failed to fetch remote content, falling back to local:', error)
          return this.getLocalContent()
        }
      } else {
        // Offline or no Supabase, use local
        return this.getLocalContent()
      }
    } catch (error) {
      console.error('Error getting content:', error)
      return DEFAULT_CONTENT
    }
  }

  // Save content with fallback strategy
  async saveContent(content) {
    let localSaved = false
    let remoteSaved = false

    // Always save locally first for immediate feedback
    localSaved = this.saveLocalContent(content)

    // Try to save remotely if online
    if (this.isOnline && isSupabaseAvailable()) {
      try {
        await this.saveRemoteContent(content)
        remoteSaved = true
        console.log('✅ Content saved to both local and remote storage')
      } catch (error) {
        console.warn('Failed to save remote content, saved locally only:', error)
        // Store as offline change for later sync
        this.storeOfflineChange(content)
      }
    } else {
      console.log('📴 Offline mode: Content saved locally only')
      this.storeOfflineChange(content)
    }

    return {
      success: localSaved,
      local: localSaved,
      remote: remoteSaved,
      offline: !this.isOnline || !isSupabaseAvailable()
    }
  }

  // Store changes made while offline
  storeOfflineChange(content) {
    try {
      const offlineChanges = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_CHANGES) || '[]')
      offlineChanges.push({
        content,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem(STORAGE_KEYS.OFFLINE_CHANGES, JSON.stringify(offlineChanges))
    } catch (error) {
      console.error('Error storing offline change:', error)
    }
  }

  // Sync offline changes when coming back online
  async syncOfflineChanges() {
    if (this.syncInProgress || !isSupabaseAvailable()) {
      return
    }

    this.syncInProgress = true

    try {
      const offlineChanges = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_CHANGES) || '[]')
      
      if (offlineChanges.length === 0) {
        this.syncInProgress = false
        return
      }

      console.log(`🔄 Syncing ${offlineChanges.length} offline changes...`)

      // Get the latest change (most recent)
      const latestChange = offlineChanges[offlineChanges.length - 1]
      
      // Try to save to remote
      await this.saveRemoteContent(latestChange.content)
      
      // Clear offline changes on successful sync
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_CHANGES)
      
      console.log('✅ Offline changes synced successfully')
    } catch (error) {
      console.error('Failed to sync offline changes:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  // Get sync status
  getSyncStatus() {
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
    const offlineChanges = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_CHANGES) || '[]')
    
    return {
      lastSync: lastSync ? new Date(lastSync) : null,
      isOnline: this.isOnline,
      supabaseAvailable: isSupabaseAvailable(),
      pendingChanges: offlineChanges.length,
      syncInProgress: this.syncInProgress
    }
  }

  // Force sync (manual sync)
  async forceSync() {
    if (!this.isOnline || !isSupabaseAvailable()) {
      throw new Error('Cannot sync: offline or Supabase unavailable')
    }

    try {
      const localContent = this.getLocalContent()
      await this.saveRemoteContent(localContent)
      
      // Clear any offline changes
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_CHANGES)
      
      console.log('✅ Manual sync completed')
      return true
    } catch (error) {
      console.error('Manual sync failed:', error)
      throw error
    }
  }

  // Reset to default content
  async resetContent() {
    const defaultContent = { ...DEFAULT_CONTENT }
    return await this.saveContent(defaultContent)
  }

  // Export all data
  exportData() {
    const content = this.getLocalContent()
    const syncStatus = this.getSyncStatus()
    
    return {
      content,
      syncStatus,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
  }

  // Import data
  async importData(importedData) {
    try {
      if (!importedData.content) {
        throw new Error('Invalid import data: missing content')
      }

      return await this.saveContent(importedData.content)
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
  }
}

// Create singleton instance
export const databaseService = new DatabaseService()

// Named exports for specific functions
export const {
  getContent,
  saveContent,
  getSyncStatus,
  forceSync,
  resetContent,
  exportData,
  importData
} = databaseService

export default databaseService