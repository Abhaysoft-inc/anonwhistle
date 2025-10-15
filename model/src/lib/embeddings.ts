import OpenAI from 'openai';
import { config } from './config';

// Initialize OpenAI only if API key is properly configured
let openai: OpenAI | null = null;

function initializeOpenAI() {
  if (!openai && config.openai.apiKey && config.openai.apiKey !== 'your_openai_api_key_here') {
    openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }
  return openai;
}

// Generate a mock embedding for demo purposes
function generateMockEmbedding(text: string): number[] {
  // Create a consistent mock embedding based on text content
  const dimension = 1536; // OpenAI text-embedding-3-large dimension
  const embedding = new Array(dimension);
  
  // Simple hash-based mock embedding
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate consistent values between -1 and 1
  for (let i = 0; i < dimension; i++) {
    const seed = hash + i;
    embedding[i] = (Math.sin(seed) + Math.cos(seed * 0.7)) * 0.5;
  }
  
  return embedding;
}

export async function createEmbedding(text: string): Promise<number[]> {
  const client = initializeOpenAI();
  
  if (!client) {
    console.warn('OpenAI API key not configured, using mock embedding for demo');
    return generateMockEmbedding(text);
  }

  try {
    const response = await client.embeddings.create({
      model: config.openai.model,
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI embedding error, falling back to mock:', error);
    // Fallback to mock embedding if API fails
    return generateMockEmbedding(text);
  }
}

export async function createQueryEmbedding(query: string): Promise<number[]> {
  return createEmbedding(query);
}