import React, { useState } from 'react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the data to your backend or API
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginTop: 4, border: '1px solid #ccc', borderRadius: 4 }}
        />

        <label htmlFor="content" style={{ marginTop: 16 }}>Content</label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginTop: 4, border: '1px solid #ccc', borderRadius: 4, minHeight: 120 }}
        />

        <button type="submit" style={{ marginTop: 24, padding: '10px 24px', background: '#0078d4', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
