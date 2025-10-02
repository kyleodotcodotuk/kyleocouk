import { supabase } from '../lib/supabase';
import { authenticateUser, logoutUser, isUserAuthenticated, getCurrentUser } from '../data/users';

// API service that can work with localStorage or Supabase
class CMSApiService {
  constructor() {
    this.useDatabase = supabase !== null;
  }

  // Content operations
  async getContent() {
    if (this.useDatabase) {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('*')
          .single();
        
        if (error && error.code !== 'PGRST116') { // Not found error
          throw error;
        }
        
        return data?.content || this.getDefaultContent();
      } catch (error) {
        console.error('Error fetching content from database:', error);
        return this.getLocalStorageContent();
      }
    } else {
      return this.getLocalStorageContent();
    }
  }

  async updateContent(section, data) {
    const currentContent = await this.getContent();
    const newContent = {
      ...currentContent,
      [section]: {
        ...currentContent[section],
        ...data
      }
    };

    if (this.useDatabase) {
      try {
        const { error } = await supabase
          .from('cms_content')
          .upsert({
            id: 1, // Single row for content
            content: newContent,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error updating content in database:', error);
        // Fallback to localStorage
        this.updateLocalStorageContent(newContent);
      }
    } else {
      this.updateLocalStorageContent(newContent);
    }

    return newContent;
  }

  async resetContent() {
    const defaultContent = this.getDefaultContent();
    
    if (this.useDatabase) {
      try {
        const { error } = await supabase
          .from('cms_content')
          .upsert({
            id: 1,
            content: defaultContent,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error resetting content in database:', error);
        // Fallback to localStorage
        localStorage.removeItem('cms_content');
      }
    } else {
      localStorage.removeItem('cms_content');
    }

    return defaultContent;
  }

  // Authentication operations
  async login(username, password) {
    if (this.useDatabase) {
      try {
        // Try our local user authentication first
        const localAuth = authenticateUser(username, password);
        if (localAuth.success) {
          return localAuth;
        }
        
        // Fallback to Supabase if local auth fails
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.includes('@') ? username : `${username}@kyleo.co.uk`,
          password: password
        });
        
        if (error) throw error;
        
        return { success: true, user: data.user };
      } catch (error) {
        console.error('Error logging in:', error);
        // Fallback to local auth
        return authenticateUser(username, password);
      }
    } else {
      return authenticateUser(username, password);
    }
  }

  async logout() {
    if (this.useDatabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
    
    // Always clear local storage and logout user
    logoutUser();
  }

  async getCurrentUser() {
    if (this.useDatabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user;
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    }
    
    // Check local authentication
    if (isUserAuthenticated()) {
      return getCurrentUser();
    }
    
    return null;
  }

  // Private helper methods
  getDefaultContent() {
    return {
      personal: {
        name: 'Kyle O\'Connor',
        title: 'UI Developer',
        location: 'Manchester · United Kingdom',
        email: 'info@kyleo.co.uk',
        bio: 'Hello, I am Kyle O\'Connor!\n\nCurrently a UI developer, AKA a front end developer, web designer or other similar terminology.\n\nI live in Tameside, more well known as a part of Greater Manchester. With a remote based job for a company in Surrey.\n\nInterested in any services, I\'ll see what I can do for you, email me.'
      },
      expertise: {
        description: 'I make sure a website or interface looks good, feels smooth, and is intuitive for all users.\n\nMy job is basically to turn a designer\'s vision into reality using code. However, due to factors like accessibility guidelines and common sense, I occasionally overrule the designer.\n\nHaving been doing it for almost a decade, I can confidently say I am an expert at front end development.\n\nThis content management system is a perfect example of my work - a clean, functional interface that\'s both powerful and easy to use.'
      },
      social: {
        github: 'https://github.com/kyleodotcodotuk',
        bitcoin: 'https://strike.me/kyleocouk/',
        linkedin: 'https://linkedin.com/in/kyle-oconnor',
        twitter: 'https://twitter.com/kyleocouk'
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: '3.0.0',
        isProduction: true
      }
    };
  }

  getLocalStorageContent() {
    const savedContent = localStorage.getItem('cms_content');
    if (savedContent) {
      try {
        return JSON.parse(savedContent);
      } catch (error) {
        console.error('Error parsing saved content:', error);
      }
    }
    return this.getDefaultContent();
  }

  updateLocalStorageContent(content) {
    localStorage.setItem('cms_content', JSON.stringify(content));
  }
}

export const cmsApi = new CMSApiService();
export default cmsApi;