import React from 'react';
import AdminLayout from './AdminLayout';
import CreatePost from './CreatePost';

export default function NewPage() {
  return (
    <AdminLayout>
      <CreatePost />
    </AdminLayout>
  );
}
