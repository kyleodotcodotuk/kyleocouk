// Database service for localStorage-based content management

// Storage keys
const STORAGE_KEYS = {
  CONTENT: 'cms_content',
  LAST_SYNC: 'cms_last_sync'
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



  // Get content from localStorage
  async getContent() {
    try {
      return this.getLocalContent()
    } catch (error) {
      console.error('Error getting content:', error)
      return DEFAULT_CONTENT
    }
  }

  // Save content to localStorage
  async saveContent(content) {
    const localSaved = this.saveLocalContent(content)
    return {
      success: localSaved,
      local: localSaved
    }
  }



  // Get sync status
  getSyncStatus() {
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
    
    return {
      lastSync: lastSync ? new Date(lastSync) : null,
      isOnline: this.isOnline
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