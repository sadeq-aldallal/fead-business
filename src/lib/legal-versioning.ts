import { format } from 'date-fns';
import { LegalDocumentTemplate } from './legal-templates';

export interface LegalDocumentVersion {
  version: string;
  createdAt: string;
  createdBy: string;
  changeLog: string[];
  content: string;
  title: string;
}

export interface LegalDocumentAuditEntry {
  id: string;
  documentType: string;
  action: 'created' | 'updated' | 'viewed' | 'exported';
  version: string;
  timestamp: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  changes?: Record<string, { old: string; new: string }>;
}

export class LegalDocumentVersioning {
  private versions: Map<string, LegalDocumentVersion[]> = new Map();
  private auditTrail: LegalDocumentAuditEntry[] = [];

  constructor() {
    this.loadVersionsFromStorage();
    this.loadAuditTrailFromStorage();
  }

  private loadVersionsFromStorage(): void {
    try {
      const stored = localStorage.getItem('legal-document-versions');
      if (stored) {
        const versionsData = JSON.parse(stored);
        this.versions = new Map(Object.entries(versionsData));
      }
    } catch (error) {
      console.warn('Failed to load legal document versions from storage:', error);
    }
  }

  private loadAuditTrailFromStorage(): void {
    try {
      const stored = localStorage.getItem('legal-document-audit');
      if (stored) {
        this.auditTrail = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load legal document audit trail from storage:', error);
    }
  }

  private saveVersionsToStorage(): void {
    try {
      const versionsData = Object.fromEntries(this.versions);
      localStorage.setItem('legal-document-versions', JSON.stringify(versionsData));
    } catch (error) {
      console.warn('Failed to save legal document versions to storage:', error);
    }
  }

  private saveAuditTrailToStorage(): void {
    try {
      localStorage.setItem('legal-document-audit', JSON.stringify(this.auditTrail));
    } catch (error) {
      console.warn('Failed to save legal document audit trail to storage:', error);
    }
  }

  private generateVersionNumber(documentType: string): string {
    const existing = this.versions.get(documentType) || [];
    if (existing.length === 0) {
      return '1.0.0';
    }

    const latest = existing[existing.length - 1];
    const [major, minor, patch] = latest.version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createVersion(
    documentType: string,
    document: LegalDocumentTemplate,
    changeLog: string[] = [],
    createdBy: string = 'system'
  ): LegalDocumentVersion {
    const version: LegalDocumentVersion = {
      version: this.generateVersionNumber(documentType),
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      createdBy,
      changeLog,
      content: document.content,
      title: document.title,
    };

    const existingVersions = this.versions.get(documentType) || [];
    existingVersions.push(version);
    this.versions.set(documentType, existingVersions);

    this.saveVersionsToStorage();

    this.addAuditEntry({
      documentType,
      action: 'created',
      version: version.version,
      userId: createdBy,
    });

    return version;
  }

  updateVersion(
    documentType: string,
    document: LegalDocumentTemplate,
    changeLog: string[],
    updatedBy: string,
    changes?: Record<string, { old: string; new: string }>
  ): LegalDocumentVersion {
    const existingVersions = this.versions.get(documentType) || [];
    const lastVersion = existingVersions[existingVersions.length - 1];

    if (lastVersion && lastVersion.content === document.content) {
      throw new Error('No changes detected. Version not created.');
    }

    const version: LegalDocumentVersion = {
      version: this.generateVersionNumber(documentType),
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      createdBy: updatedBy,
      changeLog,
      content: document.content,
      title: document.title,
    };

    existingVersions.push(version);
    this.versions.set(documentType, existingVersions);

    this.saveVersionsToStorage();

    this.addAuditEntry({
      documentType,
      action: 'updated',
      version: version.version,
      userId: updatedBy,
      changes,
    });

    return version;
  }

  getVersions(documentType: string): LegalDocumentVersion[] {
    return this.versions.get(documentType) || [];
  }

  getLatestVersion(documentType: string): LegalDocumentVersion | null {
    const versions = this.getVersions(documentType);
    return versions.length > 0 ? versions[versions.length - 1] : null;
  }

  getVersion(documentType: string, version: string): LegalDocumentVersion | null {
    const versions = this.getVersions(documentType);
    return versions.find(v => v.version === version) || null;
  }

  addAuditEntry(entry: Omit<LegalDocumentAuditEntry, 'id' | 'timestamp'>): void {
    const auditEntry: LegalDocumentAuditEntry = {
      id: this.generateAuditId(),
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      ipAddress: 'Unknown', // Would need server-side implementation for real IP
      ...entry,
    };

    this.auditTrail.push(auditEntry);

    // Keep only last 1000 audit entries to prevent storage bloat
    if (this.auditTrail.length > 1000) {
      this.auditTrail = this.auditTrail.slice(-1000);
    }

    this.saveAuditTrailToStorage();
  }

  getAuditTrail(
    filters?: {
      documentType?: string;
      action?: string;
      userId?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): LegalDocumentAuditEntry[] {
    let filtered = [...this.auditTrail];

    if (filters) {
      if (filters.documentType) {
        filtered = filtered.filter(entry => entry.documentType === filters.documentType);
      }
      if (filters.action) {
        filtered = filtered.filter(entry => entry.action === filters.action);
      }
      if (filters.userId) {
        filtered = filtered.filter(entry => entry.userId === filters.userId);
      }
      if (filters.fromDate) {
        filtered = filtered.filter(entry => entry.timestamp >= filters.fromDate!);
      }
      if (filters.toDate) {
        filtered = filtered.filter(entry => entry.timestamp <= filters.toDate!);
      }
    }

    return filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  trackDocumentView(documentType: string, version?: string, userId?: string): void {
    this.addAuditEntry({
      documentType,
      action: 'viewed',
      version: version || 'latest',
      userId,
    });
  }

  trackDocumentExport(documentType: string, version: string, userId?: string): void {
    this.addAuditEntry({
      documentType,
      action: 'exported',
      version,
      userId,
    });
  }

  getComplianceReport(): {
    documentTypes: string[];
    totalVersions: number;
    latestVersions: Record<string, string>;
    auditSummary: {
      totalEntries: number;
      lastActivity: string;
      actionCounts: Record<string, number>;
    };
  } {
    const documentTypes = Array.from(this.versions.keys());
    const totalVersions = Array.from(this.versions.values())
      .reduce((sum, versions) => sum + versions.length, 0);

    const latestVersions: Record<string, string> = {};
    documentTypes.forEach(type => {
      const latest = this.getLatestVersion(type);
      if (latest) {
        latestVersions[type] = latest.version;
      }
    });

    const actionCounts: Record<string, number> = {};
    this.auditTrail.forEach(entry => {
      actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
    });

    return {
      documentTypes,
      totalVersions,
      latestVersions,
      auditSummary: {
        totalEntries: this.auditTrail.length,
        lastActivity: this.auditTrail.length > 0 
          ? this.auditTrail[this.auditTrail.length - 1].timestamp 
          : 'Never',
        actionCounts,
      },
    };
  }

  exportVersionHistory(documentType?: string): string {
    const data = documentType 
      ? { [documentType]: this.versions.get(documentType) || [] }
      : Object.fromEntries(this.versions);

    return JSON.stringify({
      exportedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      documentVersions: data,
      auditTrail: documentType 
        ? this.auditTrail.filter(entry => entry.documentType === documentType)
        : this.auditTrail,
    }, null, 2);
  }

  clearOldVersions(documentType: string, keepLatest: number = 5): void {
    const versions = this.versions.get(documentType) || [];
    if (versions.length > keepLatest) {
      const toKeep = versions.slice(-keepLatest);
      this.versions.set(documentType, toKeep);
      this.saveVersionsToStorage();

      this.addAuditEntry({
        documentType,
        action: 'updated',
        version: 'cleanup',
        userId: 'system',
      });
    }
  }
}

export const legalDocumentVersioning = new LegalDocumentVersioning();