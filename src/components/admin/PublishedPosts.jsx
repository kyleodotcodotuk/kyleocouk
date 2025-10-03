import React from 'react';
import AdminLayout from './AdminLayout';

export default function PublishedPosts() {
  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Published Posts</h1>
        <p>See all published posts. You can view, edit, or unpublish posts from this page.</p>
      </section>
    </AdminLayout>
  );
}
