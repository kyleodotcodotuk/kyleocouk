import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';

export default function EditorDashboard() {
  const navigate = useNavigate();
  const [contentStats] = useState({
    totalPosts: 24,
    drafts: 3,
    published: 21,
    scheduled: 2,
    views: 8420,
    engagement: '4.2%'
  });

  const [recentContent] = useState([
    { id: 1, title: 'Getting Started with React', status: 'published', date: '2024-10-01', views: 342 },
    { id: 2, title: 'Modern CSS Techniques', status: 'draft', date: '2024-09-30', views: 0 },
    { id: 3, title: 'JavaScript Best Practices', status: 'scheduled', date: '2024-10-05', views: 0 },
    { id: 4, title: 'Web Performance Tips', status: 'published', date: '2024-09-28', views: 218 }
  ]);

  const [mediaLibrary] = useState({
    totalFiles: 156,
    images: 89,
    documents: 34,
    audio: 21,
    storageUsed: '2.1GB',
    storageLimit: '10GB'
  });

  const ContentManagementWidget = ({ stats }) => (
    <div className="admin-widget content-management">
      <div className="widget-header">
        <span className="material-icons">article</span>
        <h3>Content Overview</h3>
        <button className="widget-action" onClick={() => navigate('/admin/content')}>
          Manage
        </button>
      </div>
      <div className="widget-content">
        <div className="content-stats">
          <div className="stat-group">
            <div className="stat-item primary">
              <span className="stat-value">{stats.totalPosts}</span>
              <span className="stat-label">Total Posts</span>
            </div>
            <div className="stat-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-dot published"></span>
                <span className="breakdown-label">Published: {stats.published}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-dot draft"></span>
                <span className="breakdown-label">Drafts: {stats.drafts}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-dot scheduled"></span>
                <span className="breakdown-label">Scheduled: {stats.scheduled}</span>
              </div>
            </div>
          </div>
          <div className="engagement-metrics">
            <div className="metric">
              <span className="metric-icon">👁️</span>
              <div className="metric-info">
                <span className="metric-value">{stats.views}</span>
                <span className="metric-label">Total Views</span>
              </div>
            </div>
            <div className="metric">
              <span className="metric-icon">💬</span>
              <div className="metric-info">
                <span className="metric-value">{stats.engagement}</span>
                <span className="metric-label">Engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MediaLibraryWidget = ({ media }) => (
    <div className="admin-widget media-library">
      <div className="widget-header">
        <span className="material-icons">perm_media</span>
        <h3>Media Library</h3>
        <button className="widget-action" onClick={() => navigate('/admin/media')}>
          Browse
        </button>
      </div>
      <div className="widget-content">
        <div className="media-overview">
          <div className="media-count">
            <span className="total-files">{media.totalFiles}</span>
            <span className="files-label">Total Files</span>
          </div>
          <div className="media-breakdown">
            <div className="media-type">
              <span className="type-icon">🖼️</span>
              <span className="type-count">{media.images}</span>
              <span className="type-label">Images</span>
            </div>
            <div className="media-type">
              <span className="type-icon">📄</span>
              <span className="type-count">{media.documents}</span>
              <span className="type-label">Docs</span>
            </div>
            <div className="media-type">
              <span className="type-icon">🎵</span>
              <span className="type-count">{media.audio}</span>
              <span className="type-label">Audio</span>
            </div>
          </div>
          <div className="storage-info">
            <div className="storage-bar">
              <div className="storage-used" style={{width: '21%'}}></div>
            </div>
            <span className="storage-text">{media.storageUsed} of {media.storageLimit} used</span>
          </div>
        </div>
      </div>
    </div>
  );

  const PublishingToolsWidget = () => (
    <div className="admin-widget publishing-tools">
      <div className="widget-header">
        <span className="material-icons">publish</span>
        <h3>Publishing Tools</h3>
      </div>
      <div className="widget-content">
        <div className="publishing-actions">
          <button className="publish-action primary" onClick={() => navigate('/admin/content/new')}>
            <span className="material-icons">add</span>
            <div className="action-info">
              <span className="action-title">New Post</span>
              <span className="action-desc">Create fresh content</span>
            </div>
          </button>
          <button className="publish-action" onClick={() => navigate('/admin/content/drafts')}>
            <span className="material-icons">edit</span>
            <div className="action-info">
              <span className="action-title">Edit Drafts</span>
              <span className="action-desc">Continue writing</span>
            </div>
          </button>
          <button className="publish-action" onClick={() => navigate('/admin/content/schedule')}>
            <span className="material-icons">schedule</span>
            <div className="action-info">
              <span className="action-title">Schedule Posts</span>
              <span className="action-desc">Plan publications</span>
            </div>
          </button>
          <button className="publish-action" onClick={() => navigate('/admin/content/seo')}>
            <span className="material-icons">search</span>
            <div className="action-info">
              <span className="action-title">SEO Tools</span>
              <span className="action-desc">Optimize content</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const ContentCalendarWidget = () => (
    <div className="admin-widget content-calendar">
      <div className="widget-header">
        <span className="material-icons">calendar_today</span>
        <h3>Content Calendar</h3>
        <button className="widget-action" onClick={() => navigate('/admin/calendar')}>
          Full View
        </button>
      </div>
      <div className="widget-content">
        <div className="calendar-preview">
          <div className="calendar-day">
            <span className="day-number">2</span>
            <span className="day-name">Today</span>
            <div className="day-events">
              <div className="event published">React Guide Live</div>
            </div>
          </div>
          <div className="calendar-day">
            <span className="day-number">5</span>
            <span className="day-name">Fri</span>
            <div className="day-events">
              <div className="event scheduled">JS Best Practices</div>
            </div>
          </div>
          <div className="calendar-day">
            <span className="day-number">8</span>
            <span className="day-name">Mon</span>
            <div className="day-events">
              <div className="event draft">CSS Tutorial</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-dashboard editor-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Content Management Hub</h1>
            <p>Create, edit, and publish amazing content</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => navigate('/admin/content/new')}>
              <span className="material-icons btn-icon">add</span>
              New Content
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/content/analytics')}>
              <span className="material-icons btn-icon">analytics</span>
              Content Analytics
            </button>
          </div>
        </div>

        <div className="dashboard-widgets">
          <div className="widgets-grid editor-grid">
            <ContentManagementWidget stats={contentStats} />
            <MediaLibraryWidget media={mediaLibrary} />
            <PublishingToolsWidget />
            <ContentCalendarWidget />
          </div>
        </div>

        <div className="recent-content-section">
          <div className="section-header">
            <h2>Recent Content</h2>
            <button className="btn btn-text" onClick={() => navigate('/admin/content')}>
              View All Content
            </button>
          </div>
          <div className="content-list">
            {recentContent.map(content => (
              <div key={content.id} className="content-item">
                <div className="content-info">
                  <h3 className="content-title">{content.title}</h3>
                  <div className="content-meta">
                    <span className={`status ${content.status}`}>{content.status}</span>
                    <span className="content-date">{content.date}</span>
                    <span className="content-views">{content.views} views</span>
                  </div>
                </div>
                <div className="content-actions">
                  <button className="btn btn-sm" onClick={() => navigate(`/admin/content/edit/${content.id}`)}>
                    <span className="material-icons">edit</span>
                    Edit
                  </button>
                  {content.status === 'published' && (
                    <button className="btn btn-sm" onClick={() => window.open(`/content/${content.id}`, '_blank')}>
                      <span className="material-icons">visibility</span>
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}