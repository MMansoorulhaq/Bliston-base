# Video Management Portal - Setup & Usage Guide

## Overview
This Next.js application now includes a complete video management portal with authentication, upload functionality, and video validation.

## Features Implemented

### 🔐 1. Authentication
- Simple login page at `/admin/login`
- Hardcoded credentials:
  - **Username:** `admin`
  - **Password:** `admin123`
- Session-based authentication with HTTP-only cookies
- Protected admin routes with middleware

### 🎥 2. Video Upload Portal
- Admin dashboard at `/admin/dashboard`
- Upload new videos with drag-and-drop or file selection
- **Automatic validation:**
  - Resolution must be exactly **1080 × 1920** (vertical)
  - Supported formats: MP4, WebM, OGG
  - Invalid uploads are rejected with error messages
- Uploaded video replaces the current video on the main page

### 🔁 3. Video Playback
- Video plays automatically on the main page
- Loops forever continuously
- Responsive design that adapts to container
- Fallback to default video if no upload exists

### 🗂️ 4. Storage
- Videos stored in `/public/uploads/video.mp4`
- Each new upload overwrites the existing video
- Directory created automatically on first upload

### ✨ 5. Additional Enhancements
- ✅ Preview of currently uploaded video in admin panel
- ✅ File details display (resolution, size, duration)
- ✅ Confirmation modal before replacing video
- ✅ Modern, styled dashboard UI
- ✅ Logout button with session handling
- ✅ File type validation (MP4, WebM, OGG only)
- ✅ Delete video button (removes uploaded video)

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   ├── page.tsx          # Login page
│   │   │   └── login.css         # Login styles
│   │   └── dashboard/
│   │       ├── page.tsx          # Admin dashboard
│   │       └── dashboard.css     # Dashboard styles
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts    # Login API
│   │   │   └── logout/route.ts   # Logout API
│   │   └── video/
│   │       ├── upload/route.ts   # Video upload API
│   │       ├── info/route.ts     # Video info API
│   │       └── delete/route.ts   # Video delete API
│   └── page.tsx                  # Main homepage
├── components/
│   └── VideoSection.tsx          # Updated video player
├── lib/
│   └── auth.ts                   # Authentication utilities
└── middleware.ts                 # Route protection

public/
└── uploads/
    └── video.mp4                 # Uploaded video (created on upload)
```

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Application
- **Main Page:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin/dashboard (requires login)

## Usage Instructions

### Logging In
1. Navigate to http://localhost:3000/admin/login
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"

### Uploading a Video
1. After logging in, you'll see the admin dashboard
2. Click "Choose Video File" button
3. Select a video file (must be 1080×1920 resolution)
4. Preview will appear if validation passes
5. Click "Upload Video" button
6. Confirm the upload in the modal
7. Video will be uploaded and replace the current video

### Viewing Current Video
- The dashboard shows the currently uploaded video
- Displays file details: filename, resolution, size, duration
- Video preview with playback controls

### Deleting a Video
1. Click "Delete Video" button in the dashboard
2. Confirm deletion
3. Video will be removed (main page will show fallback video)

### Logging Out
- Click "Logout" button in the dashboard header
- You'll be redirected to the login page

## Validation Rules

### Video Requirements
- **Resolution:** Exactly 1080 × 1920 pixels (vertical/portrait)
- **Format:** MP4, WebM, or OGG
- **File Type:** Must be a valid video file

### Error Messages
- "Invalid resolution: [width]×[height]. Required: 1080×1920 (vertical)" - Wrong resolution
- "Invalid file type. Please upload MP4, WebM, or OGG video." - Wrong format
- "Unauthorized" - Not logged in

## Security Features

### Authentication
- Session-based authentication with HTTP-only cookies
- Middleware protects all `/admin/*` routes
- Automatic redirect to login if not authenticated
- 24-hour session expiration

### File Upload Security
- Server-side validation of file types
- File size limits enforced by Next.js
- Only authenticated users can upload
- Overwrites existing file (no arbitrary file names)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout and clear session

### Video Management
- `GET /api/video/info` - Get current video information
- `POST /api/video/upload` - Upload new video (requires auth)
- `DELETE /api/video/delete` - Delete current video (requires auth)

## Customization

### Change Admin Credentials
Edit `src/lib/auth.ts`:
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'your_username',
  password: 'your_password'
};
```

### Change Video Resolution Requirements
Edit `src/app/admin/dashboard/page.tsx`:
```typescript
if (video.videoWidth !== 1080 || video.videoHeight !== 1920) {
  // Change these values
}
```

### Change Session Duration
Edit `src/app/api/auth/login/route.ts`:
```typescript
maxAge: 60 * 60 * 24, // 24 hours (in seconds)
```

## Troubleshooting

### Video Not Playing
- Check if video file exists in `/public/uploads/video.mp4`
- Verify video format is supported by browser
- Check browser console for errors

### Upload Fails
- Ensure video resolution is exactly 1080×1920
- Check file format (MP4, WebM, OGG only)
- Verify you're logged in
- Check server logs for errors

### Can't Access Dashboard
- Make sure you're logged in at `/admin/login`
- Check if session cookie is set
- Try clearing cookies and logging in again

## Production Deployment

### Environment Variables
For production, ensure:
- `NODE_ENV=production` is set
- HTTPS is enabled (for secure cookies)

### Build for Production
```bash
npm run build
npm start
```

### Security Recommendations
1. Change default admin credentials
2. Use environment variables for credentials
3. Implement rate limiting on login endpoint
4. Add CSRF protection
5. Use a proper authentication system (NextAuth.js, etc.)
6. Add file size limits
7. Implement user management for multiple admins

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with responsive design

## Notes
- The video on the main page will automatically use the uploaded video
- If no video is uploaded, it falls back to `/videos/homepage.mp4`
- Videos are stored in the public directory for easy serving
- The upload overwrites the existing video (no versioning)
- Session expires after 24 hours of inactivity
