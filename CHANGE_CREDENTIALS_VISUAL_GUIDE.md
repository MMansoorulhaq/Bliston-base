# 🎯 Visual Guide: Change Admin Credentials

## 📍 Step-by-Step with Screenshots

### Step 1: Locate the Auth File

```
Your Project
├── src/
│   ├── lib/
│   │   └── auth.ts  ← THIS FILE!
│   ├── app/
│   └── components/
├── public/
└── package.json
```

---

### Step 2: Open `src/lib/auth.ts`

**Current Content:**
```typescript
// Simple authentication utilities
export const ADMIN_CREDENTIALS = {
  username: 'admin',      ← Line 3: Change this username
  password: 'admin123'    ← Line 4: Change this password
};

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
```

---

### Step 3: Edit the Credentials

**Example Change:**

**BEFORE:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};
```

**AFTER:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'myname',           // ← Your new username
  password: 'MySecure2024!'     // ← Your new password
};
```

---

### Step 4: Save and Restart

1. **Save the file** (Ctrl+S or Cmd+S)

2. **Stop the server** in terminal:
   ```
   Press: Ctrl+C
   ```

3. **Start the server again:**
   ```bash
   npm run dev
   ```

4. **You'll see:**
   ```
   ▲ Next.js 16.0.4
   - Local:        http://localhost:3000
   ✓ Ready in 2.3s
   ```

---

### Step 5: Test Your New Login

1. **Open browser:** http://localhost:3000/admin/login

2. **Enter your NEW credentials:**
   ```
   Username: myname
   Password: MySecure2024!
   ```

3. **Click "Login"**

4. **Success!** You should see the dashboard

---

## 🎨 Visual Example

```
┌─────────────────────────────────────────┐
│  📁 src/lib/auth.ts                     │
├─────────────────────────────────────────┤
│                                         │
│  1  // Simple authentication utilities  │
│  2  export const ADMIN_CREDENTIALS = {  │
│  3    username: 'admin',        ← EDIT  │
│  4    password: 'admin123'      ← EDIT  │
│  5  };                                  │
│  6                                      │
│  7  export function validateCredentials │
│  8  ...                                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 💡 Quick Examples

### Example 1: Simple Username Change
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'john',
  password: 'admin123'
};
```

### Example 2: Strong Password
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Str0ng!P@ssw0rd2024'
};
```

### Example 3: Company Admin
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'bliston_admin',
  password: 'Bl1st0n#2024!'
};
```

---

## ⚡ One-Minute Change

**Fastest way to change credentials:**

1. Open: `src/lib/auth.ts`
2. Change lines 3 and 4
3. Save file
4. Restart: `npm run dev`
5. Done! ✅

---

## 🔒 Security Checklist

Before going to production:

- [ ] Changed default `admin/admin123`
- [ ] Used strong password (12+ characters)
- [ ] Password has uppercase, lowercase, numbers, symbols
- [ ] Not using common passwords (password123, admin, etc.)
- [ ] Credentials not committed to Git
- [ ] Using environment variables for production

---

## 📱 Where You'll Use These Credentials

**Login Page:**
```
http://localhost:3000/admin/login

┌─────────────────────────────────┐
│     🔐 Admin Login              │
│  Video Management Portal        │
│                                 │
│  Username: [____________]       │
│  Password: [____________]       │
│                                 │
│       [    Login    ]           │
│                                 │
└─────────────────────────────────┘
```

---

## 🎯 Common Mistakes to Avoid

❌ **Wrong:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: admin,        // Missing quotes!
  password: admin123      // Missing quotes!
};
```

✅ **Correct:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',      // Has quotes
  password: 'admin123'    // Has quotes
};
```

---

❌ **Wrong:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin'       // Missing comma!
  password: 'admin123'
};
```

✅ **Correct:**
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',      // Has comma
  password: 'admin123'
};
```

---

## 🚀 You're All Set!

After following these steps, you'll have:
- ✅ Custom username
- ✅ Secure password
- ✅ Working admin login
- ✅ Protected dashboard

**Remember:** Always use strong passwords for production!
