import React, { useState, useRef } from 'react';
import { useContent } from '../../contexts/ContentContext';

export default function BackupManager() {
  const { exportContent, importContent, getBackupInfo, restoreFromBackup } = useContent();
  const [backupInfo, setBackupInfo] = useState(getBackupInfo());
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const refreshBackupInfo = () => {
    setBackupInfo(getBackupInfo());
  };

  const handleExport = () => {
    try {
      const result = exportContent();
      setMessage(`✅ Content exported successfully as ${result.filename}`);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(`❌ Export failed: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setMessage('❌ Please select a JSON backup file');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    setImporting(true);
    try {
      const result = await importContent(file);
      if (result.success) {
        setMessage('✅ Content imported successfully');
        refreshBackupInfo();
      } else {
        setMessage(`❌ Import failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Import failed: ${error.message}`);
    } finally {
      setImporting(false);
      setTimeout(() => setMessage(''), 5000);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleRestore = async (backupKey) => {
    if (!window.confirm('Are you sure you want to restore this backup? Current content will be replaced.')) {
      return;
    }

    try {
      const result = await restoreFromBackup(backupKey);
      if (result.success) {
        setMessage('✅ Backup restored successfully');
        refreshBackupInfo();
      } else {
        setMessage(`❌ Restore failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Restore failed: ${error.message}`);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="backup-manager">
      <div className="backup-header">
        <h2>Content Backup & Export</h2>
        <p>Manage your website content backups and exports</p>
      </div>

      {message && (
        <div className={`backup-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="backup-actions">
        <div className="action-group">
          <h3>Export & Import</h3>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleExport}>
              <span className="material-icons">download</span>
              Export Content
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={handleImportClick}
              disabled={importing}
            >
              <span className="material-icons">upload</span>
              {importing ? 'Importing...' : 'Import Content'}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
        </div>

        <div className="storage-info">
          <h3>Storage Information</h3>
          <div className="storage-stats">
            <div className="stat-item">
              <span className="stat-label">Total Backups:</span>
              <span className="stat-value">{backupInfo.availableBackups.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Backup Storage:</span>
              <span className="stat-value">{formatFileSize(backupInfo.storageInfo.backupSize)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Storage Usage:</span>
              <span className="stat-value">{backupInfo.storageInfo.usagePercentage}%</span>
            </div>
          </div>
          
          <div className="storage-bar">
            <div 
              className="storage-used" 
              style={{ width: `${Math.min(backupInfo.storageInfo.usagePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="backup-history">
        <div className="history-header">
          <h3>Backup History</h3>
          <button className="btn btn-text" onClick={refreshBackupInfo}>
            <span className="material-icons">refresh</span>
            Refresh
          </button>
        </div>

        {backupInfo.availableBackups.length === 0 ? (
          <div className="no-backups">
            <span className="material-icons">backup</span>
            <p>No backups available</p>
            <p className="hint">Backups are created automatically when you update content</p>
          </div>
        ) : (
          <div className="backup-list">
            {backupInfo.availableBackups.map((backup, index) => (
              <div key={backup.key} className="backup-item">
                <div className="backup-info">
                  <div className="backup-date">{backup.date}</div>
                  <div className="backup-time">
                    {new Date(backup.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="backup-type">
                    {backup.autoGenerated ? (
                      <span className="auto-badge">Auto</span>
                    ) : (
                      <span className="manual-badge">Manual</span>
                    )}
                  </div>
                </div>
                <div className="backup-actions">
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleRestore(backup.key)}
                  >
                    <span className="material-icons">restore</span>
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="backup-info-section">
        <h3>About Backups</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="material-icons">schedule</span>
            <div>
              <strong>Automatic Backups</strong>
              <p>Created automatically when you update content</p>
            </div>
          </div>
          <div className="info-item">
            <span className="material-icons">file_download</span>
            <div>
              <strong>Export Backups</strong>
              <p>Download your content as JSON files for safekeeping</p>
            </div>
          </div>
          <div className="info-item">
            <span className="material-icons">history</span>
            <div>
              <strong>Retention Policy</strong>
              <p>Automatic backups are kept for 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}