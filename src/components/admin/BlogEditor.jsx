import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    category: 'web-design',
    status: 'draft',
    featured: false,
    featuredImage: '',
    seoTitle: '',
    seoDescription: ''
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isEditing) {
      // Load post data for editing
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const postToEdit = posts.find(p => p.id === parseInt(id));
        if (postToEdit) {
          setPost(postToEdit);
        }
      }
    }
  }, [id, isEditing]);

  const handleInputChange = (field, value) => {
    setPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !post.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...post.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    handleInputChange('tags', post.tags.filter(t => t !== tag));
  };

  const handleSave = (status = post.status) => {
    const savedPosts = localStorage.getItem('blogPosts');
    let posts = savedPosts ? JSON.parse(savedPosts) : [];
    
    const updatedPost = {
      ...post,
      status,
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || post.excerpt
    };

    if (isEditing) {
      // Update existing post
      posts = posts.map(p => p.id === parseInt(id) ? { ...updatedPost, id: parseInt(id) } : p);
    } else {
      // Create new post
      const newPost = {
        ...updatedPost,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (status === 'published') {
        newPost.publishedAt = new Date().toISOString();
      }
      
      posts.push(newPost);
    }

    localStorage.setItem('blogPosts', JSON.stringify(posts));
    navigate('/admin/blog');
  };

  const handlePublish = () => {
    handleSave('published');
  };

  const handleSaveDraft = () => {
    handleSave('draft');
  };

  return (
    <AdminLayout>
      <div className="blog-editor">
        <div className="editor-header">
          <div className="header-left">
            <button 
              className="btn btn-back"
              onClick={() => navigate('/admin/blog')}
            >
              <span className="material-icons">arrow_back</span>
              Back to Blog
            </button>
            <h1>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
          </div>
          <div className="editor-actions">
            <button className="btn btn-secondary" onClick={handleSaveDraft}>
              <span className="material-icons">save</span>
              Save Draft
            </button>
            <button className="btn btn-primary" onClick={handlePublish}>
              <span className="material-icons">publish</span>
              {isEditing ? 'Update & Publish' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="editor-content">
          <div className="editor-main">
            <div className="form-section">
              <div className="form-group">
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your blog post title"
                  className="title-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  value={post.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Write a brief excerpt (used in previews and SEO)"
                  rows={3}
                  className="excerpt-input"
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={post.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your blog post content here. You can use Markdown formatting."
                  rows={20}
                  className="content-editor"
                />
                <small>Tip: You can use Markdown formatting (e.g., **bold**, *italic*, # headings)</small>
              </div>
            </div>

            <div className="form-section">
              <h3>SEO Settings</h3>
              <div className="form-group">
                <label>SEO Title</label>
                <input
                  type="text"
                  value={post.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="SEO title (leave blank to use post title)"
                />
              </div>

              <div className="form-group">
                <label>SEO Description</label>
                <textarea
                  value={post.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="SEO description (leave blank to use excerpt)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="editor-sidebar">
            <div className="form-section">
              <h3>Post Settings</h3>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={post.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="web-design">Web Design</option>
                  <option value="web-development">Web Development</option>
                  <option value="ui-ux">UI/UX Design</option>
                  <option value="tutorials">Tutorials</option>
                  <option value="industry">Industry News</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                  />
                  Featured Post
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Tags</h3>
              <div className="tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button type="button" className="btn btn-icon" onClick={addTag}>
                  <span className="material-icons">add</span>
                </button>
              </div>
              <div className="tag-list">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button className="btn btn-icon" onClick={() => removeTag(tag)}>
                      <span className="material-icons">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Featured Image</h3>
              <div className="image-upload">
                {post.featuredImage ? (
                  <div className="image-preview">
                    <img src={post.featuredImage} alt="Featured" />
                    <button 
                      className="remove-image"
                      onClick={() => handleInputChange('featuredImage', '')}
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="material-icons">add_photo_alternate</span>
                    <p>Add featured image</p>
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      onBlur={(e) => handleInputChange('featuredImage', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}