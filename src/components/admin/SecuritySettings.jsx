import React from 'react';
import AdminLayout from './AdminLayout';

export default function SecuritySettings() {
  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Security</h1>
        <p>Configure your account and site security settings here. Use this page to update passwords, enable 2FA, and manage security options.</p>
      </section>
    </AdminLayout>
  );
}
