import React from 'react';
import AdminLayout from './AdminLayout';

export default function AllPosts() {
  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>All Posts</h1>
        <p>View and manage all posts in your CMS. Edit, delete, or review published and draft posts here.</p>
      </section>
    </AdminLayout>
  );
}
