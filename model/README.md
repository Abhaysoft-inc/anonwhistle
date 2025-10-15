# Anonymous Evidence Upload & Official Dashboard System

A comprehensive Next.js application for secure anonymous evidence submission and official review, featuring AI-powered text extraction, vector embeddings, and government-grade security.

## 🚀 Features

### Public Evidence Upload
- **Anonymous Submission**: Secure file upload without user identification
- **Multi-format Support**: PDFs, images (JPG, PNG, GIF, WebP), text documents
- **OCR Processing**: Automatic text extraction from images and PDFs using Tesseract.js
- **AI Embeddings**: Convert extracted text to vector embeddings using OpenAI
- **Vector Storage**: Store embeddings in Pinecone vector database
- **Metadata Enrichment**: Optional categorization, location, and tagging

### Official Dashboard (Secure Access)
- **JWT Authentication**: Secure login for authorized government officials
- **Role-based Access**: Support for investigators, supervisors, and administrators
- **Evidence Overview**: Paginated view of all submitted evidence
- **Semantic Search**: AI-powered search using vector similarity
- **Privacy Protection**: Automatic anonymization of personally identifiable information
- **Audit Logging**: Complete tracking of who accessed what data and when
- **Real-time Analytics**: Dashboard with statistics and insights

## 🔐 Security Features

- **Government Email Validation**: Only official email domains allowed
- **Session Management**: Secure HTTP-only cookies with JWT tokens
- **Audit Trail**: Complete logging of all access and search activities
- **Data Anonymization**: Automatic redaction of PII (emails, SSNs, phone numbers, addresses)
- **Role-based Permissions**: Hierarchical access control (investigator < supervisor < admin)

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, React 18, TailwindCSS
- **Backend**: Next.js API routes
- **File Processing**: Tesseract.js (OCR), PDF parsing
- **AI Services**: OpenAI Embeddings API, Google Gemini (configured)
- **Vector Database**: Pinecone with multi-index support
- **File Handling**: Formidable for server-side uploads

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Authentication**: JWT, bcryptjs
- **AI/ML**: OpenAI embeddings API, Tesseract.js OCR
- **Database**: Pinecone vector database
- **File Processing**: PDF parsing, image processing

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── data/         # Data access endpoints
│   │   ├── upload/       # File upload endpoint
│   │   └── search/       # Search endpoint
│   ├── dashboard/        # Official dashboard
│   ├── login/           # Login page
│   └── page.tsx         # Public homepage
├── components/          # React components
│   ├── Sidebar.tsx      # Dashboard navigation
│   ├── EvidenceTable.tsx # Evidence list view
│   ├── SearchInterface.tsx # Search functionality
│   ├── EvidenceModal.tsx # Evidence detail modal
│   ├── FileUpload.tsx   # File upload component
│   └── EvidenceSearch.tsx # Public search
├── lib/                 # Utilities and services
│   ├── auth.ts          # Authentication logic
│   ├── audit.ts         # Audit logging
│   ├── config.ts        # Configuration
│   ├── dataAccess.ts    # Data access layer
│   ├── embeddings.ts    # OpenAI embeddings
│   ├── textExtraction.ts # OCR and text processing
│   └── vectorStore.ts   # Pinecone integration
└── types/
    └── index.ts         # TypeScript definitions
```

## 🎯 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Pinecone account and API key

### Environment Variables
Create `.env.local` file in the root directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini Configuration (optional)
GOOGLE_API_KEY=your_google_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_REGION=us-east-1
TEXT_INDEX_NAME=my-multimodal-rag-text
IMAGE_INDEX_NAME=my-multimodal-rag-image

# LLM Configuration
GEMINI_MODEL_NAME=gemini-2.5-pro

# Authentication Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation Steps

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and configuration

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Public Upload: `http://localhost:3000`
   - Official Login: `http://localhost:3000/login`
   - Dashboard: `http://localhost:3000/dashboard`

## 👤 Demo Accounts

For testing the official dashboard, use these demo credentials:

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| Investigator | `investigator@gov.agency` | `password123` | Basic evidence access |
| Supervisor | `supervisor@gov.agency` | `password123` | Enhanced access + oversight |
| Administrator | `admin@gov.agency` | `password123` | Full system access |

## 📋 API Endpoints

### Public APIs
- `POST /api/upload` - Anonymous evidence upload
- `POST /api/search` - Public evidence search

### Authentication APIs
- `POST /api/auth/login` - Official login
- `POST /api/auth/logout` - Secure logout
- `GET /api/auth/session` - Session validation

### Data Access APIs (Authenticated)
- `GET /api/data/all` - Retrieve all evidence records
- `POST /api/data/search` - Semantic evidence search

## 📝 Supported File Types

- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, TXT, DOC, DOCX
- **Maximum file size**: 10MB

## 🔄 Workflow

### Evidence Submission Workflow
1. **Upload**: Anonymous user uploads evidence file
2. **Processing**: System extracts text using OCR (images/PDFs)
3. **Embedding**: Text converted to vector embeddings
4. **Storage**: Embeddings stored in Pinecone with metadata
5. **Confirmation**: User receives upload confirmation

### Official Review Workflow
1. **Authentication**: Official logs in with government credentials
2. **Dashboard**: Access to evidence overview and search tools
3. **Search**: Semantic search across all evidence using AI
4. **Review**: View evidence details with PII automatically redacted
5. **Audit**: All access and searches logged for compliance

## 🛡️ Privacy & Compliance

- **Anonymous Submission**: No user identification required for evidence upload
- **Automatic PII Redaction**: Emails, SSNs, phone numbers, and addresses automatically masked
- **Secure Access**: JWT-based authentication with government email validation
- **Complete Audit Trail**: Every access, search, and action logged with timestamps
- **Role-based Security**: Hierarchical access control based on official roles

## 🚀 Production Deployment

### Security Considerations
- Change JWT secret to a secure, random value
- Use HTTPS in production
- Implement proper database with user management
- Set up proper backup and disaster recovery
- Configure monitoring and alerting
- Implement rate limiting and DDoS protection

### Scaling Considerations
- Use a production database (PostgreSQL/MongoDB) for user and audit data
- Implement Redis for session storage
- Use a CDN for file uploads
- Set up load balancing for high availability
- Implement proper logging and monitoring

## 📝 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. **Authentication**: Extend roles and permissions in `lib/auth.ts`
2. **Data Processing**: Add new file types in `lib/textExtraction.ts`
3. **Search**: Enhance search capabilities in `lib/vectorStore.ts`
4. **UI Components**: Add new dashboard components in `components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is intended for government and official use. Please ensure compliance with your organization's security and privacy requirements.

## ⚠️ Important Notes

- This is a demonstration system with mock data and simplified authentication
- In production, implement proper user management and database storage
- Ensure compliance with relevant data protection and privacy laws
- Regular security audits and penetration testing recommended
- All API keys and secrets should be properly secured and rotated regularly

### API Examples

#### POST /api/upload
Upload files and extract text for vector embedding storage.

**Request**: FormData with files and optional metadata
**Response**: 
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "results": [
    {
      "filename": "document.pdf",
      "fileId": "uuid",
      "textLength": 1500,
      "embeddingId": "vector-uuid"
    }
  ]
}
```

#### POST /api/search
Search uploaded evidence using natural language queries.

**Request**:
```json
{
  "query": "search term",
  "topK": 10,
  "searchImages": false
}
```

**Response**:
```json
{
  "results": [
    {
      "id": "vector-uuid",
      "fileId": "file-uuid",
      "filename": "document.pdf",
      "text": "extracted content...",
      "score": 0.95,
      "metadata": {}
    }
  ]
}
```

## Getting Started

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd evidence-upload-system
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Setup Pinecone**:
   - Create indexes `my-multimodal-rag-text` and `my-multimodal-rag-image`
   - Use 3072 dimensions for OpenAI text-embedding-3-large
   - Set metric to cosine similarity

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Access Application**:
   Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload Evidence**: 
   - Drag files onto the upload area or click to browse
   - Add optional metadata (complaint type, date, location)
   - Files are automatically processed and stored

2. **Search Evidence**:
   - Enter natural language queries
   - Toggle between text and image search
   - Results show relevance scores and extracted content

## Development

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: Files are typed with TypeScript

## Architecture Notes

- **Dual-Index Strategy**: Separate Pinecone indexes for text and image content
- **Multimodal Support**: OCR extraction enables search across image content
- **Scalable Design**: Serverless architecture with Next.js API routes
- **Error Handling**: Comprehensive error handling for file processing and API calls

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly
5. Submit pull request

## License

This project is private and proprietary.