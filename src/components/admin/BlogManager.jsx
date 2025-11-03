import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current view based on URL
  const getCurrentView = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/drafts')) return 'drafts';
    if (path.includes('/posts')) return 'published';
    return 'all';
  }, [location.pathname]);

  const [view, setView] = useState(() => getCurrentView());

  // Update view when URL changes
  useEffect(() => {
    setView(getCurrentView());
  }, [getCurrentView]);

  const handleViewChange = (newView) => {
    const basePath = '/admin/blog';
    const paths = {
      'all': basePath,
      'published': `${basePath}/posts`,
      'drafts': `${basePath}/drafts`
    };
    navigate(paths[newView]);
  };

  useEffect(() => {
    // Load blog posts from localStorage
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch {
        setPosts([]);
      }
    }
  }, []);

  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    savePosts(updatedPosts);
  };

  const togglePostStatus = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          status: post.status === 'published' ? 'draft' : 'published',
          publishedAt: post.status === 'draft' ? new Date().toISOString() : post.publishedAt
        };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const filteredPosts = posts.filter(post => {
    if (view === 'drafts') return post.status === 'draft';
    if (view === 'published') return post.status === 'published';
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="blog-manager">
        <div className="blog-header">
          <h1>Blog Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/admin/blog/create'}
          >
            <span className="material-icons">add</span>
            New Blog Post
          </button>
        </div>

        <div className="blog-tabs">
          <button 
            className={view === 'all' ? 'active' : ''}
            onClick={() => handleViewChange('all')}
          >
            All Posts ({posts.length})
          </button>
          <button 
            className={view === 'published' ? 'active' : ''}
            onClick={() => handleViewChange('published')}
          >
            Published ({posts.filter(p => p.status === 'published').length})
          </button>
          <button 
            className={view === 'drafts' ? 'active' : ''}
            onClick={() => handleViewChange('drafts')}
          >
            Drafts ({posts.filter(p => p.status === 'draft').length})
          </button>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">article</span>
            <h3>No blog posts yet</h3>
            <p>Create your first blog post to get started</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/admin/blog/create'}
            >
              Create Blog Post
            </button>
          </div>
        ) : (
          <div className="posts-table">
            <div className="table-header">
              <div className="col-title">Title</div>
              <div className="col-status">Status</div>
              <div className="col-date">Date</div>
              <div className="col-actions">Actions</div>
            </div>
            
            {filteredPosts.map(post => (
              <div key={post.id} className="table-row">
                <div className="col-title">
                  <div className="post-title">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </div>
                
                <div className="col-status">
                  <span className={`status ${post.status}`}>
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div className="col-date">
                  <div className="date-info">
                    {post.status === 'published' && post.publishedAt ? (
                      <>
                        <strong>Published:</strong><br />
                        {formatDate(post.publishedAt)}
                      </>
                    ) : (
                      <>
                        <strong>Created:</strong><br />
                        {formatDate(post.createdAt)}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="col-actions">
                  <div className="action-buttons">
                    <button 
                      className="btn btn-icon"
                      onClick={() => window.location.href = `/admin/blog/edit/${post.id}`}
                      title="Edit post"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    
                    <button 
                      className="btn btn-icon"
                      onClick={() => togglePostStatus(post.id)}
                      title={post.status === 'published' ? 'Move to drafts' : 'Publish post'}
                    >
                      <span className="material-icons">
                        {post.status === 'published' ? 'visibility_off' : 'publish'}
                      </span>
                    </button>
                    
                    <button 
                      className="btn btn-icon danger"
                      onClick={() => deletePost(post.id)}
                      title="Delete post"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}