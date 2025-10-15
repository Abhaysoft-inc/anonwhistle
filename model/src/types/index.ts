export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: Date;
  userId?: string;
  extractedText?: string;
  metadata?: FileMetadata;
}

export interface FileMetadata {
  complaintType?: string;
  incidentDate?: string;
  location?: string;
  tags?: string[];
  description?: string;
}

export interface VectorEntry {
  id: string;
  fileId: string;
  embedding: number[];
  text: string;
  metadata: {
    filename: string;
    fileType: string;
    uploadedAt: string;
    userId?: string;
    complaintType?: string;
    incidentDate?: string;
    location?: string;
    tags?: string[];
    // Extended metadata for complaint system
    id?: string;
    title?: string;
    category?: string;
    description?: string;
    uploaded_at?: string;
    source_file?: string;
    file_type?: string;
    original_text_length?: number;
    status?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

// New complaint-specific interface
export interface ComplaintRecord {
  id: string;
  title: string;
  category: string;
  description?: string;
  uploaded_at: string;
  source_file: string;
  file_type: string;
  original_text_length: number;
  embedding_vector?: number[];
  status: 'active' | 'processing' | 'reviewed' | 'closed';
}

export interface SearchResult {
  id: string;
  fileId: string;
  filename: string;
  text: string;
  score: number;
  metadata: VectorEntry['metadata'];
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'extracting' | 'embedding' | 'storing' | 'completed' | 'error';
  error?: string;
}

// Authentication Types
export interface Official {
  id: string;
  email: string;
  name: string;
  department: string;
  role: 'investigator' | 'supervisor' | 'admin';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  officialId: string;
  email: string;
  name: string;
  department: string;
  role: Official['role'];
  iat: number;
  exp: number;
}

export interface AuditLog {
  id: string;
  officialId: string;
  officialEmail: string;
  action: 'login' | 'logout' | 'view_evidence' | 'search_evidence' | 'export_data';
  resourceId?: string;
  resourceType?: 'evidence' | 'search_query';
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Dashboard Types
export interface EvidenceRecord {
  id: string;
  fileId: string;
  summary: string;
  fullText: string;
  uploadDate: Date;
  category?: string;
  location?: string;
  tags: string[];
  confidence: number;
  metadata: VectorEntry['metadata'];
}

export interface SearchFilters {
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  location?: string;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}