import { NextRequest, NextResponse } from 'next/server';
import { createQueryEmbedding } from '@/lib/embeddings';
import { searchSimilar } from '@/lib/vectorStore';
import { validateEnvVars } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    validateEnvVars();

    const { query, filters, topK = 10 } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Query is required and must be a non-empty string' 
      }, { status: 400 });
    }

    // Create embedding for the query
    let queryEmbedding: number[];
    try {
      queryEmbedding = await createQueryEmbedding(query.trim());
    } catch (error) {
      console.error('Query embedding failed:', error);
      return NextResponse.json({ 
        error: 'Failed to create query embedding' 
      }, { status: 500 });
    }

    // Search similar vectors
    let results;
    try {
      results = await searchSimilar(queryEmbedding, topK, filters);
    } catch (error) {
      console.error('Vector search failed:', error);
      return NextResponse.json({ 
        error: 'Failed to search vectors' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      query,
      results: results.map(result => ({
        ...result,
        text: result.text.length > 500 ? result.text.substring(0, 500) + '...' : result.text,
      })),
      totalResults: results.length,
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use POST to search.' 
  }, { status: 405 });
}