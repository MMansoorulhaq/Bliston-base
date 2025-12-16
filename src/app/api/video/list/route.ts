import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ videos: [] });
    }

    const files = await readdir(uploadsDir);
    const videoFiles = files
      .filter(f => f.startsWith('video-') && f.endsWith('.mp4'))
      .sort(); // Sort alphabetically (which will be chronological due to timestamp)

    const videos = videoFiles.map(filename => `/uploads/${filename}`);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ videos: [] });
  }
}
