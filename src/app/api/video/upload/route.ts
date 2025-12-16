import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const MAX_VIDEOS = 4;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, and OGG are allowed.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Check current video count
    const files = await readdir(uploadsDir);
    const videoFiles = files.filter(f => f.startsWith('video-') && f.endsWith('.mp4'));
    
    if (videoFiles.length >= MAX_VIDEOS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_VIDEOS} videos allowed. Please delete a video first.` },
        { status: 400 }
      );
    }

    // Generate filename with timestamp
    const timestamp = Date.now();
    const filename = `video-${timestamp}.mp4`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'Video uploaded successfully',
      filename: filename,
      totalVideos: videoFiles.length + 1,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
