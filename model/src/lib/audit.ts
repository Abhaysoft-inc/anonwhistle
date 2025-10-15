import { AuditLog } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock audit log storage (in production, this would be a database)
const auditLogs: AuditLog[] = [];

export async function logAuditEvent(
  officialId: string,
  officialEmail: string,
  action: AuditLog['action'],
  options?: {
    resourceId?: string;
    resourceType?: AuditLog['resourceType'];
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<void> {
  const logEntry: AuditLog = {
    id: uuidv4(),
    officialId,
    officialEmail,
    action,
    resourceId: options?.resourceId,
    resourceType: options?.resourceType,
    metadata: options?.metadata,
    timestamp: new Date(),
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
  };

  auditLogs.push(logEntry);
  
  // In production, save to database
  console.log('Audit Log:', logEntry);
}

export async function getAuditLogs(
  filters?: {
    officialId?: string;
    action?: AuditLog['action'];
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }
): Promise<AuditLog[]> {
  let filteredLogs = [...auditLogs];

  if (filters?.officialId) {
    filteredLogs = filteredLogs.filter(log => log.officialId === filters.officialId);
  }

  if (filters?.action) {
    filteredLogs = filteredLogs.filter(log => log.action === filters.action);
  }

  if (filters?.dateFrom) {
    filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.dateFrom!);
  }

  if (filters?.dateTo) {
    filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.dateTo!);
  }

  // Sort by timestamp descending
  filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (filters?.limit) {
    filteredLogs = filteredLogs.slice(0, filters.limit);
  }

  return filteredLogs;
}

export function anonymizeAuditLog(log: AuditLog): Omit<AuditLog, 'officialId' | 'officialEmail'> & { 
  officialId: string;
  officialEmail: string;
} {
  // For privacy, hash sensitive fields
  return {
    ...log,
    officialId: `***${log.officialId.slice(-4)}`,
    officialEmail: `***@${log.officialEmail.split('@')[1]}`,
  };
}