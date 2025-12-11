# Quick Start Guide - Video Management Portal

## 🚀 Get Started in 3 Steps

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: Login to Admin Panel
1. Open http://localhost:3000/admin/login
2. Login with:
   - Username: `admin`
   - Password: `admin123`

### Step 3: Upload Your Video
1. Click "Choose Video File"
2. Select a video with **1080×1920 resolution** (vertical)
3. Click "Upload Video"
4. Confirm the upload

✅ Done! Your video is now playing on the main page at http://localhost:3000

---

## 📋 Key Features

### ✅ What's Included
- 🔐 Secure login system
- 📤 Video upload with validation
- 🎥 Auto-play & loop on main page
- 📊 Video details (size, resolution, duration)
- 🗑️ Delete video option
- 👁️ Preview before upload
- ⚠️ Error handling & validation

### 🎯 Video Requirements
- **Resolution:** 1080 × 1920 (vertical/portrait)
- **Format:** MP4, WebM, or OGG
- **Behavior:** Auto-play, loop forever

---

## 🔗 Important URLs

| Page | URL | Description |
|------|-----|-------------|
| Main Page | http://localhost:3000 | Public video display |
| Admin Login | http://localhost:3000/admin/login | Login page |
| Dashboard | http://localhost:3000/admin/dashboard | Upload & manage videos |

---

## 🛠️ Common Tasks

### Change Admin Password
Edit `src/lib/auth.ts`:
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'your_new_password'  // Change this
};
```

### Test Video Upload
1. Use a video with exactly 1080×1920 resolution
2. If you don't have one, you can create a test video or use online tools
3. The system will reject videos with wrong resolution

### View Logs
Check the terminal where `npm run dev` is running for:
- Upload status
- Error messages
- API requests

---

## ❓ Troubleshooting

**Problem:** Can't login
- **Solution:** Make sure you're using `admin` / `admin123`

**Problem:** Upload rejected
- **Solution:** Check video resolution is exactly 1080×1920

**Problem:** Video not playing on main page
- **Solution:** Upload a video first, or check `/public/videos/homepage.mp4` exists as fallback

**Problem:** Dashboard not accessible
- **Solution:** Login first at `/admin/login`

---

## 📚 Full Documentation
See `VIDEO_MANAGEMENT_SETUP.md` for complete documentation including:
- Detailed feature list
- API endpoints
- Security features
- Production deployment
- Customization options
