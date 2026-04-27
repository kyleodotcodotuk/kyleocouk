import { authenticateUser, logoutUser, isUserAuthenticated, getCurrentUser } from '../data/users';

// API service for localStorage-based content management
class CMSApiService {
  // Content operations
  async getContent() {
    return this.getLocalStorageContent();
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

    this.updateLocalStorageContent(newContent);
    return newContent;
  }

  async resetContent() {
    const defaultContent = this.getDefaultContent();
    localStorage.removeItem('cms_content');
    return defaultContent;
  }

  // Authentication operations
  async login(username, password) {
    return await authenticateUser(username, password);
  }

  async logout() {
    logoutUser();
  }

  async getCurrentUser() {
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