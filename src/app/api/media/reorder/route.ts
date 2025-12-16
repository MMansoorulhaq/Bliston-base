import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ORDER_FILE = 'media-order.json';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order } = await request.json();

    if (!order || !Array.isArray(order)) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const orderFilePath = path.join(uploadsDir, ORDER_FILE);

    // Save the order
    await writeFile(orderFilePath, JSON.stringify({ order, updatedAt: Date.now() }));

    return NextResponse.json({
      success: true,
      message: 'Media order updated successfully',
    });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json(
      { error: 'Failed to update media order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const orderFilePath = path.join(uploadsDir, ORDER_FILE);

    if (!existsSync(orderFilePath)) {
      return NextResponse.json({ order: [] });
    }

    const data = JSON.parse(await readFile(orderFilePath, 'utf-8'));
    return NextResponse.json({ order: data.order || [] });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ order: [] });
  }
}
