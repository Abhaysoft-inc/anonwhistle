import { Official, AuthSession } from '@/types';
import { logAuditEvent } from './audit';

// Simple session store (in production, use Redis or database)
const activeSessions: Map<string, AuthSession> = new Map();

// Mock database of officials with simple password check
const MOCK_OFFICIALS: Record<string, Official & { password: string }> = {
  'investigator@gov.agency': {
    id: '1',
    email: 'investigator@gov.agency',
    name: 'John Investigator',
    department: 'Internal Affairs',
    role: 'investigator',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    password: 'password123',
  },
  'supervisor@gov.agency': {
    id: '2',
    email: 'supervisor@gov.agency',
    name: 'Jane Supervisor',
    department: 'Oversight Division',
    role: 'supervisor',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    password: 'password123',
  },
  'admin@gov.agency': {
    id: '3',
    email: 'admin@gov.agency',
    name: 'Admin User',
    department: 'System Administration',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    password: 'password123',
  }
};

/**
 * Simple dummy authentication - just checks email and password
 */
export function authenticateOfficial(email: string, password: string): Official | null {
  const official = MOCK_OFFICIALS[email.toLowerCase()];
  
  if (!official || !official.isActive) {
    return null;
  }

  // Simple password check
  if (official.password !== password) {
    return null;
  }

  // Update last login
  official.lastLogin = new Date();

  // Remove password from returned object
  const { password: _, ...officialWithoutPassword } = official;
  return officialWithoutPassword;
}

/**
 * Create a simple session token (just a random string for dummy auth)
 */
export function generateToken(official: Official): string {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  
  const session: AuthSession = {
    officialId: official.id,
    email: official.email,
    role: official.role,
    name: official.name,
    department: official.department,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  // Store session in memory
  activeSessions.set(sessionId, session);
  
  return sessionId;
}

/**
 * Verify a session token and return the session data
 */
export function verifyToken(token: string): AuthSession | null {
  const session = activeSessions.get(token);
  
  if (!session) {
    return null;
  }

  // Check if session is expired
  const now = Math.floor(Date.now() / 1000);
  if (now > session.exp) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

/**
 * Remove a session (logout)
 */
export function removeToken(token: string): void {
  activeSessions.delete(token);
}

/**
 * Get official by ID
 */
export function getOfficialById(id: string): Official | null {
  const official = Object.values(MOCK_OFFICIALS).find(o => o.id === id);
  if (official) {
    const { password: _, ...officialData } = official;
    return officialData;
  }
  return null;
}

/**
 * Simple government email validation
 */
export function isValidOfficialEmail(email: string): boolean {
  const govDomains = ['gov.agency', 'government.org', 'official.gov'];
  const domain = email.split('@')[1]?.toLowerCase();
  return govDomains.includes(domain);
}

/**
 * Check if user has required role access
 */
export function requireAuth(requiredRole?: Official['role']) {
  return function (session: AuthSession | null): boolean {
    if (!session) return false;
    
    if (requiredRole) {
      const roleHierarchy = { investigator: 1, supervisor: 2, admin: 3 };
      return roleHierarchy[session.role] >= roleHierarchy[requiredRole];
    }
    
    return true;
  };
}