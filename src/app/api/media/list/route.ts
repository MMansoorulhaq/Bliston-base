import { NextResponse } from 'next/server';
import { stat, readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ORDER_FILE = 'media-order.json';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ media: [], timestamp: Date.now() });
    }

    // Get all media files
    const files = await readdir(uploadsDir);
    const mediaFiles = files.filter(f => 
      (f.startsWith('video-') || f.startsWith('image-')) && 
      !f.endsWith('.json') &&
      f !== ORDER_FILE
    );

    // Get stats for each media file
    const media = await Promise.all(
      mediaFiles.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const stats = await stat(filePath);
        
        const type = filename.startsWith('video-') ? 'video' : 'image';
        let duration = undefined;

        // Get metadata
        const metadataPath = path.join(uploadsDir, filename.replace(/\.(mp4|jpg|png|webp)$/, '.json'));
        if (existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(await readFile(metadataPath, 'utf-8'));
            duration = metadata.duration;
          } catch (e) {
            console.error('Failed to read metadata:', e);
          }
        }
        
        return {
          filename,
          type,
          url: `/uploads/${filename}`,
          uploadedAt: stats.birthtime,
          duration,
        };
      })
    );

    // Load custom order if exists
    const orderFilePath = path.join(uploadsDir, ORDER_FILE);
    let customOrder: string[] = [];
    
    if (existsSync(orderFilePath)) {
      try {
        const orderData = JSON.parse(await readFile(orderFilePath, 'utf-8'));
        customOrder = orderData.order || [];
      } catch (e) {
        console.error('Failed to read order file:', e);
      }
    }

    // Apply custom order if available
    if (customOrder.length > 0) {
      const orderedMedia: typeof media = [];
      const unorderedMedia: typeof media = [];

      // Separate ordered and unordered items
      media.forEach(item => {
        const orderIndex = customOrder.indexOf(item.filename);
        if (orderIndex !== -1) {
          orderedMedia[orderIndex] = item;
        } else {
          unorderedMedia.push(item);
        }
      });

      // Filter out undefined slots and append unordered items
      const finalMedia = orderedMedia.filter(Boolean).concat(unorderedMedia);
      return NextResponse.json({ 
        media: finalMedia,
        timestamp: Date.now()
      });
    }

    // Default sort by upload date (oldest first for sequential playback)
    media.sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime());

    return NextResponse.json({ 
      media,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { media: [], timestamp: Date.now() },
      { status: 200 }
    );
  }
}
