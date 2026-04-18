import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { usersAPI } from '../data/users';
import { mediaAPI } from '../data/media';

// Create contexts
const CMSDataContext = createContext();
const CMSDispatchContext = createContext();

// Action types
export const CMS_ACTIONS = {
  // Media
  MEDIA_LOADED: 'MEDIA_LOADED',
  MEDIA_UPLOADED: 'MEDIA_UPLOADED',
  MEDIA_UPDATED: 'MEDIA_UPDATED',
  MEDIA_DELETED: 'MEDIA_DELETED',
  MEDIA_BULK_DELETED: 'MEDIA_BULK_DELETED',

  // UI State
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',

  // Filters and Search
  SET_POSTS_FILTER: 'SET_POSTS_FILTER',
  SET_MEDIA_FILTER: 'SET_MEDIA_FILTER',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY'
};

// Initial state
const initialState = {
  // Data
  posts: [],
  users: [],
  media: [],
  
  // Current user and session
  currentUser: null,
  session: null,
  
  // UI State
  loading: {
    posts: false,
    users: false,
    media: false,
    global: false
  },
  error: null,
  notification: null,
  
  // Filters and search
  filters: {
    posts: {
      status: 'all',
      category: 'all',
      author: 'all'
    },
    media: {
      category: 'all',
      folder: 'all'
    }
  },
  searchQuery: '',
  
  // Statistics
  statistics: {
    posts: null,
    users: null,
    media: null
  }
};

// Reducer
function cmsReducer(state, action) {
  switch (action.type) {
    // Posts
    case CMS_ACTIONS.POSTS_LOADED:
      return {
        ...state,
        posts: action.payload,
        loading: { ...state.loading, posts: false }
      };
    
    case CMS_ACTIONS.POST_CREATED:
      return {
        ...state,
        posts: [...state.posts, action.payload]
      };
    
    case CMS_ACTIONS.POST_UPDATED:
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload.id ? action.payload : post
        )
      };
    
    case CMS_ACTIONS.POST_DELETED:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };
    
    case CMS_ACTIONS.POSTS_BULK_UPDATED:
      return {
        ...state,
        posts: state.posts.map(post => {
          const updatedPost = action.payload.find(p => p.id === post.id);
          return updatedPost || post;
        })
      };

    // Users
    case CMS_ACTIONS.USERS_LOADED:
      return {
        ...state,
        users: action.payload,
        loading: { ...state.loading, users: false }
      };
    
    case CMS_ACTIONS.USER_CREATED:
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    
    case CMS_ACTIONS.USER_UPDATED:
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    
    case CMS_ACTIONS.USER_DELETED:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    
    case CMS_ACTIONS.SESSION_UPDATED:
      return {
        ...state,
        currentUser: action.payload.user,
        session: action.payload.session
      };

    // Media
    case CMS_ACTIONS.MEDIA_LOADED:
      return {
        ...state,
        media: action.payload,
        loading: { ...state.loading, media: false }
      };
    
    case CMS_ACTIONS.MEDIA_UPLOADED:
      return {
        ...state,
        media: Array.isArray(action.payload) 
          ? [...state.media, ...action.payload]
          : [...state.media, action.payload]
      };
    
    case CMS_ACTIONS.MEDIA_UPDATED:
      return {
        ...state,
        media: state.media.map(file => 
          file.id === action.payload.id ? action.payload : file
        )
      };
    
    case CMS_ACTIONS.MEDIA_DELETED:
      return {
        ...state,
        media: state.media.filter(file => file.id !== action.payload)
      };
    
    case CMS_ACTIONS.MEDIA_BULK_DELETED:
      return {
        ...state,
        media: state.media.filter(file => !action.payload.includes(file.id))
      };

    // UI State
    case CMS_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.value
        }
      };
    
    case CMS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case CMS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case CMS_ACTIONS.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload
      };
    
    case CMS_ACTIONS.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null
      };

    // Filters and Search
    case CMS_ACTIONS.SET_POSTS_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          posts: {
            ...state.filters.posts,
            ...action.payload
          }
        }
      };
    
    case CMS_ACTIONS.SET_MEDIA_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          media: {
            ...state.filters.media,
            ...action.payload
          }
        }
      };
    
    case CMS_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };

    default:
      return state;
  }
}

// Provider component
export function CMSDataProvider({ children }) {
  const [state, dispatch] = useReducer(cmsReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load current user and session
      const currentUser = usersAPI.getCurrentUser();
      const session = usersAPI.getCurrentSession();
      
      if (currentUser) {
        dispatch({
          type: CMS_ACTIONS.SESSION_UPDATED,
          payload: { user: currentUser, session }
        });
      }

      // Load all data
      await Promise.all([
        loadPosts(),
        loadUsers(),
        loadMedia()
      ]);
    } catch (error) {
      dispatch({
        type: CMS_ACTIONS.SET_ERROR,
        payload: 'Failed to load initial data: ' + error.message
      });
    }
  };

  const loadPosts = async () => {
    dispatch({ type: CMS_ACTIONS.SET_LOADING, payload: { type: 'posts', value: true } });
    try {
      const posts = postsAPI.getAllPosts();
      dispatch({ type: CMS_ACTIONS.POSTS_LOADED, payload: posts });
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: 'Failed to load posts: ' + error.message });
    }
  };

  const loadUsers = async () => {
    dispatch({ type: CMS_ACTIONS.SET_LOADING, payload: { type: 'users', value: true } });
    try {
      const users = usersAPI.getAllUsers();
      dispatch({ type: CMS_ACTIONS.USERS_LOADED, payload: users });
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: 'Failed to load users: ' + error.message });
    }
  };

  const loadMedia = async () => {
    dispatch({ type: CMS_ACTIONS.SET_LOADING, payload: { type: 'media', value: true } });
    try {
      const media = mediaAPI.getAllMedia();
      dispatch({ type: CMS_ACTIONS.MEDIA_LOADED, payload: media });
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: 'Failed to load media: ' + error.message });
    }
  };

  const value = {
    state,
    dispatch,
    // Data loaders
    loadPosts,
    loadUsers,
    loadMedia,
    loadInitialData,
    // Computed properties
    get filteredPosts() {
      let filtered = state.posts;
      const { status, category, author } = state.filters.posts;
      
      if (status !== 'all') {
        filtered = filtered.filter(post => post.status === status);
      }
      if (category !== 'all') {
        filtered = filtered.filter(post => post.category === category);
      }
      if (author !== 'all') {
        filtered = filtered.filter(post => post.authorId === parseInt(author));
      }
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return filtered;
    },
    
    get filteredMedia() {
      let filtered = state.media;
      const { category, folder } = state.filters.media;
      
      if (category !== 'all') {
        filtered = filtered.filter(file => file.category === category);
      }
      if (folder !== 'all') {
        filtered = filtered.filter(file => file.folder === folder);
      }
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(file =>
          file.filename.toLowerCase().includes(query) ||
          file.title.toLowerCase().includes(query) ||
          file.description.toLowerCase().includes(query) ||
          file.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return filtered;
    },
    
    get statistics() {
      return {
        posts: postsAPI.getStatistics(),
        users: usersAPI.getUserStatistics(),
        media: mediaAPI.getMediaStatistics()
      };
    }
  };

  return (
    <CMSDataContext.Provider value={value}>
      <CMSDispatchContext.Provider value={dispatch}>
        {children}
      </CMSDispatchContext.Provider>
    </CMSDataContext.Provider>
  );
}

// Custom hooks
export function useCMSData() {
  const context = useContext(CMSDataContext);
  if (context === undefined) {
    throw new Error('useCMSData must be used within a CMSDataProvider');
  }
  return context;
}

export function useCMSDispatch() {
  const context = useContext(CMSDispatchContext);
  if (context === undefined) {
    throw new Error('useCMSDispatch must be used within a CMSDataProvider');
  }
  return context;
}

// Action creators for common operations
export const cmsActions = {
  // Posts
  createPost: (postData) => async (dispatch) => {
    try {
      const newPost = postsAPI.createPost(postData);
      dispatch({ type: CMS_ACTIONS.POST_CREATED, payload: newPost });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'Post created successfully!' }
      });
      return newPost;
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  updatePost: (id, updates) => async (dispatch) => {
    try {
      const updatedPost = postsAPI.updatePost(id, updates);
      dispatch({ type: CMS_ACTIONS.POST_UPDATED, payload: updatedPost });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'Post updated successfully!' }
      });
      return updatedPost;
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  deletePost: (id) => async (dispatch) => {
    try {
      postsAPI.deletePost(id);
      dispatch({ type: CMS_ACTIONS.POST_DELETED, payload: id });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'Post deleted successfully!' }
      });
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  // Users
  createUser: (userData) => async (dispatch) => {
    try {
      const newUser = usersAPI.createUser(userData);
      dispatch({ type: CMS_ACTIONS.USER_CREATED, payload: newUser });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'User created successfully!' }
      });
      return newUser;
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  updateUser: (id, updates) => async (dispatch) => {
    try {
      const updatedUser = usersAPI.updateUser(id, updates);
      dispatch({ type: CMS_ACTIONS.USER_UPDATED, payload: updatedUser });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'User updated successfully!' }
      });
      return updatedUser;
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  deleteUser: (id) => async (dispatch) => {
    try {
      usersAPI.deleteUser(id);
      dispatch({ type: CMS_ACTIONS.USER_DELETED, payload: id });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'User deleted successfully!' }
      });
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  // Media
  uploadMedia: (files, metadata) => async (dispatch) => {
    try {
      const uploadPromises = Array.from(files).map(file => 
        mediaAPI.uploadFile(file, metadata)
      );
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

      if (successful.length > 0) {
        dispatch({ type: CMS_ACTIONS.MEDIA_UPLOADED, payload: successful });
        dispatch({
          type: CMS_ACTIONS.SET_NOTIFICATION,
          payload: { 
            type: 'success', 
            message: `${successful.length} file(s) uploaded successfully!` 
          }
        });
      }

      if (failed.length > 0) {
        dispatch({
          type: CMS_ACTIONS.SET_ERROR,
          payload: `Failed to upload ${failed.length} file(s): ${failed[0]?.message || 'Unknown error'}`
        });
      }

      return { successful, failed };
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  updateMedia: (id, updates) => async (dispatch) => {
    try {
      const updatedFile = mediaAPI.updateMedia(id, updates);
      dispatch({ type: CMS_ACTIONS.MEDIA_UPDATED, payload: updatedFile });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'Media updated successfully!' }
      });
      return updatedFile;
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  deleteMedia: (id) => async (dispatch) => {
    try {
      mediaAPI.deleteMedia(id);
      dispatch({ type: CMS_ACTIONS.MEDIA_DELETED, payload: id });
      dispatch({
        type: CMS_ACTIONS.SET_NOTIFICATION,
        payload: { type: 'success', message: 'Media deleted successfully!' }
      });
    } catch (error) {
      dispatch({ type: CMS_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  // UI Actions
  showNotification: (type, message) => (dispatch) => {
    dispatch({
      type: CMS_ACTIONS.SET_NOTIFICATION,
      payload: { type, message }
    });
  },

  clearError: () => (dispatch) => {
    dispatch({ type: CMS_ACTIONS.CLEAR_ERROR });
  },

  clearNotification: () => (dispatch) => {
    dispatch({ type: CMS_ACTIONS.CLEAR_NOTIFICATION });
  }
};