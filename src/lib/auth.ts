// Simple authentication utilities
export const ADMIN_CREDENTIALS = {
  username: 'marketing',
  password: 'marketing@247-247'
};

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
