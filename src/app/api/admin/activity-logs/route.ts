import { NextRequest, NextResponse } from 'next/server';
import { getActivityLogs } from '@/lib/activityLog';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);
    
    // Allow both admin and regular users to view logs
    // (they can see all logs, but only admin can manage users)

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '500');

    // Use await since getActivityLogs is now async
    const logs = await getActivityLogs(limit);
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Get activity logs error:', error);
    return NextResponse.json({ error: 'Failed to get activity logs' }, { status: 500 });
  }
}
