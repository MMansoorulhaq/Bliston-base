import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, updateUser, USERS } from '@/lib/users';
import { logActivity } from '@/lib/activityLog';

// Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const users = getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 });
  }
}

// Update user (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const { userId, username, password } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const updates: any = {};
    if (username) updates.username = username;
    if (password) updates.password = password;

    const success = updateUser(userId, updates);

    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log the change
    await logActivity(
      sessionData.userId,
      sessionData.username,
      'UPDATE_USER',
      `Updated user ${userId}: ${Object.keys(updates).join(', ')}`
    );

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
