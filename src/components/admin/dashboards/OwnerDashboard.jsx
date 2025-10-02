import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../../../contexts/ContentContext';
import AdminLayout from '../AdminLayout';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { exportContent, getBackupInfo } = useContent();
  const [analytics] = useState({
    visitors: 1247,
    pageViews: 3421,
    bounceRate: '34.2%',
    avgSessionTime: '3m 24s',
    conversionRate: '2.8%',
    revenue: '£1,840'
  });

  const [sitePerformance] = useState({
    loadTime: '1.2s',
    uptime: '99.9%',
    seoScore: 95,
    mobileScore: 88,
    securityScore: 100
  });

  // Get real backup information
  const backupInfo = getBackupInfo();

  const handleQuickExport = () => {
    try {
      const result = exportContent();
      alert(`Content exported successfully as ${result.filename}`);
    } catch (error) {
      alert(`Export failed: ${error.message}`);
    }
  };

  const BusinessAnalyticsWidget = ({ data }) => (
    <div className="admin-widget business-analytics">
      <div className="widget-header">
        <span className="material-icons">analytics</span>
        <h3>Business Analytics</h3>
        <button className="widget-action" onClick={() => navigate('/admin/analytics')}>
          Details
        </button>
      </div>
      <div className="widget-content">
        <div className="analytics-grid">
          <div className="metric-card">
            <span className="metric-icon">👥</span>
            <div className="metric-info">
              <span className="metric-value">{data.visitors}</span>
              <span className="metric-label">Visitors</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">📄</span>
            <div className="metric-info">
              <span className="metric-value">{data.pageViews}</span>
              <span className="metric-label">Page Views</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">⏱️</span>
            <div className="metric-info">
              <span className="metric-value">{data.avgSessionTime}</span>
              <span className="metric-label">Avg Session</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">💰</span>
            <div className="metric-info">
              <span className="metric-value">{data.revenue}</span>
              <span className="metric-label">Revenue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SitePerformanceWidget = ({ data }) => (
    <div className="admin-widget site-performance">
      <div className="widget-header">
        <span className="material-icons">speed</span>
        <h3>Site Performance</h3>
        <button className="widget-action" onClick={() => navigate('/admin/performance')}>
          Optimize
        </button>
      </div>
      <div className="widget-content">
        <div className="performance-metrics">
          <div className="performance-item">
            <div className="performance-score">
              <span className="score-value">{data.loadTime}</span>
              <span className="score-label">Load Time</span>
            </div>
            <div className="score-indicator excellent"></div>
          </div>
          <div className="performance-item">
            <div className="performance-score">
              <span className="score-value">{data.seoScore}</span>
              <span className="score-label">SEO Score</span>
            </div>
            <div className="score-indicator excellent"></div>
          </div>
          <div className="performance-item">
            <div className="performance-score">
              <span className="score-value">{data.mobileScore}</span>
              <span className="score-label">Mobile Score</span>
            </div>
            <div className="score-indicator good"></div>
          </div>
          <div className="performance-item">
            <div className="performance-score">
              <span className="score-value">{data.securityScore}</span>
              <span className="score-label">Security</span>
            </div>
            <div className="score-indicator excellent"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const RevenueTrackingWidget = ({ total, growth }) => (
    <div className="admin-widget revenue-tracking">
      <div className="widget-header">
        <span className="material-icons">trending_up</span>
        <h3>Revenue Tracking</h3>
        <button className="widget-action" onClick={() => navigate('/admin/revenue')}>
          Reports
        </button>
      </div>
      <div className="widget-content">
        <div className="revenue-summary">
          <div className="revenue-total">
            <span className="currency">£</span>
            <span className="amount">{total.replace('£', '')}</span>
            <span className="period">This Month</span>
          </div>
          <div className="revenue-growth">
            <span className="growth-indicator positive">{growth}</span>
            <span className="growth-label">vs Last Month</span>
          </div>
        </div>
        <div className="revenue-chart">
          <div className="chart-placeholder">
            📈 Interactive chart would go here
          </div>
        </div>
      </div>
    </div>
  );

  const TeamOverviewWidget = ({ members, activeProjects }) => (
    <div className="admin-widget team-overview">
      <div className="widget-header">
        <span className="material-icons">group</span>
        <h3>Content Management</h3>
        <button className="widget-action" onClick={() => navigate('/admin/backup')}>
          Manage
        </button>
      </div>
      <div className="widget-content">
        <div className="team-stats">
          <div className="team-stat">
            <span className="stat-icon">�</span>
            <div className="stat-info">
              <span className="stat-value">{backupInfo.availableBackups.length}</span>
              <span className="stat-label">Backups Available</span>
            </div>
          </div>
          <div className="team-stat">
            <span className="stat-icon">�</span>
            <div className="stat-info">
              <span className="stat-value">{Math.round(backupInfo.storageInfo.backupSize / 1024)}KB</span>
              <span className="stat-label">Backup Storage</span>
            </div>
          </div>
        </div>
        <button className="btn btn-sm btn-primary" onClick={handleQuickExport} style={{ marginTop: '12px', width: '100%' }}>
          <span className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>download</span>
          Quick Export
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-dashboard owner-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Owner Command Center</h1>
            <p>Business overview and strategic insights</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => navigate('/admin/strategy')}>
              <span className="material-icons btn-icon">assessment</span>
              Strategy Review
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/backup')}>
              <span className="material-icons btn-icon">backup</span>
              Backup & Export
            </button>
          </div>
        </div>

        <div className="dashboard-widgets">
          <div className="widgets-grid owner-grid">
            <BusinessAnalyticsWidget data={analytics} />
            <SitePerformanceWidget data={sitePerformance} />
            <RevenueTrackingWidget total="£1,840" growth="+12.5%" />
            <TeamOverviewWidget members={3} activeProjects={5} />
          </div>
        </div>

        <div className="insights-section">
          <div className="section-header">
            <h2>Strategic Insights</h2>
            <button className="btn btn-text" onClick={() => navigate('/admin/insights')}>
              View All Insights
            </button>
          </div>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <h3>Traffic Growth</h3>
                <p>Website traffic increased by 25% this month, with strong mobile engagement.</p>
                <span className="insight-action">Review mobile strategy →</span>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <h3>Content Performance</h3>
                <p>Recent blog posts show 40% higher engagement than previous content.</p>
                <span className="insight-action">Scale content strategy →</span>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h3>Goal Progress</h3>
                <p>Q4 objectives are 78% complete with strong momentum in key areas.</p>
                <span className="insight-action">Review milestones →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}