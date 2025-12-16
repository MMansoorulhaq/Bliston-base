'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';

function LoginView() {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username.trim(), password);
    if (!ok) setError('Invalid credentials');
  };
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{ width: 360, background: '#111827', borderRadius: 12, padding: 24, color: '#fff' }}>
        <h2 style={{ marginBottom: 16 }}>Admin Login</h2>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
          </div>
          {error && <div style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none' }}>Login</button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { currentUser, users, orientation, setOrientation, updateUser, impersonate, logout, logs } = useAdmin();
  const isAdmin = currentUser?.role === 'admin';
  const [editing, setEditing] = useState<Partial<Record<string, { username: string; password: string; role: 'admin' | 'user' }>>>({});
  const startEdit = (id: string, username: string, password: string, role: 'admin' | 'user') => {
    setEditing(prev => ({ ...prev, [id]: { username, password, role } }));
  };
  const applyEdit = (id: string) => {
    const e = editing[id];
    if (!e) return;
    updateUser(id, { username: e.username, password: e.password, role: e.role });
    const { [id]: _, ...rest } = editing;
    setEditing(rest);
  };
  const cancelEdit = (id: string) => {
    const { [id]: _, ...rest } = editing;
    setEditing(rest);
  };
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ color: '#fff' }}>Signed in as {currentUser?.username}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/activity-logs" style={{ padding: '8px 12px', borderRadius: 8, background: '#2563eb', color: '#fff', textDecoration: 'none' }}>Menu</Link>
          <button onClick={logout} style={{ padding: '8px 12px', borderRadius: 8, background: '#374151', color: '#fff', border: 'none' }}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: 16, background: '#111827', borderRadius: 12, padding: 16, color: '#fff' }}>
        <h3 style={{ marginBottom: 12 }}>Orientation</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setOrientation('portrait')} style={{ padding: '8px 12px', borderRadius: 8, background: orientation === 'portrait' ? '#2563eb' : '#374151', color: '#fff', border: 'none' }}>Portrait 1080×1920</button>
          <button onClick={() => setOrientation('landscape')} style={{ padding: '8px 12px', borderRadius: 8, background: orientation === 'landscape' ? '#2563eb' : '#374151', color: '#fff', border: 'none' }}>Landscape Responsive</button>
        </div>
        <div className={orientation === 'portrait' ? 'admin-portrait' : 'admin-landscape'} style={{ border: '1px dashed #374151', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
          <div style={{ color: '#9ca3af' }}>{orientation === 'portrait' ? 'Portrait: 1080×1920 fixed' : 'Landscape: responsive to screen size'}</div>
        </div>
      </div>

      {isAdmin && (
        <div style={{ marginBottom: 16, background: '#111827', borderRadius: 12, padding: 16, color: '#fff' }}>
          <h3 style={{ marginBottom: 12 }}>User Management</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Username</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Password</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const e = editing[u.id];
                  return (
                    <tr key={u.id}>
                      <td style={{ padding: 8 }}>
                        {e ? (
                          <input value={e.username} onChange={ev => setEditing(prev => ({ ...prev, [u.id]: { ...prev[u.id]!, username: ev.target.value } }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                        ) : (
                          <span style={{ color: '#fff' }}>{u.username}</span>
                        )}
                      </td>
                      <td style={{ padding: 8 }}>
                        {e ? (
                          <input value={e.password} onChange={ev => setEditing(prev => ({ ...prev, [u.id]: { ...prev[u.id]!, password: ev.target.value } }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                        ) : (
                          <span style={{ color: '#9ca3af' }}>••••••••</span>
                        )}
                      </td>
                      <td style={{ padding: 8 }}>
                        {e ? (
                          <select value={e.role} onChange={ev => setEditing(prev => ({ ...prev, [u.id]: { ...prev[u.id]!, role: ev.target.value as 'admin' | 'user' } }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span style={{ color: '#fff' }}>{u.role}</span>
                        )}
                      </td>
                      <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                        {!e && (
                          <button onClick={() => startEdit(u.id, u.username, u.password, u.role)} style={{ padding: '6px 10px', borderRadius: 8, background: '#374151', color: '#fff', border: 'none' }}>Edit</button>
                        )}
                        {e && (
                          <>
                            <button onClick={() => applyEdit(u.id)} style={{ padding: '6px 10px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none' }}>Save</button>
                            <button onClick={() => cancelEdit(u.id)} style={{ padding: '6px 10px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none' }}>Cancel</button>
                          </>
                        )}
                        <button onClick={() => impersonate(u.id)} style={{ padding: '6px 10px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none' }}>Impersonate</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16, background: '#111827', borderRadius: 12, padding: 16, color: '#fff' }}>
        <h3 style={{ marginBottom: 12 }}>Activity Logs</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {logs.slice(0, 50).map(l => (
            <div key={l.id} style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#9ca3af' }}>
              <span>{new Date(l.timestamp).toLocaleString()}</span>
              <span>•</span>
              <span>{l.user}</span>
              <span>•</span>
              <span>{l.action}</span>
              {l.details && (
                <>
                  <span>•</span>
                  <span>{l.details}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminGate />;
}

function AdminGate() {
  const { currentUser } = useAdmin();
  if (!currentUser) return <LoginView />;
  return <AdminDashboard />;
}
