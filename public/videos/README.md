# Video Files Directory

This directory contains the video files that will be displayed in the background of the Bliston Base website.

## Video Playlist

The application supports **4-5 videos** that will play in a continuous loop. Videos are configured in `src/components/VideoSection.tsx`.

### Adding Your Videos

1. **Add video files** to this directory (`public/videos/`)
2. **Name your videos**:
   - `video1.mp4`
   - `video2.mp4`
   - `video3.mp4`
   - `video4.mp4`
   - `video5.mp4` (optional)

### Video Requirements

- **Format**: MP4 (H.264 codec recommended)
- **Orientation**: **Vertical/Portrait** (9:16 or similar aspect ratio)
- **Resolution**: 1080x1920 or higher recommended for vertical displays
- **File Size**: Keep under 50MB per video for optimal loading
- **Duration**: 30-60 seconds recommended per video

### How It Works

- Videos play automatically in sequence
- When one video ends, the next video in the playlist starts
- After the last video, it loops back to the first video
- Users can click the play button to start the video player
- Reviews rotate every 5 seconds while videos play

### Optional: Poster Image

You can add a `video-poster.jpg` file to `public/` to display before videos load.

### Customizing the Playlist

To change which videos are used, edit the `VIDEO_PLAYLIST` array in:
`src/components/VideoSection.tsx`

```typescript
const VIDEO_PLAYLIST = [
    '/videos/video1.mp4',
    '/videos/video2.mp4',
    '/videos/video3.mp4',
    '/videos/video4.mp4',
    '/videos/video5.mp4',
];
```

Remove or add entries as needed for your specific number of videos.
