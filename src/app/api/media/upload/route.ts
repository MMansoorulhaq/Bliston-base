import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { logActivity } from '@/lib/activityLog';

const MAX_ITEMS = 4;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video' or 'image'
    const duration = formData.get('duration') as string; // for images only

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['video', 'image'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "video" or "image"' }, { status: 400 });
    }

    // Validate file type
    if (type === 'video') {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid video type. Only MP4, WebM, and OGG are allowed.' },
          { status: 400 }
        );
      }
    } else if (type === 'image') {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Only JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        );
      }

      if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
        return NextResponse.json(
          { error: 'Valid duration (in seconds) is required for images' },
          { status: 400 }
        );
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Check current media count
    const files = await readdir(uploadsDir);
    const mediaFiles = files.filter(f => 
      (f.startsWith('video-') || f.startsWith('image-')) && 
      !f.endsWith('.json')
    );
    
    if (mediaFiles.length >= MAX_ITEMS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_ITEMS} items allowed. Please delete an item first.` },
        { status: 400 }
      );
    }

    // Check for duplicate filename (sanitize the original filename)
    const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const duplicateCheck = mediaFiles.some(existingFile => {
      // Extract original name from timestamp-based filename if metadata exists
      const metadataPath = path.join(uploadsDir, existingFile.replace(/\.(mp4|jpg|png|webp)$/, '.json'));
      if (existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(require('fs').readFileSync(metadataPath, 'utf-8'));
          if (metadata.originalName && metadata.originalName.toLowerCase() === file.name.toLowerCase()) {
            return true;
          }
        } catch (e) {
          // Ignore metadata read errors
        }
      }
      return false;
    });

    if (duplicateCheck) {
      return NextResponse.json(
        { error: `A file with the name "${file.name}" already exists. Please rename your file or delete the existing one first.` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate image resolution if it's an image
    if (type === 'image') {
      try {
        const metadata = await sharp(buffer).metadata();
        if (metadata.width !== 1080 || metadata.height !== 1920) {
          return NextResponse.json(
            { error: `Invalid resolution. Image must be exactly 1080×1920 pixels. Got ${metadata.width}×${metadata.height}` },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to validate image resolution' },
          { status: 400 }
        );
      }
    }

    // Generate filename with timestamp
    const timestamp = Date.now();
    const extension = type === 'video' ? 'mp4' : 'jpg';
    const filename = `${type}-${timestamp}.${extension}`;

    // Save file
    const filePath = path.join(uploadsDir, filename);
    
    if (type === 'image') {
      // Convert and optimize image
      await sharp(buffer)
        .jpeg({ quality: 95 })
        .toFile(filePath);
      
      // Save metadata (duration and original name)
      const metadataPath = path.join(uploadsDir, `${type}-${timestamp}.json`);
      await writeFile(metadataPath, JSON.stringify({ 
        duration: Number(duration),
        originalName: file.name
      }));
    } else {
      await writeFile(filePath, buffer);
      
      // Save metadata for video (original name for duplicate checking)
      const metadataPath = path.join(uploadsDir, `${type}-${timestamp}.json`);
      await writeFile(metadataPath, JSON.stringify({ 
        originalName: file.name
      }));
    }

    // Log the upload
    await logActivity(
      sessionData.userId,
      sessionData.username,
      'UPLOAD_MEDIA',
      `Uploaded ${type}: ${filename}`
    );

    return NextResponse.json({
      success: true,
      message: `${type === 'video' ? 'Video' : 'Image'} uploaded successfully`,
      filename: filename,
      type: type,
      totalItems: mediaFiles.length + 1,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
