import { NextRequest, NextResponse } from 'next/server';
import { authenticateOfficial, generateToken, isValidOfficialEmail } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { LoginRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate official email format
    if (!isValidOfficialEmail(email)) {
      await logAuditEvent(
        'unknown',
        email,
        'login',
        {
          metadata: { success: false, reason: 'invalid_email_domain' },
          ipAddress: request.ip,
          userAgent: request.headers.get('user-agent') || undefined,
        }
      );
      
      return NextResponse.json(
        { error: 'Invalid official email domain' },
        { status: 401 }
      );
    }

    // Authenticate official
    const official = authenticateOfficial(email, password);

    if (!official) {
      await logAuditEvent(
        'unknown',
        email,
        'login',
        {
          metadata: { success: false, reason: 'invalid_credentials' },
          ipAddress: request.ip,
          userAgent: request.headers.get('user-agent') || undefined,
        }
      );
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(official);

    // Log successful login
    await logAuditEvent(
      official.id,
      official.email,
      'login',
      {
        metadata: { success: true },
        ipAddress: request.ip,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    );

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      official: {
        id: official.id,
        email: official.email,
        name: official.name,
        department: official.department,
        role: official.role,
      },
      message: 'Login successful',
    });

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to login.' },
    { status: 405 }
  );
}