import { NextRequest, NextResponse } from 'next/server';
import { stat, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ videos: [] });
    }

    // Get all video files
    const files = await readdir(uploadsDir);
    const videoFiles = files.filter(f => f.startsWith('video-') && f.endsWith('.mp4'));

    // Get stats for each video
    const videos = await Promise.all(
      videoFiles.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const stats = await stat(filePath);
        
        return {
          filename,
          size: stats.size,
          resolution: '1080×1920',
          url: `/uploads/${filename}?t=${Date.now()}`,
          uploadedAt: stats.birthtime,
        };
      })
    );

    // Sort by upload date (newest first)
    videos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Info error:', error);
    return NextResponse.json(
      { error: 'Failed to get video info' },
      { status: 500 }
    );
  }
}
