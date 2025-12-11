# Testing Guide - Video Management Portal

## 🧪 Complete Testing Checklist

### Prerequisites
```bash
npm run dev
```
Server should be running at http://localhost:3000

---

## 1. Authentication Tests

### ✅ Test 1.1: Successful Login
**Steps:**
1. Navigate to http://localhost:3000/admin/login
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click "Login"

**Expected Result:**
- Redirected to `/admin/dashboard`
- Dashboard loads successfully
- No error messages

---

### ✅ Test 1.2: Failed Login - Wrong Password
**Steps:**
1. Navigate to http://localhost:3000/admin/login
2. Enter username: `admin`
3. Enter password: `wrongpassword`
4. Click "Login"

**Expected Result:**
- Error message: "Invalid credentials"
- Stays on login page
- No redirect

---

### ✅ Test 1.3: Failed Login - Wrong Username
**Steps:**
1. Navigate to http://localhost:3000/admin/login
2. Enter username: `wronguser`
3. Enter password: `admin123`
4. Click "Login"

**Expected Result:**
- Error message: "Invalid credentials"
- Stays on login page

---

### ✅ Test 1.4: Protected Route Access
**Steps:**
1. Open new incognito/private window
2. Navigate directly to http://localhost:3000/admin/dashboard

**Expected Result:**
- Automatically redirected to `/admin/login`
- Cannot access dashboard without login

---

### ✅ Test 1.5: Logout Functionality
**Steps:**
1. Login successfully
2. Click "Logout" button in dashboard header

**Expected Result:**
- Redirected to `/admin/login`
- Session cleared
- Cannot access dashboard without logging in again

---

## 2. Video Upload Tests

### ✅ Test 2.1: Valid Video Upload
**Steps:**
1. Login to dashboard
2. Click "Choose Video File"
3. Select a video with 1080×1920 resolution (MP4 format)
4. Wait for preview to load
5. Click "Upload Video"
6. Click "Confirm Upload" in modal

**Expected Result:**
- File details shown (name, size)
- Preview appears
- Success message: "Video uploaded successfully!"
- Current video section updates with new video
- File details displayed (resolution, size, duration)

---

### ✅ Test 2.2: Invalid Resolution - Too Small
**Steps:**
1. Login to dashboard
2. Select a video with 720×1280 resolution

**Expected Result:**
- Error message: "Invalid resolution: 720×1280. Required: 1080×1920 (vertical)"
- Upload button disabled
- No preview shown

---

### ✅ Test 2.3: Invalid Resolution - Wrong Aspect Ratio
**Steps:**
1. Login to dashboard
2. Select a video with 1920×1080 resolution (horizontal)

**Expected Result:**
- Error message: "Invalid resolution: 1920×1080. Required: 1080×1920 (vertical)"
- Upload button disabled

---

### ✅ Test 2.4: Invalid File Type
**Steps:**
1. Login to dashboard
2. Try to select a non-video file (e.g., .jpg, .pdf, .txt)

**Expected Result:**
- File picker should not show non-video files
- If somehow selected, error: "Invalid file type. Please upload MP4, WebM, or OGG video."

---

### ✅ Test 2.5: Upload Confirmation Modal
**Steps:**
1. Login to dashboard
2. Select valid video
3. Click "Upload Video"
4. Click "Cancel" in confirmation modal

**Expected Result:**
- Modal closes
- Upload does not proceed
- Can try again

---

### ✅ Test 2.6: Upload Without Authentication
**Steps:**
1. Logout
2. Try to access upload API directly:
   ```bash
   curl -X POST http://localhost:3000/api/video/upload
   ```

**Expected Result:**
- 401 Unauthorized response
- Upload rejected

---

## 3. Video Display Tests

### ✅ Test 3.1: Main Page Video Playback
**Steps:**
1. Upload a video through dashboard
2. Navigate to http://localhost:3000 (main page)

**Expected Result:**
- Uploaded video plays automatically
- Video loops continuously
- Video is muted
- Video fills container responsively

---

### ✅ Test 3.2: Fallback Video
**Steps:**
1. Delete uploaded video (if exists)
2. Navigate to main page

**Expected Result:**
- Default video `/videos/homepage.mp4` plays
- No errors in console

---

### ✅ Test 3.3: Video Preview in Dashboard
**Steps:**
1. Login to dashboard
2. View "Current Video" section

**Expected Result:**
- Video preview with controls
- Can play/pause/seek
- File details displayed correctly

---

## 4. Video Management Tests

### ✅ Test 4.1: View Video Information
**Steps:**
1. Login to dashboard
2. Check "Current Video" section

**Expected Result:**
- Filename displayed
- Resolution shown (1080×1920)
- File size in MB
- Duration in MM:SS format

---

### ✅ Test 4.2: Delete Video
**Steps:**
1. Login to dashboard
2. Click "Delete Video" button
3. Confirm deletion in browser alert

**Expected Result:**
- Success message: "Video deleted successfully"
- "Current Video" section shows "No video uploaded yet"
- Main page falls back to default video

---

### ✅ Test 4.3: Replace Existing Video
**Steps:**
1. Upload first video
2. Upload second video (different file)
3. Confirm replacement

**Expected Result:**
- Second video replaces first
- Only one video exists in `/public/uploads/`
- Dashboard shows new video info
- Main page plays new video

---

## 5. UI/UX Tests

### ✅ Test 5.1: Responsive Design
**Steps:**
1. Open dashboard on different screen sizes
2. Test on mobile, tablet, desktop

**Expected Result:**
- Layout adapts to screen size
- All elements remain accessible
- No horizontal scrolling

---

### ✅ Test 5.2: Loading States
**Steps:**
1. Upload a large video file
2. Observe button states

**Expected Result:**
- Upload button shows "Uploading..." during upload
- Button disabled during upload
- Cannot click multiple times

---

### ✅ Test 5.3: Error Message Display
**Steps:**
1. Trigger various errors (wrong resolution, wrong file type)

**Expected Result:**
- Error messages clearly visible
- Red background for errors
- Green background for success
- Messages disappear when new file selected

---

### ✅ Test 5.4: File Preview
**Steps:**
1. Select valid video file

**Expected Result:**
- Preview appears immediately
- Video controls work
- Can preview before uploading

---

## 6. Security Tests

### ✅ Test 6.1: Session Persistence
**Steps:**
1. Login to dashboard
2. Close browser tab
3. Reopen and navigate to dashboard

**Expected Result:**
- Still logged in (within 24 hours)
- Can access dashboard without re-login

---

### ✅ Test 6.2: Session Expiration
**Steps:**
1. Login to dashboard
2. Wait 24+ hours (or modify session duration for testing)
3. Try to access dashboard

**Expected Result:**
- Redirected to login page
- Must login again

---

### ✅ Test 6.3: Cookie Security
**Steps:**
1. Login to dashboard
2. Open browser DevTools → Application → Cookies
3. Check `admin_session` cookie

**Expected Result:**
- Cookie has `HttpOnly` flag
- Cookie has `SameSite=Strict`
- Cookie has expiration set

---

## 7. Edge Cases

### ✅ Test 7.1: Very Large File
**Steps:**
1. Try to upload a very large video (>100MB)

**Expected Result:**
- Upload may take time but should complete
- Or show appropriate error if size limit exceeded

---

### ✅ Test 7.2: Special Characters in Filename
**Steps:**
1. Upload video with special characters in name

**Expected Result:**
- File saved as `video.mp4` regardless of original name
- No errors

---

### ✅ Test 7.3: Concurrent Uploads
**Steps:**
1. Open two browser tabs
2. Login in both
3. Try uploading different videos simultaneously

**Expected Result:**
- Last upload wins
- No corruption
- Both tabs show same final video

---

### ✅ Test 7.4: Network Interruption
**Steps:**
1. Start uploading large video
2. Disconnect network mid-upload

**Expected Result:**
- Error message displayed
- Can retry upload
- No partial file saved

---

## 8. Browser Compatibility

### ✅ Test 8.1: Chrome/Edge
- All features work
- Video plays correctly
- Upload functions properly

### ✅ Test 8.2: Firefox
- All features work
- Video plays correctly
- Upload functions properly

### ✅ Test 8.3: Safari
- All features work
- Video plays correctly
- Upload functions properly

### ✅ Test 8.4: Mobile Browsers
- Responsive design works
- Touch interactions work
- Video plays on mobile

---

## 9. Performance Tests

### ✅ Test 9.1: Page Load Speed
**Steps:**
1. Open main page
2. Check load time

**Expected Result:**
- Page loads in <3 seconds
- Video starts playing quickly

---

### ✅ Test 9.2: Dashboard Load Speed
**Steps:**
1. Login and access dashboard
2. Check load time

**Expected Result:**
- Dashboard loads in <2 seconds
- Video info fetched quickly

---

## 10. API Tests

### ✅ Test 10.1: Login API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected Result:**
- Status: 200
- Response: `{"success":true}`
- Cookie set in response

---

### ✅ Test 10.2: Logout API
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: admin_session=YOUR_SESSION_TOKEN"
```

**Expected Result:**
- Status: 200
- Response: `{"success":true}`
- Cookie cleared

---

### ✅ Test 10.3: Video Info API
```bash
curl http://localhost:3000/api/video/info \
  -H "Cookie: admin_session=YOUR_SESSION_TOKEN"
```

**Expected Result:**
- Status: 200
- Response includes: exists, filename, size, resolution, url

---

### ✅ Test 10.4: Delete API
```bash
curl -X DELETE http://localhost:3000/api/video/delete \
  -H "Cookie: admin_session=YOUR_SESSION_TOKEN"
```

**Expected Result:**
- Status: 200
- Response: `{"success":true,"message":"Video deleted successfully"}`

---

## Test Results Template

Use this template to track your testing:

```
Date: ___________
Tester: ___________

Authentication Tests:
[ ] 1.1 Successful Login
[ ] 1.2 Failed Login - Wrong Password
[ ] 1.3 Failed Login - Wrong Username
[ ] 1.4 Protected Route Access
[ ] 1.5 Logout Functionality

Video Upload Tests:
[ ] 2.1 Valid Video Upload
[ ] 2.2 Invalid Resolution - Too Small
[ ] 2.3 Invalid Resolution - Wrong Aspect Ratio
[ ] 2.4 Invalid File Type
[ ] 2.5 Upload Confirmation Modal
[ ] 2.6 Upload Without Authentication

Video Display Tests:
[ ] 3.1 Main Page Video Playback
[ ] 3.2 Fallback Video
[ ] 3.3 Video Preview in Dashboard

Video Management Tests:
[ ] 4.1 View Video Information
[ ] 4.2 Delete Video
[ ] 4.3 Replace Existing Video

UI/UX Tests:
[ ] 5.1 Responsive Design
[ ] 5.2 Loading States
[ ] 5.3 Error Message Display
[ ] 5.4 File Preview

Security Tests:
[ ] 6.1 Session Persistence
[ ] 6.2 Session Expiration
[ ] 6.3 Cookie Security

Edge Cases:
[ ] 7.1 Very Large File
[ ] 7.2 Special Characters in Filename
[ ] 7.3 Concurrent Uploads
[ ] 7.4 Network Interruption

Browser Compatibility:
[ ] 8.1 Chrome/Edge
[ ] 8.2 Firefox
[ ] 8.3 Safari
[ ] 8.4 Mobile Browsers

Performance Tests:
[ ] 9.1 Page Load Speed
[ ] 9.2 Dashboard Load Speed

API Tests:
[ ] 10.1 Login API
[ ] 10.2 Logout API
[ ] 10.3 Video Info API
[ ] 10.4 Delete API

Notes:
_________________________________
_________________________________
_________________________________
```

---

## Quick Smoke Test (5 minutes)

For a quick verification, run these essential tests:

1. ✅ Login with correct credentials
2. ✅ Upload a valid 1080×1920 video
3. ✅ Check video plays on main page
4. ✅ Delete video from dashboard
5. ✅ Logout successfully

If all pass, the system is working correctly!
