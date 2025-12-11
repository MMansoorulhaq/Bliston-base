# User Guide - Video Management Portal

## 👥 For Different Users

This guide is organized by user type. Choose your role:
- [Public Visitors](#public-visitors) - Just viewing the website
- [Admin Users](#admin-users) - Managing videos

---

## 🌐 Public Visitors

### What You See
When you visit the main page at http://localhost:3000, you'll see:
- A full-screen video playing automatically
- The video loops continuously
- Google reviews scrolling at the bottom
- A clean, modern interface

### What You Can Do
- Watch the video
- Read customer reviews
- Navigate the website

### No Login Required
Public visitors don't need to login or do anything special. The video just plays!

---

## 👨‍💼 Admin Users

### Overview
As an admin, you can:
- Login to the admin dashboard
- Upload new videos
- View current video details
- Delete videos
- Logout when done

---

## 📖 Step-by-Step Admin Guide

### Step 1: Accessing the Admin Panel

1. **Open your browser**
2. **Navigate to:** http://localhost:3000/admin/login
3. **You'll see:** A login page with purple gradient background

```
┌─────────────────────────────────────┐
│                                     │
│         🔐 Admin Login              │
│    Video Management Portal          │
│                                     │
│    Username: [____________]         │
│    Password: [____________]         │
│                                     │
│         [    Login    ]             │
│                                     │
│    Default: admin / admin123        │
│                                     │
└─────────────────────────────────────┘
```

---

### Step 2: Logging In

1. **Enter username:** `admin`
2. **Enter password:** `admin123`
3. **Click:** "Login" button
4. **Result:** You'll be redirected to the dashboard

**If login fails:**
- Check you typed the credentials correctly
- Username and password are case-sensitive
- Make sure there are no extra spaces

---

### Step 3: Understanding the Dashboard

After login, you'll see two main sections:

```
┌─────────────────────────────────────────────────────────┐
│  Video Management Dashboard              [Logout]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Current Video                                  │  │
│  │                                                 │  │
│  │  [Video Preview]                                │  │
│  │                                                 │  │
│  │  Filename:    video.mp4                         │  │
│  │  Resolution:  1080×1920                         │  │
│  │  Size:        25.4 MB                           │  │
│  │  Duration:    0:45                              │  │
│  │                                                 │  │
│  │  [Delete Video]                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Upload New Video                               │  │
│  │                                                 │  │
│  │  Requirements:                                  │  │
│  │  • Resolution: 1080 × 1920 (vertical)           │  │
│  │  • Format: MP4, WebM, or OGG                    │  │
│  │  • New upload will replace current video        │  │
│  │                                                 │  │
│  │  [Choose Video File]                            │  │
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Step 4: Uploading a New Video

#### 4.1 Prepare Your Video

**Before uploading, make sure your video:**
- ✅ Has resolution of **1080 × 1920** pixels (vertical/portrait)
- ✅ Is in **MP4**, **WebM**, or **OGG** format
- ✅ Is the video you want to display on the main page

**How to check video resolution:**
- **Windows:** Right-click video → Properties → Details
- **Mac:** Right-click video → Get Info → More Info
- **VLC:** Media → Media Information → Codec Details

#### 4.2 Select Your Video

1. **Click:** "Choose Video File" button
2. **Browse:** Navigate to your video file
3. **Select:** Click the video file
4. **Click:** "Open"

#### 4.3 Validation

The system will automatically check your video:

**✅ If Valid (1080×1920):**
```
┌─────────────────────────────────────┐
│  Selected: my-video.mp4             │
│  Size: 25.4 MB                      │
│                                     │
│  [Video Preview]                    │
│                                     │
│  [Upload Video]                     │
└─────────────────────────────────────┘
```

**❌ If Invalid (wrong resolution):**
```
┌─────────────────────────────────────┐
│  ⚠️ Invalid resolution: 1920×1080   │
│  Required: 1080×1920 (vertical)     │
│                                     │
│  Please select a different video    │
└─────────────────────────────────────┘
```

#### 4.4 Preview Your Video

- A preview will appear below the file selection
- You can play/pause/seek through the video
- Make sure it's the correct video before uploading

#### 4.5 Upload the Video

1. **Click:** "Upload Video" button
2. **Confirmation dialog appears:**

```
┌─────────────────────────────────────┐
│  Confirm Upload                     │
│                                     │
│  Are you sure you want to replace   │
│  the current video?                 │
│                                     │
│  This action cannot be undone.      │
│                                     │
│  [Cancel]  [Confirm Upload]         │
└─────────────────────────────────────┘
```

3. **Click:** "Confirm Upload"
4. **Wait:** Upload progress (button shows "Uploading...")
5. **Success:** Green message appears

```
┌─────────────────────────────────────┐
│  ✅ Video uploaded successfully!    │
└─────────────────────────────────────┘
```

#### 4.6 Verify Upload

1. **Check:** "Current Video" section updates with new video
2. **Visit:** Main page at http://localhost:3000
3. **Confirm:** Your new video is playing

---

### Step 5: Viewing Video Details

In the "Current Video" section, you can see:

- **Filename:** Name of the video file
- **Resolution:** Video dimensions (should be 1080×1920)
- **Size:** File size in megabytes
- **Duration:** Video length in minutes:seconds
- **Preview:** Playable video preview

**Example:**
```
Filename:    video.mp4
Resolution:  1080×1920
Size:        25.4 MB
Duration:    0:45
```

---

### Step 6: Deleting a Video

**When to delete:**
- You want to remove the current video
- You want to start fresh
- You uploaded the wrong video

**How to delete:**

1. **Scroll to:** "Current Video" section
2. **Click:** "Delete Video" button
3. **Confirm:** Browser confirmation dialog

```
┌─────────────────────────────────────┐
│  Are you sure you want to delete    │
│  the current video?                 │
│                                     │
│  [Cancel]  [OK]                     │
└─────────────────────────────────────┘
```

4. **Click:** "OK"
5. **Result:** Video is deleted

**After deletion:**
- "Current Video" section shows "No video uploaded yet"
- Main page will show the default fallback video
- You can upload a new video anytime

---

### Step 7: Logging Out

**When you're done:**

1. **Click:** "Logout" button (top right of dashboard)
2. **Result:** You're redirected to the login page
3. **Security:** Your session is cleared

**Important:**
- Always logout when using a shared computer
- Your session expires after 24 hours automatically
- You'll need to login again to access the dashboard

---

## 🎯 Common Tasks

### Task: Replace the Current Video

1. Login to dashboard
2. Click "Choose Video File"
3. Select new video (1080×1920)
4. Click "Upload Video"
5. Confirm upload
6. Done! New video is live

**Time:** ~2 minutes

---

### Task: Check What Video is Currently Live

1. Login to dashboard
2. Look at "Current Video" section
3. See filename, size, and preview
4. Or visit main page to see it playing

**Time:** ~30 seconds

---

### Task: Remove a Video Temporarily

1. Login to dashboard
2. Click "Delete Video"
3. Confirm deletion
4. Main page will show default video
5. Upload new video when ready

**Time:** ~1 minute

---

## ⚠️ Important Notes

### Video Requirements

**Must Have:**
- ✅ Resolution: 1080 × 1920 (vertical)
- ✅ Format: MP4, WebM, or OGG
- ✅ Valid video file

**Will Be Rejected:**
- ❌ Wrong resolution (e.g., 1920×1080)
- ❌ Wrong format (e.g., AVI, MOV)
- ❌ Corrupted files
- ❌ Non-video files

### Upload Behavior

- **Replaces:** Each upload replaces the previous video
- **No Undo:** Once uploaded, you can't undo (but you can upload again)
- **Immediate:** Changes appear on main page immediately
- **Overwrites:** Old video is deleted when new one is uploaded

### Security

- **Login Required:** Must login to upload/delete videos
- **Session Timeout:** 24 hours of inactivity
- **Protected Routes:** Can't access dashboard without login
- **Secure Cookies:** Session stored securely

---

## 🆘 Troubleshooting

### Problem: Can't Login

**Symptoms:**
- "Invalid credentials" error
- Can't access dashboard

**Solutions:**
1. Check username is `admin` (lowercase)
2. Check password is `admin123`
3. Make sure no extra spaces
4. Try clearing browser cookies
5. Try different browser

---

### Problem: Upload Rejected

**Symptoms:**
- Error message about resolution
- Upload button disabled

**Solutions:**
1. Check video resolution (must be 1080×1920)
2. Use video editing software to resize if needed
3. Make sure it's vertical (portrait), not horizontal
4. Try a different video file
5. Check file format (MP4, WebM, OGG only)

**How to resize video:**
- Use FFmpeg, HandBrake, or online tools
- Set output to 1080×1920
- Export as MP4

---

### Problem: Video Not Playing on Main Page

**Symptoms:**
- Black screen on main page
- Video doesn't start

**Solutions:**
1. Check if video was uploaded successfully
2. Refresh the main page (Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for errors
4. Try different browser
5. Make sure video file is valid

---

### Problem: Upload Takes Too Long

**Symptoms:**
- Upload stuck at "Uploading..."
- No progress

**Solutions:**
1. Check internet connection
2. Try smaller video file
3. Compress video before uploading
4. Check server is running
5. Refresh page and try again

---

### Problem: Can't Delete Video

**Symptoms:**
- Delete button doesn't work
- Error message

**Solutions:**
1. Make sure you're logged in
2. Refresh the page
3. Check if video exists
4. Try logging out and back in

---

## 💡 Tips & Best Practices

### For Best Results

1. **Video Quality:**
   - Use high-quality source videos
   - Ensure good lighting and clarity
   - Test video before uploading

2. **File Size:**
   - Keep videos under 50MB for faster loading
   - Compress if needed (maintain quality)
   - Balance quality vs. file size

3. **Testing:**
   - Always preview before uploading
   - Check on main page after upload
   - Test on different devices/browsers

4. **Security:**
   - Change default password (see docs)
   - Logout when done
   - Don't share credentials

5. **Workflow:**
   - Prepare video first (correct resolution)
   - Test locally before uploading
   - Keep backup of original videos
   - Document what video is live

---

## 📱 Mobile Usage

### Accessing on Mobile

1. **Login:** Works on mobile browsers
2. **Upload:** Can upload from mobile device
3. **Preview:** Video preview works on mobile
4. **Responsive:** Dashboard adapts to screen size

**Note:** For best experience, use desktop for uploads.

---

## 🎓 Video Specifications Guide

### Correct Resolution (1080×1920)

```
┌─────────┐
│         │
│         │  ← 1080 pixels wide
│         │
│         │
│         │
│         │
│         │  ← 1920 pixels tall
│         │
│         │
│         │
│         │
│         │
└─────────┘

Aspect Ratio: 9:16 (vertical/portrait)
Orientation: Portrait
Common Use: Mobile displays, digital signage
```

### Wrong Resolution Examples

**❌ 1920×1080 (Horizontal)**
```
┌─────────────────────────┐
│                         │  ← Too wide, too short
│                         │
└─────────────────────────┘
```

**❌ 720×1280 (Too Small)**
```
┌──────┐
│      │  ← Too small
│      │
│      │
└──────┘
```

---

## 📊 Quick Reference

### Login Credentials
```
URL:      http://localhost:3000/admin/login
Username: admin
Password: admin123
```

### Video Requirements
```
Resolution: 1080 × 1920 pixels
Format:     MP4, WebM, OGG
Orientation: Vertical (Portrait)
Aspect:     9:16
```

### Important URLs
```
Main Page:  http://localhost:3000
Login:      http://localhost:3000/admin/login
Dashboard:  http://localhost:3000/admin/dashboard
```

### File Locations
```
Uploaded:   /public/uploads/video.mp4
Fallback:   /public/videos/homepage.mp4
```

---

## ✅ Checklist for Uploading

Before uploading, verify:

- [ ] Video resolution is 1080×1920
- [ ] Video format is MP4, WebM, or OGG
- [ ] Video plays correctly locally
- [ ] Video is the correct content
- [ ] You're logged into dashboard
- [ ] You've previewed the video
- [ ] You're ready to replace current video

After uploading, verify:

- [ ] Success message appeared
- [ ] Dashboard shows new video
- [ ] Main page plays new video
- [ ] Video loops correctly
- [ ] No errors in console

---

## 🎉 You're Ready!

You now know how to:
- ✅ Login to the admin panel
- ✅ Upload new videos
- ✅ View video details
- ✅ Delete videos
- ✅ Logout securely
- ✅ Troubleshoot issues

**Need more help?** Check the other documentation files:
- `QUICK_START.md` - Quick setup
- `VIDEO_MANAGEMENT_SETUP.md` - Technical details
- `TESTING_GUIDE.md` - Testing procedures

**Happy video managing!** 🎥
