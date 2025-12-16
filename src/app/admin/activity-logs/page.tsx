'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './activity-logs.css';

interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  timestamp: string;
  date?: string;
  time?: string;
  targetUserId?: string;
  targetUsername?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, { old: string; new: string }>;
  metadata?: Record<string, any>;
}

interface UserSession {
  userId: string;
  username: string;
  role: 'admin' | 'user';
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchUserSession();
    fetchLogs();
  }, []);

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUserSession(data.user);
      } else {
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
      router.push('/admin/login');
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/activity-logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAction === 'all' || log.action === filterAction;
    
    return matchesSearch && matchesFilter;
  });

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  return (
    <div className="logs-container">
      <header className="logs-header">
        <div className="header-content">
          <div className="header-left">
            <div>
              <h1>📋 Activity Logs</h1>
              <p className="header-subtitle">
                {userSession && (
                  <span className="user-badge">
                    {userSession.role === 'admin' ? '👑' : '👤'} {userSession.username} ({userSession.role})
                  </span>
                )}
                {' • '}
                {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => router.push('/admin/dashboard')} 
              className="back-button"
              title="Back to Dashboard"
            >
              ← Dashboard
            </button>
            <button onClick={handleLogout} className="logout-button">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="logs-content">
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="logs-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">⏳</div>
              <p>Loading logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Logs Found</h3>
              <p>{searchTerm || filterAction !== 'all' ? 'Try adjusting your filters' : 'No activity logs available yet'}</p>
            </div>
          ) : (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="timestamp-cell">
                      <div className="timestamp-date">{log.date || new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="timestamp-time">{log.time || new Date(log.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="user-cell">
                      <div className="user-name">{log.username}</div>
                      <div className="user-id">ID: {log.userId}</div>
                      {log.targetUsername && (
                        <div className="target-user">→ {log.targetUsername}</div>
                      )}
                    </td>
                    <td className="action-cell">
                      <span className={`action-badge ${log.action.toLowerCase().replace('_', '-')}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="details-cell">
                      <div className="details-text">{log.details}</div>
                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <div className="changes-info">
                          {Object.entries(log.changes).map(([field, change]) => (
                            <div key={field} className="change-item">
                              <strong>{field}:</strong> {change.old} → {change.new}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="ip-cell">
                      {log.ipAddress || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
