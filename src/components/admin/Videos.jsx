import React from 'react';
import AdminLayout from './AdminLayout';

export default function Videos() {
  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Videos</h1>
        <p>Manage your video library. Upload, edit, or delete videos here.</p>
      </section>
    </AdminLayout>
  );
}
