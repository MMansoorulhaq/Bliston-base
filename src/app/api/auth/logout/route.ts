import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/activityLog';

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    
    if (session) {
      const sessionData = JSON.parse(session.value);
      await logActivity(sessionData.userId, sessionData.username, 'LOGOUT', 'User logged out');
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_session');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: true }); // Always succeed
  }
}
