# Evidence Upload System - Project Instructions

This is a Next.js application for uploading and managing evidence files with AI-powered text extraction and vector embeddings.

## Features
- Drag-and-drop file upload interface
- OCR text extraction from images and PDFs  
- Vector embeddings using OpenAI
- Vector database storage with Pinecone
- Search functionality for uploaded evidence
- Clean, responsive UI with TailwindCSS

## Tech Stack
- Frontend: Next.js 14 with TypeScript
- Styling: TailwindCSS
- File Processing: Tesseract.js (OCR), PDF parsing
- AI: OpenAI embeddings API
- Database: Pinecone vector database
- Backend: Next.js API routes

## Environment Variables Required
- `OPENAI_API_KEY`: OpenAI API key for embeddings
- `PINECONE_API_KEY`: Pinecone API key
- `PINECONE_ENVIRONMENT`: Pinecone environment
- `PINECONE_INDEX`: Pinecone index name

## Development
- Run `npm run dev` to start development server
- Access at http://localhost:3000
- API endpoints available at /api/*