import { searchSimilar } from './vectorStore';
import { createEmbedding } from './embeddings';
import { EvidenceRecord, PaginatedResponse, SearchFilters } from '@/types';

// Mock evidence data for demonstration (in production, this would query the vector database)
const mockEvidenceRecords: EvidenceRecord[] = [
  {
    id: '1',
    fileId: 'file-001',
    summary: 'Report concerning workplace harassment incidents involving multiple employees in the marketing department.',
    fullText: 'This report documents several incidents of workplace harassment that have occurred over the past three months in the marketing department. The incidents include inappropriate comments, unwelcome advances, and creation of a hostile work environment. Multiple employees have come forward with similar complaints. The pattern suggests a systematic issue that requires immediate investigation and intervention.',
    uploadDate: new Date('2024-10-10'),
    category: 'harassment',
    location: 'Marketing Department',
    tags: ['workplace', 'harassment', 'multiple-victims'],
    confidence: 0.92,
    metadata: {
      filename: 'harassment_report_001.pdf',
      fileType: 'application/pdf',
      uploadedAt: '2024-10-10T10:30:00Z',
      complaintType: 'harassment',
      incidentDate: '2024-10-05',
      location: 'Marketing Department',
    },
  },
  {
    id: '2',
    fileId: 'file-002',
    summary: 'Financial irregularities discovered in procurement process, potential fraud involving vendor relationships.',
    fullText: 'An investigation into the procurement process has revealed significant financial irregularities. There appears to be unauthorized modifications to vendor contracts, inflated pricing, and potential kickback arrangements. The evidence suggests coordinated effort to defraud the organization through manipulation of the procurement system. Several contracts show suspicious patterns and require forensic accounting review.',
    uploadDate: new Date('2024-10-12'),
    category: 'fraud',
    location: 'Procurement Office',
    tags: ['financial', 'fraud', 'procurement', 'vendor'],
    confidence: 0.88,
    metadata: {
      filename: 'procurement_fraud_evidence.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: '2024-10-12T14:15:00Z',
      complaintType: 'fraud',
      incidentDate: '2024-10-01',
      location: 'Procurement Office',
    },
  },
  {
    id: '3',
    fileId: 'file-003',
    summary: 'Safety protocol violations observed in manufacturing facility, endangering worker health.',
    fullText: 'Multiple safety protocol violations have been documented at the main manufacturing facility. Workers are not being provided with adequate protective equipment, safety training has been inadequate, and several near-miss incidents have not been properly reported. The violations appear to be systematic and pose serious risks to worker health and safety. Immediate corrective action is required to prevent potential accidents.',
    uploadDate: new Date('2024-10-08'),
    category: 'safety',
    location: 'Manufacturing Facility A',
    tags: ['safety', 'workplace', 'violations', 'health'],
    confidence: 0.95,
    metadata: {
      filename: 'safety_violations_report.pdf',
      fileType: 'application/pdf',
      uploadedAt: '2024-10-08T09:45:00Z',
      complaintType: 'safety',
      incidentDate: '2024-10-03',
      location: 'Manufacturing Facility A',
    },
  },
  {
    id: '4',
    fileId: 'file-004',
    summary: 'Discriminatory hiring practices targeting specific demographic groups identified in HR processes.',
    fullText: 'Evidence has been collected showing discriminatory hiring practices within the human resources department. The evidence includes internal communications, hiring statistics, and witness testimonies that suggest systematic discrimination against certain demographic groups. The practices appear to violate equal employment opportunity regulations and require immediate investigation by appropriate authorities.',
    uploadDate: new Date('2024-10-14'),
    category: 'discrimination',
    location: 'Human Resources',
    tags: ['discrimination', 'hiring', 'hr', 'equal-opportunity'],
    confidence: 0.90,
    metadata: {
      filename: 'hiring_discrimination_evidence.txt',
      fileType: 'text/plain',
      uploadedAt: '2024-10-14T11:20:00Z',
      complaintType: 'discrimination',
      incidentDate: '2024-09-15',
      location: 'Human Resources',
    },
  },
  {
    id: '5',
    fileId: 'file-005',
    summary: 'Data privacy breach involving unauthorized access to confidential customer information.',
    fullText: 'A significant data privacy breach has been identified involving unauthorized access to confidential customer information. The breach appears to have been ongoing for several weeks before detection. Personal information including names, addresses, social security numbers, and financial data may have been compromised. The incident requires immediate notification to affected customers and regulatory authorities.',
    uploadDate: new Date('2024-10-11'),
    category: 'privacy',
    location: 'IT Department',
    tags: ['data-breach', 'privacy', 'customer-data', 'security'],
    confidence: 0.87,
    metadata: {
      filename: 'data_breach_report.pdf',
      fileType: 'application/pdf',
      uploadedAt: '2024-10-11T16:30:00Z',
      complaintType: 'other',
      incidentDate: '2024-09-28',
      location: 'IT Department',
    },
  },
];

export async function getAllEvidenceRecords(options: {
  page: number;
  limit: number;
  filters?: SearchFilters;
}): Promise<PaginatedResponse<EvidenceRecord>> {
  const { page, limit, filters } = options;
  
  let filteredRecords = [...mockEvidenceRecords];

  // Apply filters
  if (filters?.category) {
    filteredRecords = filteredRecords.filter(record => 
      record.category?.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  if (filters?.location) {
    filteredRecords = filteredRecords.filter(record => 
      record.location?.toLowerCase().includes(filters.location?.toLowerCase() || '')
    );
  }

  if (filters?.dateFrom) {
    filteredRecords = filteredRecords.filter(record => 
      record.uploadDate >= filters.dateFrom!
    );
  }

  if (filters?.dateTo) {
    filteredRecords = filteredRecords.filter(record => 
      record.uploadDate <= filters.dateTo!
    );
  }

  if (filters?.tags && filters.tags.length > 0) {
    filteredRecords = filteredRecords.filter(record => 
      filters.tags!.some(tag => 
        record.tags.some(recordTag => 
          recordTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }

  // Sort by upload date descending
  filteredRecords.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

  // Paginate
  const total = filteredRecords.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  return {
    data: paginatedRecords,
    total,
    page,
    limit,
    hasNext: endIndex < total,
    hasPrev: page > 1,
  };
}

export async function searchEvidenceRecords(
  query: string,
  options: {
    topK?: number;
    filters?: SearchFilters;
  } = {}
): Promise<EvidenceRecord[]> {
  const { topK = 10, filters } = options;

  try {
    // Create embedding for the query
    const queryEmbedding = await createEmbedding(query);

    // Search similar vectors in the database
    const searchResults = await searchSimilar(queryEmbedding, topK, {
      // Convert filters to Pinecone filter format
      ...(filters?.category && { complaintType: filters.category }),
      ...(filters?.location && { location: filters.location }),
    });

    // Convert search results to evidence records
    const evidenceRecords: EvidenceRecord[] = searchResults.map(result => ({
      id: result.id,
      fileId: result.fileId,
      summary: result.text.substring(0, 200) + '...',
      fullText: result.text,
      uploadDate: new Date(result.metadata.uploadedAt),
      category: result.metadata.complaintType,
      location: result.metadata.location,
      tags: result.metadata.tags || [],
      confidence: result.score,
      metadata: result.metadata,
    }));

    // Apply additional filters if needed
    let filteredRecords = evidenceRecords;

    if (filters?.dateFrom || filters?.dateTo) {
      filteredRecords = filteredRecords.filter(record => {
        if (filters.dateFrom && record.uploadDate < filters.dateFrom) return false;
        if (filters.dateTo && record.uploadDate > filters.dateTo) return false;
        return true;
      });
    }

    return filteredRecords;

  } catch (error) {
    console.error('Search evidence error:', error);
    // Fallback to mock data search if vector search fails
    return mockEvidenceRecords
      .filter(record => 
        record.summary.toLowerCase().includes(query.toLowerCase()) ||
        record.fullText.toLowerCase().includes(query.toLowerCase()) ||
        record.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, topK);
  }
}

export async function getEvidenceById(id: string): Promise<EvidenceRecord | null> {
  const record = mockEvidenceRecords.find(r => r.id === id);
  return record || null;
}

export function anonymizeEvidenceText(text: string): string {
  // Remove or mask potentially identifying information
  const anonymized = text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]')
    .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE_REDACTED]')
    .replace(/\b\d{1,5}\s\w+\s(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi, '[ADDRESS_REDACTED]');

  return anonymized;
}