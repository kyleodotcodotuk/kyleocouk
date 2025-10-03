import React from 'react';
import AdminLayout from './AdminLayout';

export default function DraftPosts() {
  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Draft Posts</h1>
        <p>Review and manage your draft posts. Edit or publish drafts from this page.</p>
      </section>
    </AdminLayout>
  );
}
