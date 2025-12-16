import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/users';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);
    const user = getUserById(sessionData.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
