import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, requireAuth } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { searchEvidenceRecords } from '@/lib/dataAccess';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { 
      query, 
      topK = 10, 
      filters = {} 
    } = body;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate topK
    if (topK < 1 || topK > 100) {
      return NextResponse.json(
        { error: 'topK must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Parse filters
    const searchFilters = {
      category: filters.category || undefined,
      location: filters.location || undefined,
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      tags: filters.tags || undefined,
    };

    // Perform search
    const results = await searchEvidenceRecords(query.trim(), {
      topK,
      filters: searchFilters,
    });

    // Log search activity
    await logAuditEvent(
      session.officialId,
      session.email,
      'search_evidence',
      {
        resourceType: 'search_query',
        metadata: {
          query: query.trim(),
          topK,
          filters: searchFilters,
          resultCount: results.length,
        },
        ipAddress: request.ip,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    );

    return NextResponse.json({
      success: true,
      query: query.trim(),
      filters: searchFilters,
      results: results.map(result => ({
        ...result,
        // Truncate full text for search results
        fullText: result.fullText.length > 500 
          ? result.fullText.substring(0, 500) + '...' 
          : result.fullText,
      })),
      totalResults: results.length,
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to search.' },
    { status: 405 }
  );
}