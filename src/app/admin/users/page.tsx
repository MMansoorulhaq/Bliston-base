'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './users.css';

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.status === 403) {
        router.push('/admin/dashboard');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates: any = {};
      if (newUsername) updates.username = newUsername;
      if (newPassword) updates.password = newPassword;

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('User updated successfully');
        setEditingUser(null);
        setNewUsername('');
        setNewPassword('');
        fetchUsers();
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="users-container">
      <header className="users-header">
        <div className="header-content">
          <div>
            <h1>User Management</h1>
            <p className="header-subtitle">Manage system users and credentials</p>
          </div>
          <div className="header-actions">
            <button onClick={() => router.push('/admin/dashboard')} className="back-button">
              ← Back to Dashboard
            </button>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <div className="users-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </div>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => {
                      setEditingUser(user.id);
                      setNewUsername('');
                      setNewPassword('');
                    }}
                    className="edit-button"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {editingUser === user.id && (
                <div className="edit-form">
                  <div className="form-group">
                    <label>New Username (optional)</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Leave empty to keep current"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password (optional)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave empty to keep current"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      onClick={() => setEditingUser(null)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateUser(user.id)}
                      disabled={loading || (!newUsername && !newPassword)}
                      className="save-button"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              <div className="user-details">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
