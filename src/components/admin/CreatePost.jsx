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
    <section className="cms-section">
      <h1>Create New Post</h1>
      <p>Use this page to create a new post for your website. Fill in the title and content, then publish when ready.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        <button type="submit">
          Publish Post
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
