'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Role = 'admin' | 'user';
type Orientation = 'portrait' | 'landscape';

type User = {
  id: string;
  username: string;
  password: string;
  role: Role;
};

type LogEntry = {
  id: string;
  user: string;
  action: string;
  timestamp: number;
  details?: string;
};

type AdminContextValue = {
  users: User[];
  currentUser: User | null;
  orientation: Orientation;
  logs: LogEntry[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUser: (id: string, updates: Partial<Pick<User, 'username' | 'password' | 'role'>>) => void;
  impersonate: (id: string) => void;
  setOrientation: (o: Orientation) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

const DEFAULT_USERS: User[] = [
  { id: 'u-admin', username: 'marketing', password: 'marketing@247-247', role: 'admin' },
  { id: 'u-sales', username: 'sales', password: 'sales123', role: 'user' },
  { id: 'u-ops', username: 'ops', password: 'ops123', role: 'user' },
  { id: 'u-support', username: 'support', password: 'support123', role: 'user' },
  { id: 'u-guest', username: 'guest', password: 'guest123', role: 'user' },
];

const USERS_KEY = 'admin_users';
const LOGS_KEY = 'admin_logs';
const ORIENTATION_KEY = 'admin_orientation';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orientation, setOrientationState] = useState<Orientation>('portrait');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_KEY);
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      const storedLogs = localStorage.getItem(LOGS_KEY);
      if (storedLogs) setLogs(JSON.parse(storedLogs));
      const storedOrientation = localStorage.getItem(ORIENTATION_KEY) as Orientation | null;
      if (storedOrientation) setOrientationState(storedOrientation);
    } catch {}
  }, []);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    } catch {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(ORIENTATION_KEY, orientation);
    } catch {}
  }, [orientation]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).slice(2);
    const timestamp = Date.now();
    setLogs(prev => [{ id, timestamp, ...entry }, ...prev].slice(0, 500));
  };

  const login = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      addLog({ user: user.username, action: 'login' });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) addLog({ user: currentUser.username, action: 'logout' });
    setCurrentUser(null);
  };

  const updateUser = (id: string, updates: Partial<Pick<User, 'username' | 'password' | 'role'>>) => {
    setUsers(prev => {
      const next = prev.map(u => (u.id === id ? { ...u, ...updates } : u));
      const actor = currentUser ? currentUser.username : 'system';
      addLog({ user: actor, action: 'update_user', details: id });
      return next;
    });
  };

  const impersonate = (id: string) => {
    const user = users.find(u => u.id === id) || null;
    if (user) {
      const actor = currentUser ? currentUser.username : 'system';
      addLog({ user: actor, action: 'impersonate', details: user.username });
      setCurrentUser(user);
    }
  };

  const setOrientation = (o: Orientation) => {
    setOrientationState(o);
    const actor = currentUser ? currentUser.username : 'system';
    addLog({ user: actor, action: 'set_orientation', details: o });
  };

  const value = useMemo(
    () => ({ users, currentUser, orientation, logs, login, logout, updateUser, impersonate, setOrientation }),
    [users, currentUser, orientation, logs]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('AdminContext');
  return ctx;
}

