import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, requireAuth } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { getAllEvidenceRecords } from '@/lib/dataAccess';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    
    if (!session || !requireAuth()(session)) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;

    // Get evidence records with filters
    const result = await getAllEvidenceRecords({
      page,
      limit,
      filters: {
        category,
        location,
        dateFrom,
        dateTo,
      },
    });

    // Log access
    await logAuditEvent(
      session.officialId,
      session.email,
      'view_evidence',
      {
        metadata: {
          page,
          limit,
          totalResults: result.total,
          filters: { category, location, dateFrom, dateTo },
        },
        ipAddress: request.ip,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    );

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('Data all API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve data.' },
    { status: 405 }
  );
}