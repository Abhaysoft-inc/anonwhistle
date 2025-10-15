import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getOfficialById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Verify and decode token
    const session = verifyToken(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get current official info
    const official = getOfficialById(session.officialId);

    if (!official || !official.isActive) {
      return NextResponse.json(
        { error: 'Official not found or inactive' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        officialId: session.officialId,
        email: session.email,
        name: session.name,
        department: session.department,
        role: session.role,
      },
      official: {
        id: official.id,
        email: official.email,
        name: official.name,
        department: official.department,
        role: official.role,
        lastLogin: official.lastLogin,
      },
    });

  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}