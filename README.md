# 247 Cars - Bliston UK

A Next.js application featuring a video-based homepage with an integrated **Video Management Portal** for easy content updates.

## 🎥 Features

### Public Features
- **Auto-playing video background** with continuous loop
- **Google Reviews integration** with animated testimonials
- **Responsive design** optimized for 1080×1920 (vertical) displays
- **Modern UI** with smooth animations

### Admin Features (NEW!)
- 🔐 **Secure login system** with session management
- 📤 **Video upload portal** with drag-and-drop support
- ✅ **Automatic validation** (1080×1920 resolution required)
- 👁️ **Video preview** before and after upload
- 📊 **File details** display (resolution, size, duration)
- 🗑️ **Delete video** functionality
- 🎨 **Modern dashboard** with professional UI

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access the Application
- **Main Page:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin/dashboard

### 4. Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 steps
- **[VIDEO_MANAGEMENT_SETUP.md](VIDEO_MANAGEMENT_SETUP.md)** - Complete documentation
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing checklist
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🎯 Video Upload Requirements

- **Resolution:** 1080 × 1920 pixels (vertical/portrait)
- **Format:** MP4, WebM, or OGG
- **Behavior:** Auto-play, loop forever on main page

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/              # Admin portal
│   │   ├── login/          # Login page
│   │   └── dashboard/      # Video management dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   └── video/          # Video management endpoints
│   └── page.tsx            # Main homepage
├── components/             # React components
├── lib/                    # Utilities and APIs
└── middleware.ts           # Route protection

public/
├── uploads/                # Uploaded videos stored here
└── videos/                 # Default videos
```

## 🔒 Security Features

- HTTP-only session cookies
- Middleware-protected admin routes
- Server-side file validation
- Client-side resolution validation
- 24-hour session expiration

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** CSS + Bootstrap
- **Authentication:** Session-based with cookies
- **File Upload:** Native FormData API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
