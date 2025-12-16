// User Management System
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  timestamp: string;
}

// Hard-coded users (in production, use database)
export const USERS: User[] = [
  {
    id: '1',
    username: 'marketing',
    password: 'marketing@247-247',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user1',
    password: 'user1pass',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'user2',
    password: 'user2pass',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    username: 'user3',
    password: 'user3pass',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    username: 'user4',
    password: 'user4pass',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

export function validateUser(username: string, password: string): User | null {
  const user = USERS.find(u => u.username === username && u.password === password);
  return user || null;
}

export function getUserById(id: string): User | null {
  return USERS.find(u => u.id === id) || null;
}

export function getUserByUsername(username: string): User | null {
  return USERS.find(u => u.username === username) || null;
}

export function updateUser(id: string, updates: Partial<User>): boolean {
  const index = USERS.findIndex(u => u.id === id);
  if (index === -1) return false;
  
  USERS[index] = { ...USERS[index], ...updates };
  return true;
}

export function getAllUsers(): User[] {
  return USERS.map(u => ({ ...u, password: '***' })); // Don't expose passwords
}
