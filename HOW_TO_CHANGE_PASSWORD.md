# 🔐 How to Change Admin Username and Password

## Quick Guide

### Method 1: Edit the Auth File Directly (Recommended)

1. **Open the file:** `src/lib/auth.ts`

2. **Find these lines:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};
```

3. **Change to your desired credentials:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'info@247-247.net',      // ← Change this
  password: 'mySecurePass247'  // ← Change this
};
```

4. **Save the file**

5. **Restart your development server:**
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

6. **Done!** Login with your new credentials at http://localhost:3000/admin/login

---

## Method 2: Use Environment Variables (Production Recommended)

For better security in production, use environment variables:

### Step 1: Update `src/lib/auth.ts`

Replace the entire file content with:

```typescript
// Simple authentication utilities
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
```

### Step 2: Create/Update `.env.local` file

In your project root, create or edit `.env.local`:

```env
ADMIN_USERNAME=myusername
ADMIN_PASSWORD=mySecurePassword123
```

### Step 3: Restart Server

```bash
npm run dev
```

---

## Examples

### Example 1: Simple Change
```typescript
// In src/lib/auth.ts
export const ADMIN_CREDENTIALS = {
  username: 'john',
  password: 'MyPass2024!'
};
```

### Example 2: Multiple Admins (Advanced)

If you want multiple admin users, update `src/lib/auth.ts`:

```typescript
// Multiple admin users
const ADMIN_USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'john', password: 'john123' },
  { username: 'sarah', password: 'sarah456' }
];

export function validateCredentials(username: string, password: string): boolean {
  return ADMIN_USERS.some(
    user => user.username === username && user.password === password
  );
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
```

---

## Security Best Practices

### ⚠️ Important Security Notes:

1. **Never commit passwords to Git**
   - Add `.env.local` to `.gitignore` (already done)
   - Use environment variables for production

2. **Use strong passwords**
   - At least 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Example: `MyStr0ng!Pass2024`

3. **For Production:**
   - Use environment variables
   - Consider using a proper authentication system (NextAuth.js)
   - Implement password hashing (bcrypt)
   - Add rate limiting to prevent brute force attacks

4. **Change default credentials immediately**
   - The default `admin/admin123` is insecure
   - Change it before deploying to production

---

## Testing Your New Credentials

1. **Stop the server** (if running)
2. **Clear browser cookies** (optional but recommended)
3. **Start the server:** `npm run dev`
4. **Go to:** http://localhost:3000/admin/login
5. **Login with your new credentials**

---

## Troubleshooting

### Problem: Can't login with new credentials

**Solution:**
1. Check you saved the file correctly
2. Restart the development server
3. Clear browser cache/cookies
4. Check for typos in username/password

### Problem: Environment variables not working

**Solution:**
1. Make sure `.env.local` is in the project root (same folder as `package.json`)
2. Restart the server after creating/editing `.env.local`
3. Check there are no spaces around the `=` sign
4. Make sure the file is named exactly `.env.local` (not `.env.local.txt`)

### Problem: Still seeing old credentials

**Solution:**
1. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear all cookies for localhost
3. Restart the development server
4. Check you edited the correct file (`src/lib/auth.ts`)

---

## Quick Reference

| What to Change | File Location | Line to Edit |
|----------------|---------------|--------------|
| Username & Password | `src/lib/auth.ts` | Lines 2-5 |
| Environment Variables | `.env.local` | Add `ADMIN_USERNAME` and `ADMIN_PASSWORD` |

---

## Need Help?

If you're still having issues:
1. Check the file `src/lib/auth.ts` is saved
2. Make sure the server restarted
3. Try logging in with the exact credentials you set
4. Check browser console for errors (F12)

---

**Remember:** Always use strong, unique passwords for production deployments!
