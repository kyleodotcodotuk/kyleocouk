// Blog Posts Data Management
// This provides a complete CRUD API for blog posts with local storage persistence

// Sample blog posts for development
const samplePosts = [
  {
    id: 1,
    title: "Building Modern Web Applications with React",
    excerpt: "Explore the latest techniques and best practices for creating scalable React applications in 2024.",
    content: `# Building Modern Web Applications with React

React continues to evolve, and with it, the patterns and practices for building modern web applications. In this comprehensive guide, we'll explore the latest techniques that will help you create scalable, maintainable React applications.

## Modern React Patterns

### 1. Custom Hooks for Logic Reuse
Custom hooks are one of the most powerful features in React. They allow you to extract component logic into reusable functions.

\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
\`\`\`

### 2. Context API for State Management
For complex applications, the Context API provides a clean alternative to prop drilling.

## Performance Optimization

Modern React applications benefit from several optimization techniques:

- **Code Splitting**: Use dynamic imports and React.lazy()
- **Memoization**: Leverage React.memo() and useMemo()
- **Virtual Scrolling**: For large lists and tables

## Conclusion

Building modern React applications requires a deep understanding of these patterns and techniques. By implementing these practices, you'll create applications that are not only performant but also maintainable and scalable.`,
    tags: ['React', 'JavaScript', 'Web Development', 'Frontend'],
    category: 'web-development',
    status: 'published',
    featured: true,
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    authorId: 1,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    publishedAt: new Date('2024-01-15').toISOString(),
    seoTitle: 'Building Modern Web Applications with React - Complete Guide',
    seoDescription: 'Learn the latest React patterns and best practices for building scalable web applications in 2024.',
    viewCount: 1247,
    likes: 89
  },
  {
    id: 2,
    title: "The Future of CSS: Container Queries and Subgrid",
    excerpt: "Discover how Container Queries and CSS Subgrid are revolutionizing responsive design and layout patterns.",
    content: `# The Future of CSS: Container Queries and Subgrid

CSS continues to evolve, bringing powerful new features that change how we approach web design. Two of the most exciting recent additions are Container Queries and CSS Subgrid.

## Container Queries: A New Approach to Responsive Design

Container Queries allow components to respond to their container's size rather than the viewport size.

\`\`\`css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 300px) {
  .card {
    flex-direction: row;
  }
}
\`\`\`

## CSS Subgrid: Perfect Alignment

Subgrid allows nested grids to participate in their parent's grid, creating perfect alignment across complex layouts.

\`\`\`css
.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child-grid {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid;
}
\`\`\`

These features are transforming how we think about responsive design and layout systems.`,
    tags: ['CSS', 'Web Design', 'Responsive Design', 'Frontend'],
    category: 'web-design',
    status: 'published',
    featured: false,
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    authorId: 1,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
    publishedAt: new Date('2024-01-10').toISOString(),
    seoTitle: 'CSS Container Queries and Subgrid - The Future of Web Design',
    seoDescription: 'Learn how Container Queries and CSS Subgrid are revolutionizing responsive design patterns.',
    viewCount: 892,
    likes: 67
  },
  {
    id: 3,
    title: "Building a Component Library: Design System Best Practices",
    excerpt: "A comprehensive guide to creating and maintaining a scalable design system and component library.",
    content: `# Building a Component Library: Design System Best Practices

Creating a robust component library is essential for maintaining consistency and efficiency across large applications and teams.

## Planning Your Design System

### 1. Define Design Tokens
Start with the foundational elements:

\`\`\`javascript
const tokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  typography: {
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  }
};
\`\`\`

### 2. Component Architecture
Build components with composition in mind:

\`\`\`jsx
// Base Button component
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  return (
    <button 
      className={\`btn btn-\${variant} btn-\${size}\`}
      {...props}
    >
      {children}
    </button>
  );
};

// Specialized components
const PrimaryButton = (props) => <Button variant="primary" {...props} />;
const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
\`\`\`

## Documentation and Testing

Every component should have:
- Clear documentation with examples
- Comprehensive tests
- Accessibility guidelines
- Usage guidelines

## Maintaining Your System

Regular audits and updates ensure your design system remains relevant and useful.`,
    tags: ['Design System', 'Component Library', 'UI/UX', 'Frontend'],
    category: 'ui-ux',
    status: 'draft',
    featured: false,
    featuredImage: '',
    authorId: 1,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-08').toISOString(),
    publishedAt: null,
    seoTitle: '',
    seoDescription: '',
    viewCount: 0,
    likes: 0
  }
];

// Posts API
export class PostsAPI {
  constructor() {
    this.storageKey = 'blogPosts';
    this.initializePosts();
  }

  // Initialize posts with sample data if none exist
  initializePosts() {
    const existingPosts = this.getAllPosts();
    if (existingPosts.length === 0) {
      localStorage.setItem(this.storageKey, JSON.stringify(samplePosts));
    }
  }

  // Get all posts
  getAllPosts() {
    try {
      const posts = localStorage.getItem(this.storageKey);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  }

  // Get post by ID
  getPostById(id) {
    const posts = this.getAllPosts();
    return posts.find(post => post.id === parseInt(id));
  }

  // Get posts by status
  getPostsByStatus(status) {
    const posts = this.getAllPosts();
    return posts.filter(post => post.status === status);
  }

  // Get posts by author
  getPostsByAuthor(authorId) {
    const posts = this.getAllPosts();
    return posts.filter(post => post.authorId === parseInt(authorId));
  }

  // Get posts by category
  getPostsByCategory(category) {
    const posts = this.getAllPosts();
    return posts.filter(post => post.category === category);
  }

  // Get featured posts
  getFeaturedPosts() {
    const posts = this.getAllPosts();
    return posts.filter(post => post.featured && post.status === 'published');
  }

  // Search posts
  searchPosts(query) {
    const posts = this.getAllPosts();
    const searchTerm = query.toLowerCase();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Create new post
  createPost(postData) {
    const posts = this.getAllPosts();
    const newPost = {
      ...postData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: postData.status === 'published' ? new Date().toISOString() : null,
      viewCount: 0,
      likes: 0
    };

    posts.push(newPost);
    this.savePosts(posts);
    return newPost;
  }

  // Update post
  updatePost(id, updates) {
    const posts = this.getAllPosts();
    const index = posts.findIndex(post => post.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Post not found');
    }

    const updatedPost = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Set published date if status changed to published
    if (updates.status === 'published' && posts[index].status !== 'published') {
      updatedPost.publishedAt = new Date().toISOString();
    }

    posts[index] = updatedPost;
    this.savePosts(posts);
    return updatedPost;
  }

  // Delete post
  deletePost(id) {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== parseInt(id));
    
    if (filteredPosts.length === posts.length) {
      throw new Error('Post not found');
    }

    this.savePosts(filteredPosts);
    return true;
  }

  // Bulk operations
  bulkUpdatePosts(postIds, updates) {
    const posts = this.getAllPosts();
    const updatedPosts = posts.map(post => {
      if (postIds.includes(post.id)) {
        return {
          ...post,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return post;
    });

    this.savePosts(updatedPosts);
    return updatedPosts.filter(post => postIds.includes(post.id));
  }

  bulkDeletePosts(postIds) {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter(post => !postIds.includes(post.id));
    this.savePosts(filteredPosts);
    return true;
  }

  // Increment view count
  incrementViewCount(id) {
    const posts = this.getAllPosts();
    const index = posts.findIndex(post => post.id === parseInt(id));
    
    if (index !== -1) {
      posts[index].viewCount = (posts[index].viewCount || 0) + 1;
      this.savePosts(posts);
    }
  }

  // Toggle like
  toggleLike(id) {
    const posts = this.getAllPosts();
    const index = posts.findIndex(post => post.id === parseInt(id));
    
    if (index !== -1) {
      posts[index].likes = (posts[index].likes || 0) + 1;
      this.savePosts(posts);
      return posts[index].likes;
    }
    return 0;
  }

  // Get statistics
  getStatistics() {
    const posts = this.getAllPosts();
    const published = posts.filter(p => p.status === 'published');
    const drafts = posts.filter(p => p.status === 'draft');
    const featured = posts.filter(p => p.featured);
    
    return {
      total: posts.length,
      published: published.length,
      drafts: drafts.length,
      featured: featured.length,
      totalViews: posts.reduce((sum, post) => sum + (post.viewCount || 0), 0),
      totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0)
    };
  }

  // Get categories with post counts
  getCategories() {
    const posts = this.getAllPosts();
    const categories = {};
    
    posts.forEach(post => {
      categories[post.category] = (categories[post.category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, count]) => ({
      name,
      count,
      slug: name
    }));
  }

  // Get all tags with usage counts
  getTags() {
    const posts = this.getAllPosts();
    const tags = {};
    
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });

    return Object.entries(tags)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Helper methods
  generateId() {
    const posts = this.getAllPosts();
    const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
    return maxId + 1;
  }

  savePosts(posts) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
      throw new Error('Failed to save posts');
    }
  }

  // Export/Import functionality
  exportPosts() {
    const posts = this.getAllPosts();
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `blog-posts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  importPosts(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPosts = JSON.parse(e.target.result);
          if (Array.isArray(importedPosts)) {
            this.savePosts(importedPosts);
            resolve(importedPosts.length);
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(new Error('Error parsing file: ' + error.message));
        }
      };
      reader.readAsText(file);
    });
  }
}

// Create singleton instance
export const postsAPI = new PostsAPI();

// Convenience functions
export const getAllPosts = () => postsAPI.getAllPosts();
export const getPostById = (id) => postsAPI.getPostById(id);
export const createPost = (postData) => postsAPI.createPost(postData);
export const updatePost = (id, updates) => postsAPI.updatePost(id, updates);
export const deletePost = (id) => postsAPI.deletePost(id);
export const getPostStatistics = () => postsAPI.getStatistics();