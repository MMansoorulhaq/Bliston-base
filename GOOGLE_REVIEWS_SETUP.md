# Google Reviews API Setup Guide

## 🎯 Get Real Dynamic Reviews from Google

Follow these steps to enable **completely dynamic** Google reviews for 247 Cars Willenhall.

---

## Step 1: Get Google Places API Key (FREE)

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create a New Project (or use existing)
- Click "Select a project" → "New Project"
- Name: `247-cars-website` (or any name)
- Click "Create"

### 1.3 Enable Places API
- Go to "APIs & Services" → "Library"
- Search for "Places API"
- Click "Places API" → Click "Enable"

### 1.4 Create API Key
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "API Key"
- Copy your API key (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### 1.5 Restrict API Key (Recommended for Security)
- Click on your API key to edit
- Under "API restrictions":
  - Select "Restrict key"
  - Choose "Places API"
- Under "Website restrictions":
  - Add your domain (e.g., `yourdomain.com/*`)
- Click "Save"

---

## Step 2: Configure Your Project

### 2.1 Create Environment File
In your project root, create a file named `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_PLACE_ID=ChIJ6SfaOqOZcEgRaqe6o6M2C48
```

**Replace** `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` with your actual API key.

### 2.2 Place ID for 247 Cars Willenhall
The Place ID is already configured:
```
ChIJ6SfaOqOZcEgRaqe6o6M2C48
```

This is the Google Place ID for "247 Cars Willenhall" from the link you provided.

---

## Step 3: Restart Development Server

After creating `.env.local`, restart your server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## Step 4: Verify It's Working

### Check Browser Console
Open http://localhost:3000 and check the browser console (F12). You should see:

```
🔄 Fetching real reviews from Google Places API...
✅ Successfully fetched reviews from Google!
📊 Total reviews: XX
⭐ Average rating: X.X
✨ Showing X reviews with 4-5 stars
```

### What You'll See
- Real customer names from Google reviews
- Actual star ratings (4-5 stars only)
- Real review text from customers
- Profile photos (if available)
- Auto-rotating every 5 seconds

---

## 🎉 Features

✅ **Completely Dynamic** - No mock data, all real reviews
✅ **Auto-Updates** - Refreshes every 30 minutes
✅ **Filtered** - Shows only 4-5 star reviews
✅ **Free Tier** - Google Places API free tier is generous
✅ **Cached** - Smart caching to reduce API calls

---

## 📊 Google Places API Free Tier

**Free Quota:**
- First $200/month in credits (FREE)
- Place Details: $17 per 1,000 requests
- With $200 credit = ~11,700 requests/month FREE
- With 30-min caching = ~1,440 requests/month
- **You'll stay well within the free tier!**

---

## 🔧 Troubleshooting

### No Reviews Showing?
1. Check `.env.local` file exists in project root
2. Verify API key is correct
3. Check browser console for error messages
4. Ensure Places API is enabled in Google Cloud Console

### API Key Not Working?
1. Make sure Places API is enabled
2. Check API key restrictions
3. Wait a few minutes after creating the key
4. Try regenerating the API key

### Wrong Reviews Showing?
1. Verify the Place ID is correct
2. Search for "247 Cars Willenhall" on Google Maps
3. Get the Place ID from the URL or use Google's Place ID Finder

---

## 🎯 Result

Once configured, your website will show **real, dynamic Google reviews** from actual customers of 247 Cars Willenhall, automatically filtered to show only the best reviews (4-5 stars) and rotating every 5 seconds!

No more mock data - completely dynamic! 🚀
