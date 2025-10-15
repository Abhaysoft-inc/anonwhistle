import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (token) {
      // Verify token to get user info for audit log
      const session = verifyToken(token);
      
      if (session) {
        await logAuditEvent(
          session.officialId,
          session.email,
          'logout',
          {
            metadata: { success: true },
            ipAddress: request.ip,
            userAgent: request.headers.get('user-agent') || undefined,
          }
        );
      }
    }

    // Create response and clear the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to logout.' },
    { status: 405 }
  );
}