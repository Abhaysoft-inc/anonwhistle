import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile, cleanExtractedText } from '@/lib/textExtraction';
import { createEmbedding } from '@/lib/embeddings';
import { storeEmbedding } from '@/lib/vectorStore';
import { config, validateEnvVars } from '@/lib/config';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    validateEnvVars();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Get complaint metadata from form
    const title = formData.get('title') as string || 'Untitled Complaint';
    const category = formData.get('category') as string || 'General';
    const description = formData.get('description') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!config.upload.allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `File type ${file.type} is not supported. Allowed types: .pdf, .docx, .txt, .png, .jpg` 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > config.upload.maxFileSize) {
      return NextResponse.json({ 
        error: `File size exceeds maximum limit of ${config.upload.maxFileSize / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from file
    let extractedText: string;
    try {
      extractedText = await extractTextFromFile(buffer, file.type);
      extractedText = cleanExtractedText(extractedText);
    } catch (error) {
      console.error('Text extraction failed:', error);
      return NextResponse.json({ 
        error: 'Failed to extract text from file' 
      }, { status: 500 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ 
        error: 'No text content found in file' 
      }, { status: 400 });
    }

    // Create embedding
    let embedding: number[];
    try {
      embedding = await createEmbedding(extractedText);
    } catch (error) {
      console.error('Embedding creation failed:', error);
      return NextResponse.json({ 
        error: 'Failed to create embedding' 
      }, { status: 500 });
    }

    // Generate complaint ID
    const complaintId = `complaint_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Get file extension for file_type
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    
    // Create structured metadata according to requirements
    const complaintMetadata = {
      id: complaintId,
      title: title,
      category: category,
      description: description,
      uploaded_at: new Date().toISOString(),
      source_file: file.name,
      file_type: fileExtension,
      original_text_length: extractedText.length,
      status: 'active'
    };

    // Store in vector database
    const vectorEntry = {
      fileId: complaintId,
      embedding,
      text: extractedText,
      metadata: {
        filename: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        // Complaint-specific metadata
        ...complaintMetadata,
        fileSize: file.size,
        mimeType: file.type,
      },
    };

    let vectorId: string;
    try {
      vectorId = await storeEmbedding(vectorEntry);
    } catch (error) {
      console.error('Vector storage failed:', error);
      return NextResponse.json({ 
        error: 'Failed to store in vector database' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint stored successfully',
      record_id: complaintId,
      data: {
        id: complaintId,
        title: title,
        category: category,
        filename: file.name,
        text_length: extractedText.length,
        vector_id: vectorId,
        uploaded_at: complaintMetadata.uploaded_at
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}