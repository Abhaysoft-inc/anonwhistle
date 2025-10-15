import { Pinecone } from '@pinecone-database/pinecone';
import { config } from './config';
import { VectorEntry, SearchResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';

let pineconeClient: Pinecone | null = null;

// Mock storage for demo mode
const mockStorage: Map<string, VectorEntry & { id: string }> = new Map();

function isPineconeConfigured(): boolean {
  return !!(config.pinecone.apiKey && 
           config.pinecone.apiKey !== 'your_pinecone_api_key_here' &&
           config.pinecone.apiKey.startsWith('pcsk_'));
}

async function getPineconeClient(): Promise<Pinecone | null> {
  if (!isPineconeConfigured()) {
    return null;
  }
  
  if (!pineconeClient) {
    try {
      pineconeClient = new Pinecone({
        apiKey: config.pinecone.apiKey,
      });
    } catch (error) {
      console.error('Failed to initialize Pinecone client:', error);
      return null;
    }
  }
  return pineconeClient;
}

export async function storeEmbedding(entry: Omit<VectorEntry, 'id'>): Promise<string> {
  const id = uuidv4();
  
  try {
    const client = await getPineconeClient();
    
    if (!client) {
      // Mock storage mode
      console.warn('Pinecone not configured, using mock storage for demo');
      const mockEntry = { id, ...entry };
      mockStorage.set(id, mockEntry);
      console.log(`Stored in mock storage: ${id} (${entry.text.substring(0, 50)}...)`);
      return id;
    }

    const indexName = entry.metadata.fileType?.includes('image') ? config.pinecone.imageIndex : config.pinecone.textIndex;
    const index = client.index(indexName);
    
    const vector = {
      id,
      values: entry.embedding,
      metadata: {
        ...entry.metadata,
        text: entry.text,
        fileId: entry.fileId,
      },
    };

    await index.upsert([vector]);
    return id;
  } catch (error) {
    console.error('Pinecone storage error, falling back to mock storage:', error);
    // Fallback to mock storage
    const mockEntry = { id, ...entry };
    mockStorage.set(id, mockEntry);
    return id;
  }
}

export async function searchSimilar(
  queryEmbedding: number[],
  topK: number = 10,
  filter?: Record<string, any>,
  searchImages: boolean = false
): Promise<SearchResult[]> {
  try {
    const client = await getPineconeClient();
    
    if (!client) {
      // Mock search mode
      console.warn('Pinecone not configured, using mock search');
      const results: SearchResult[] = [];
      
      // Simple mock search through stored entries
      mockStorage.forEach((entry, id) => {
        if (results.length >= topK) return;
        
        results.push({
          id,
          fileId: entry.fileId,
          filename: entry.metadata.filename,
          text: entry.text,
          score: Math.random() * 0.5 + 0.5, // Mock score between 0.5-1.0
          metadata: entry.metadata,
        });
      });
      
      return results;
    }

    const indexName = searchImages ? config.pinecone.imageIndex : config.pinecone.textIndex;
    const index = client.index(indexName);
    
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      includeValues: false,
      includeMetadata: true,
      filter,
    });

    return queryResponse.matches?.map(match => ({
      id: match.id,
      fileId: match.metadata?.fileId as string,
      filename: match.metadata?.filename as string,
      text: match.metadata?.text as string,
      score: match.score || 0,
      metadata: match.metadata as SearchResult['metadata'],
    })) || [];
  } catch (error) {
    console.error('Pinecone search error, falling back to mock:', error);
    // Fallback to mock search
    const results: SearchResult[] = [];
    mockStorage.forEach((entry, id) => {
      if (results.length >= topK) return;
      results.push({
        id,
        fileId: entry.fileId,
        filename: entry.metadata.filename,
        text: entry.text,
        score: Math.random() * 0.5 + 0.5,
        metadata: entry.metadata,
      });
    });
    return results;
  }
}

export async function deleteFileVectors(fileId: string, isImage: boolean = false): Promise<void> {
  try {
    const client = await getPineconeClient();
    
    if (!client) {
      // Mock deletion mode
      console.warn('Pinecone not configured, using mock deletion');
      mockStorage.forEach((entry, id) => {
        if (entry.fileId === fileId) {
          mockStorage.delete(id);
        }
      });
      return;
    }

    const indexName = isImage ? config.pinecone.imageIndex : config.pinecone.textIndex;
    const index = client.index(indexName);
    
    // First, find all vectors for this file
    const queryResponse = await index.query({
      vector: new Array(3072).fill(0), // dummy vector for metadata-only query
      topK: 1000,
      includeValues: false,
      includeMetadata: true,
      filter: { fileId },
    });

    if (queryResponse.matches && queryResponse.matches.length > 0) {
      const idsToDelete = queryResponse.matches.map(match => match.id);
      await index.deleteMany(idsToDelete);
    }
  } catch (error) {
    console.error('Pinecone deletion error, falling back to mock:', error);
    // Fallback to mock deletion
    mockStorage.forEach((entry, id) => {
      if (entry.fileId === fileId) {
        mockStorage.delete(id);
      }
    });
  }
}