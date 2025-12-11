# Quick Reference Guide

## 🚀 Quick Start

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🔑 Login

**URL:** http://localhost:3000/admin/login (or just /admin)

**Credentials:**
- Username: `marketing`
- Password: `@247-247`

**New Feature:** Click the eye icon to show/hide password

---

## 📤 Upload Media

### Videos:
1. Go to Admin Dashboard
2. Click "Choose Video or Image File"
3. Select video (MP4, WebM, OGG)
4. Must be 1080×1920 resolution
5. Click "Upload Video"

### Images:
1. Go to Admin Dashboard
2. Click "Choose Video or Image File"
3. Select image (JPEG, PNG, WebP)
4. Must be 1080×1920 resolution
5. **Set display duration** (1-300 seconds)
6. Click "Upload Image"

**Limit:** Maximum 4 items total (videos + images combined)

---

## 🎬 How It Works

### Homepage Playback:
1. Items play sequentially (1 → 2 → 3 → 4 → 1...)
2. Videos play their full duration
3. Images display for admin-set duration
4. Endless loop
5. **Auto-updates every 10 seconds** when you add/remove media

### Auto-Refresh:
- Homepage checks for updates every 10 seconds
- No manual refresh needed
- Upload/delete in admin → homepage updates automatically

---

## 🗑️ Delete Media

1. Go to Admin Dashboard
2. Find the item in gallery
3. Click trash icon (🗑️)
4. Confirm deletion
5. Homepage will auto-update within 10 seconds

---

## 📍 Location

Weather now shows **Walsall** (changed from Bliston)

---

## 🔧 API Routes

### New Media Routes (Active):
- `POST /api/media/upload` - Upload video/image
- `GET /api/media/info` - Get all media (admin)
- `GET /api/media/list` - Get media list (public)
- `DELETE /api/media/delete` - Delete media

### Old Video Routes (Legacy):
- Still available but not used
- `/api/video/*`

---

## 📁 File Storage

```
/public/uploads/
├── video-{timestamp}.mp4
├── image-{timestamp}.jpg
└── image-{timestamp}.json (duration metadata)
```

---

## ⚙️ Configuration

### Change Password:
Edit `src/lib/auth.ts`

### Change Max Items:
Edit `MAX_ITEMS` in:
- `src/app/admin/dashboard/page.tsx`
- `src/app/api/media/upload/route.ts`

### Change Auto-Refresh Interval:
Edit interval in `src/components/VideoSection.tsx` (currently 10000ms = 10 seconds)

---

## 🎨 Features Summary

1. ✅ Weather: Walsall location
2. ✅ Password: Show/hide toggle
3. ✅ Redirect: /admin → /admin/login
4. ✅ Media: Videos + Images (4 max)
5. ✅ Auto-refresh: Updates every 10s

---

## 📝 Quick Tips

- **Resolution must be exactly 1080×1920** (vertical/portrait)
- **Image duration:** Set how long image displays (1-300 seconds)
- **Auto-refresh:** Wait up to 10 seconds for homepage to update
- **Mixed media:** Can have any combination of videos and images (total 4)
- **Sequential play:** Items play in upload order (oldest first)

---

## 🐛 Troubleshooting

**Upload fails:**
- Check resolution is exactly 1080×1920
- Verify file format (MP4/WebM/OGG for videos, JPEG/PNG/WebP for images)
- Ensure you haven't reached 4-item limit

**Homepage not updating:**
- Wait up to 10 seconds for auto-refresh
- Check browser console for errors
- Verify media uploaded successfully in admin

**Password not showing:**
- Click the eye icon on the right side of password field

---

## 📞 Need Help?

Check these files for detailed information:
- `FEATURE_UPDATE_GUIDE.md` - Complete feature documentation
- `IMPLEMENTATION_COMPLETE.md` - Implementation details
- `HOW_TO_CHANGE_PASSWORD.md` - Password change guide

---

**Last Updated:** December 10, 2024
