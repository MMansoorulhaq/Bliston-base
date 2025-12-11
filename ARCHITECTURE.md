# System Architecture - Video Management Portal

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Main Page   │  │ Login Page   │  │  Dashboard   │    │
│  │  (Public)    │  │ (/admin/     │  │ (/admin/     │    │
│  │              │  │  login)      │  │  dashboard)  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                  │             │
│         │                 │                  │             │
└─────────┼─────────────────┼──────────────────┼─────────────┘
          │                 │                  │
          │                 │                  │
┌─────────┼─────────────────┼──────────────────┼─────────────┐
│         │                 │                  │             │
│         │        ┌────────▼────────┐         │             │
│         │        │   Middleware    │         │             │
│         │        │ (Route Guard)   │         │             │
│         │        └────────┬────────┘         │             │
│         │                 │                  │             │
│         │                 │                  │             │
│  ┌──────▼─────┐  ┌────────▼────────┐  ┌─────▼──────┐     │
│  │  Video     │  │  Auth API       │  │ Video API  │     │
│  │  Serving   │  │  /api/auth/     │  │ /api/video/│     │
│  │            │  │  - login        │  │ - upload   │     │
│  │            │  │  - logout       │  │ - info     │     │
│  │            │  │                 │  │ - delete   │     │
│  └──────┬─────┘  └────────┬────────┘  └─────┬──────┘     │
│         │                 │                  │             │
│         │                 │                  │             │
│         │        ┌────────▼──────────────────▼────┐       │
│         │        │     Authentication Layer       │       │
│         │        │   (Session Management)         │       │
│         │        └────────────────────────────────┘       │
│         │                                                  │
├─────────┼──────────────────────────────────────────────────┤
│                        SERVER SIDE                         │
└─────────┼──────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────┐
│                     FILE SYSTEM                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  /public/uploads/video.mp4  ◄── Uploaded Video           │
│  /public/videos/homepage.mp4 ◄── Default Fallback        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### 1. Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Navigate to /admin/login
     ▼
┌─────────────────┐
│  Login Page     │
└────┬────────────┘
     │
     │ 2. Submit credentials
     ▼
┌─────────────────┐
│ POST /api/auth/ │
│     login       │
└────┬────────────┘
     │
     │ 3. Validate credentials
     ▼
┌─────────────────┐
│  auth.ts        │
│  validateCreds()│
└────┬────────────┘
     │
     ├─── Valid ───┐
     │             │
     │             │ 4. Generate session token
     │             ▼
     │        ┌─────────────────┐
     │        │ Set HTTP-only   │
     │        │ Cookie          │
     │        └────┬────────────┘
     │             │
     │             │ 5. Return success
     │             ▼
     │        ┌─────────────────┐
     │        │ Redirect to     │
     │        │ /admin/dashboard│
     │        └─────────────────┘
     │
     └─── Invalid ──┐
                    │
                    │ 6. Return error
                    ▼
               ┌─────────────────┐
               │ Show error msg  │
               │ Stay on login   │
               └─────────────────┘
```

### 2. Video Upload Flow

```
┌─────────┐
│  Admin  │
└────┬────┘
     │
     │ 1. Select video file
     ▼
┌─────────────────┐
│  Dashboard      │
│  File Input     │
└────┬────────────┘
     │
     │ 2. Client-side validation
     ▼
┌─────────────────┐
│ Check Resolution│
│ (1080×1920)     │
└────┬────────────┘
     │
     ├─── Valid ───┐
     │             │
     │             │ 3. Show preview
     │             ▼
     │        ┌─────────────────┐
     │        │ User confirms   │
     │        │ upload          │
     │        └────┬────────────┘
     │             │
     │             │ 4. POST /api/video/upload
     │             ▼
     │        ┌─────────────────┐
     │        │ Middleware      │
     │        │ Check Auth      │
     │        └────┬────────────┘
     │             │
     │             │ 5. Server validation
     │             ▼
     │        ┌─────────────────┐
     │        │ Validate file   │
     │        │ type & auth     │
     │        └────┬────────────┘
     │             │
     │             │ 6. Save to disk
     │             ▼
     │        ┌─────────────────┐
     │        │ /public/uploads/│
     │        │ video.mp4       │
     │        └────┬────────────┘
     │             │
     │             │ 7. Return success
     │             ▼
     │        ┌─────────────────┐
     │        │ Update UI       │
     │        │ Show success    │
     │        └─────────────────┘
     │
     └─── Invalid ──┐
                    │
                    │ 8. Show error
                    ▼
               ┌─────────────────┐
               │ Display error   │
               │ Reject upload   │
               └─────────────────┘
```

### 3. Video Display Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Visit main page
     ▼
┌─────────────────┐
│  page.tsx       │
└────┬────────────┘
     │
     │ 2. Load VideoSection
     ▼
┌─────────────────┐
│ VideoSection.tsx│
└────┬────────────┘
     │
     │ 3. Check for uploaded video
     ▼
┌─────────────────┐
│ HEAD request to │
│ /uploads/       │
│ video.mp4       │
└────┬────────────┘
     │
     ├─── Exists ───┐
     │              │
     │              │ 4. Use uploaded video
     │              ▼
     │         ┌─────────────────┐
     │         │ Set videoSrc to │
     │         │ /uploads/       │
     │         │ video.mp4       │
     │         └────┬────────────┘
     │              │
     │              │ 5. Render video
     │              ▼
     │         ┌─────────────────┐
     │         │ <video>         │
     │         │ autoPlay loop   │
     │         │ muted           │
     │         └─────────────────┘
     │
     └─── Not Found ──┐
                      │
                      │ 6. Use fallback
                      ▼
                 ┌─────────────────┐
                 │ Set videoSrc to │
                 │ /videos/        │
                 │ homepage.mp4    │
                 └────┬────────────┘
                      │
                      │ 7. Render video
                      ▼
                 ┌─────────────────┐
                 │ <video>         │
                 │ autoPlay loop   │
                 │ muted           │
                 └─────────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Route Protection (Middleware)                    │
│  ┌───────────────────────────────────────────────────┐    │
│  │ • Intercepts all /admin/* requests                │    │
│  │ • Checks for admin_session cookie                 │    │
│  │ • Redirects to login if not authenticated         │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 2: Session Management                               │
│  ┌───────────────────────────────────────────────────┐    │
│  │ • HTTP-only cookies (XSS protection)              │    │
│  │ • SameSite=Strict (CSRF protection)               │    │
│  │ • 24-hour expiration                              │    │
│  │ • Secure flag in production                       │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 3: API Authentication                               │
│  ┌───────────────────────────────────────────────────┐    │
│  │ • All video APIs check session cookie             │    │
│  │ • Return 401 if unauthorized                      │    │
│  │ • No API access without login                     │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 4: Input Validation                                 │
│  ┌───────────────────────────────────────────────────┐    │
│  │ Client-side:                                      │    │
│  │ • Resolution validation (1080×1920)               │    │
│  │ • File type check (MP4, WebM, OGG)                │    │
│  │                                                    │    │
│  │ Server-side:                                      │    │
│  │ • MIME type validation                            │    │
│  │ • File existence checks                           │    │
│  │ • Authentication verification                     │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Layer 5: File System Security                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │ • Fixed filename (no user input)                  │    │
│  │ • Restricted directory (/public/uploads/)         │    │
│  │ • Overwrite instead of accumulate                 │    │
│  │ • No arbitrary file paths                         │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Component Tree                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RootLayout (layout.tsx)                                   │
│  │                                                          │
│  ├─── Home Page (page.tsx)                                 │
│  │    │                                                     │
│  │    ├─── VideoSection                                    │
│  │    │    ├─── <video> player                             │
│  │    │    └─── ReviewCard (testimonials)                  │
│  │    │                                                     │
│  │    └─── Header                                          │
│  │                                                          │
│  └─── Admin Routes                                         │
│       │                                                     │
│       ├─── Login Page (/admin/login)                       │
│       │    ├─── Login form                                 │
│       │    ├─── Error display                              │
│       │    └─── Submit handler                             │
│       │                                                     │
│       └─── Dashboard (/admin/dashboard)                    │
│            ├─── Header (with logout)                       │
│            │                                                │
│            ├─── Current Video Section                      │
│            │    ├─── Video preview                         │
│            │    ├─── File details                          │
│            │    └─── Delete button                         │
│            │                                                │
│            └─── Upload Section                             │
│                 ├─── Requirements display                  │
│                 ├─── File input                            │
│                 ├─── Preview                               │
│                 ├─── Error/Success messages                │
│                 ├─── Upload button                         │
│                 └─── Confirmation modal                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API Endpoints                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Authentication APIs                                        │
│  ┌───────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │  POST /api/auth/login                             │    │
│  │  ├─ Input: { username, password }                 │    │
│  │  ├─ Validation: Check credentials                 │    │
│  │  ├─ Action: Set session cookie                    │    │
│  │  └─ Output: { success: true }                     │    │
│  │                                                    │    │
│  │  POST /api/auth/logout                            │    │
│  │  ├─ Input: Session cookie                         │    │
│  │  ├─ Action: Clear cookie                          │    │
│  │  └─ Output: { success: true }                     │    │
│  │                                                    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Video Management APIs                                      │
│  ┌───────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │  GET /api/video/info                              │    │
│  │  ├─ Auth: Required                                │    │
│  │  ├─ Action: Get video metadata                    │    │
│  │  └─ Output: { exists, filename, size,             │    │
│  │              resolution, duration, url }          │    │
│  │                                                    │    │
│  │  POST /api/video/upload                           │    │
│  │  ├─ Auth: Required                                │    │
│  │  ├─ Input: FormData with video file               │    │
│  │  ├─ Validation: File type, auth                   │    │
│  │  ├─ Action: Save to /public/uploads/video.mp4     │    │
│  │  └─ Output: { success, message, filename }        │    │
│  │                                                    │    │
│  │  DELETE /api/video/delete                         │    │
│  │  ├─ Auth: Required                                │    │
│  │  ├─ Action: Delete video file                     │    │
│  │  └─ Output: { success, message }                  │    │
│  │                                                    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    State Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Client State (React useState)                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │  Login Page:                                      │    │
│  │  • username: string                               │    │
│  │  • password: string                               │    │
│  │  • error: string                                  │    │
│  │  • loading: boolean                               │    │
│  │                                                    │    │
│  │  Dashboard:                                       │    │
│  │  • videoInfo: VideoInfo | null                    │    │
│  │  • uploading: boolean                             │    │
│  │  • error: string                                  │    │
│  │  • success: string                                │    │
│  │  • selectedFile: File | null                      │    │
│  │  • previewUrl: string | null                      │    │
│  │  • showConfirmation: boolean                      │    │
│  │                                                    │    │
│  │  VideoSection:                                    │    │
│  │  • isPlaying: boolean                             │    │
│  │  • videoSrc: string                               │    │
│  │  • reviews: GoogleReview[]                        │    │
│  │  • currentReviewIndex: number                     │    │
│  │                                                    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Server State (Cookies)                                    │
│  ┌───────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │  • admin_session: string (session token)          │    │
│  │    - HttpOnly: true                               │    │
│  │    - SameSite: Strict                             │    │
│  │    - MaxAge: 24 hours                             │    │
│  │    - Secure: true (production)                    │    │
│  │                                                    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  File System State                                         │
│  ┌───────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │  • /public/uploads/video.mp4 (uploaded video)     │    │
│  │  • /public/videos/homepage.mp4 (fallback)         │    │
│  │                                                    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Styling Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Styling Structure                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Global Styles                                             │
│  • globals.css (base styles, video player)                 │
│  • Bootstrap 5.3.2 (grid, utilities)                       │
│                                                             │
│  Component Styles                                          │
│  • login.css (login page specific)                         │
│  • dashboard.css (dashboard specific)                      │
│                                                             │
│  Design System                                             │
│  • Colors: Gradient purple/blue theme                      │
│  • Typography: Inter font family                           │
│  • Spacing: Consistent padding/margins                     │
│  • Shadows: Layered depth                                  │
│  • Animations: Smooth transitions                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Production Deployment                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Build Process                                             │
│  1. npm run build                                          │
│  2. Next.js optimizes and bundles                          │
│  3. Static pages pre-rendered                              │
│  4. API routes compiled                                    │
│                                                             │
│  Hosting Options                                           │
│  • Vercel (recommended)                                    │
│  • Netlify                                                 │
│  • AWS / Azure / GCP                                       │
│  • Self-hosted Node.js server                             │
│                                                             │
│  Environment Variables                                     │
│  • NODE_ENV=production                                     │
│  • Custom credentials (recommended)                        │
│                                                             │
│  Security Considerations                                   │
│  • HTTPS required (secure cookies)                         │
│  • Rate limiting on login                                  │
│  • CSRF protection                                         │
│  • File size limits                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Performance Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Optimizations                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Video Optimization                                        │
│  • Lazy loading for admin preview                          │
│  • Autoplay with muted attribute                           │
│  • Preload metadata only                                   │
│  • Cache busting for updates                               │
│                                                             │
│  Code Splitting                                            │
│  • Admin routes separate bundle                            │
│  • Dynamic imports where possible                          │
│  • Next.js automatic code splitting                        │
│                                                             │
│  Caching Strategy                                          │
│  • Static assets cached                                    │
│  • API responses not cached                                │
│  • Video files served from public                          │
│                                                             │
│  Bundle Size                                               │
│  • Minimal dependencies                                    │
│  • Tree shaking enabled                                    │
│  • Production build optimized                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

This architecture provides a scalable, secure, and maintainable foundation for the video management portal.
