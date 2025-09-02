import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LegalDocumentVersioning, LegalDocumentVersion, LegalDocumentAuditEntry } from '../legal-versioning';
import { LegalDocumentTemplate } from '../legal-templates';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LegalDocumentVersioning', () => {
  let versioning: LegalDocumentVersioning;
  let mockDocument: LegalDocumentTemplate;
  let mockDate: Date;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Mock current date for consistent testing - use UTC
    mockDate = new Date('2025-08-28T10:00:00.000Z');
    vi.setSystemTime(mockDate);

    versioning = new LegalDocumentVersioning();
    
    mockDocument = {
      title: 'Privacy Policy',
      lastUpdated: '2025-08-28',
      content: 'This is a privacy policy content.',
      version: '1.0.0',
    };
  });

  describe('Version Creation', () => {
    it('should create initial version with 1.0.0', () => {
      const version = versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);

      expect(version.version).toBe('1.0.0');
      expect(version.title).toBe('Privacy Policy');
      expect(version.content).toBe('This is a privacy policy content.');
      expect(version.createdBy).toBe('system');
      expect(version.changeLog).toEqual(['Initial version']);
      expect(version.createdAt).toMatch(/2025-08-28 \d{2}:00:00/);
    });

    it('should increment patch version for subsequent versions', () => {
      versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);
      
      const updatedDocument = { ...mockDocument, content: 'Updated privacy policy content.' };
      const version2 = versioning.createVersion('privacyPolicy', updatedDocument, ['Updated content']);

      expect(version2.version).toBe('1.0.1');
      expect(version2.content).toBe('Updated privacy policy content.');
    });

    it('should create version with custom created by', () => {
      const version = versioning.createVersion('privacyPolicy', mockDocument, ['Initial version'], 'admin');

      expect(version.createdBy).toBe('admin');
    });

    it('should store version in localStorage', () => {
      versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);

      const stored = localStorageMock.getItem('legal-document-versions');
      expect(stored).toBeTruthy();
      
      const parsedStored = JSON.parse(stored!);
      expect(parsedStored.privacyPolicy).toBeDefined();
      expect(parsedStored.privacyPolicy).toHaveLength(1);
    });
  });

  describe('Version Updates', () => {
    beforeEach(() => {
      versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);
    });

    it('should create new version when content changes', () => {
      const updatedDocument = { ...mockDocument, content: 'Updated content' };
      const changes = { content: { old: mockDocument.content, new: 'Updated content' } };
      
      const version = versioning.updateVersion(
        'privacyPolicy', 
        updatedDocument, 
        ['Updated privacy content'], 
        'admin',
        changes
      );

      expect(version.version).toBe('1.0.1');
      expect(version.content).toBe('Updated content');
      expect(version.createdBy).toBe('admin');
    });

    it('should throw error when no changes detected', () => {
      expect(() => {
        versioning.updateVersion('privacyPolicy', mockDocument, ['No changes'], 'admin');
      }).toThrow('No changes detected. Version not created.');
    });

    it('should store changes in audit trail', () => {
      const updatedDocument = { ...mockDocument, content: 'Updated content' };
      const changes = { content: { old: mockDocument.content, new: 'Updated content' } };
      
      versioning.updateVersion('privacyPolicy', updatedDocument, ['Updated content'], 'admin', changes);

      const auditTrail = versioning.getAuditTrail({ action: 'updated' });
      expect(auditTrail).toHaveLength(1);
      expect(auditTrail[0].changes).toEqual(changes);
      expect(auditTrail[0].userId).toBe('admin');
    });
  });

  describe('Version Retrieval', () => {
    beforeEach(() => {
      versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);
      const updatedDocument = { ...mockDocument, content: 'Updated content' };
      versioning.createVersion('privacyPolicy', updatedDocument, ['Updated version']);
    });

    it('should get all versions for a document type', () => {
      const versions = versioning.getVersions('privacyPolicy');
      
      expect(versions).toHaveLength(2);
      expect(versions[0].version).toBe('1.0.0');
      expect(versions[1].version).toBe('1.0.1');
    });

    it('should get latest version', () => {
      const latest = versioning.getLatestVersion('privacyPolicy');
      
      expect(latest).toBeTruthy();
      expect(latest!.version).toBe('1.0.1');
      expect(latest!.content).toBe('Updated content');
    });

    it('should get specific version', () => {
      const version = versioning.getVersion('privacyPolicy', '1.0.0');
      
      expect(version).toBeTruthy();
      expect(version!.version).toBe('1.0.0');
      expect(version!.content).toBe('This is a privacy policy content.');
    });

    it('should return null for non-existent version', () => {
      const version = versioning.getVersion('privacyPolicy', '2.0.0');
      expect(version).toBeNull();
    });

    it('should return empty array for non-existent document type', () => {
      const versions = versioning.getVersions('nonexistent');
      expect(versions).toEqual([]);
    });
  });

  describe('Audit Trail', () => {
    it('should track document creation', () => {
      versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);

      const auditTrail = versioning.getAuditTrail();
      expect(auditTrail).toHaveLength(1);
      expect(auditTrail[0].action).toBe('created');
      expect(auditTrail[0].documentType).toBe('privacyPolicy');
      expect(auditTrail[0].version).toBe('1.0.0');
    });

    it('should track document views', () => {
      versioning.trackDocumentView('privacyPolicy', '1.0.0', 'user123');

      const auditTrail = versioning.getAuditTrail();
      expect(auditTrail).toHaveLength(1);
      expect(auditTrail[0].action).toBe('viewed');
      expect(auditTrail[0].documentType).toBe('privacyPolicy');
      expect(auditTrail[0].version).toBe('1.0.0');
      expect(auditTrail[0].userId).toBe('user123');
    });

    it('should track document exports', () => {
      versioning.trackDocumentExport('privacyPolicy', '1.0.0', 'user123');

      const auditTrail = versioning.getAuditTrail();
      expect(auditTrail).toHaveLength(1);
      expect(auditTrail[0].action).toBe('exported');
      expect(auditTrail[0].documentType).toBe('privacyPolicy');
      expect(auditTrail[0].version).toBe('1.0.0');
      expect(auditTrail[0].userId).toBe('user123');
    });

    it('should filter audit trail by document type', () => {
      versioning.trackDocumentView('privacyPolicy', '1.0.0', 'user123');
      versioning.trackDocumentView('termsOfService', '1.0.0', 'user123');

      const filtered = versioning.getAuditTrail({ documentType: 'privacyPolicy' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].documentType).toBe('privacyPolicy');
    });

    it('should filter audit trail by action', () => {
      versioning.trackDocumentView('privacyPolicy', '1.0.0', 'user123');
      versioning.trackDocumentExport('privacyPolicy', '1.0.0', 'user123');

      const filtered = versioning.getAuditTrail({ action: 'viewed' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].action).toBe('viewed');
    });

    it('should filter audit trail by user ID', () => {
      versioning.trackDocumentView('privacyPolicy', '1.0.0', 'user123');
      versioning.trackDocumentView('privacyPolicy', '1.0.0', 'user456');

      const filtered = versioning.getAuditTrail({ userId: 'user123' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].userId).toBe('user123');
    });

    it('should generate audit entry with proper metadata', () => {
      versioning.addAuditEntry({
        documentType: 'privacyPolicy',
        action: 'viewed',
        version: '1.0.0',
        userId: 'user123',
      });

      const auditTrail = versioning.getAuditTrail();
      const entry = auditTrail[0];

      expect(entry.id).toMatch(/^audit_\d+_[a-z0-9]{9}$/);
      expect(entry.timestamp).toMatch(/2025-08-28 \d{2}:00:00/);
      expect(entry.userAgent).toBeDefined();
      expect(entry.ipAddress).toBe('Unknown');
    });
  });

  describe('Compliance Reporting', () => {
    beforeEach(() => {
      versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);
      versioning.createVersion('termsOfService', mockDocument, ['Initial version']);
      versioning.trackDocumentView('privacyPolicy', '1.0.0', 'user123');
      versioning.trackDocumentExport('privacyPolicy', '1.0.0', 'user123');
    });

    it('should generate compliance report', () => {
      const report = versioning.getComplianceReport();

      expect(report.documentTypes).toEqual(['privacyPolicy', 'termsOfService']);
      expect(report.totalVersions).toBe(2);
      expect(report.latestVersions).toEqual({
        privacyPolicy: '1.0.0',
        termsOfService: '1.0.0',
      });
      expect(report.auditSummary.totalEntries).toBe(4); // 2 creates + 1 view + 1 export
      expect(report.auditSummary.actionCounts).toEqual({
        created: 2,
        viewed: 1,
        exported: 1,
      });
    });
  });

  describe('Version History Export', () => {
    beforeEach(() => {
      versioning.createVersion('privacyPolicy', mockDocument, ['Initial version']);
      versioning.createVersion('termsOfService', mockDocument, ['Initial version']);
      versioning.trackDocumentView('privacyPolicy', '1.0.0', 'user123');
    });

    it('should export all version history', () => {
      const exported = versioning.exportVersionHistory();
      const parsed = JSON.parse(exported);

      expect(parsed.exportedAt).toMatch(/2025-08-28 \d{2}:00:00/);
      expect(parsed.documentVersions.privacyPolicy).toHaveLength(1);
      expect(parsed.documentVersions.termsOfService).toHaveLength(1);
      expect(parsed.auditTrail).toHaveLength(3); // 2 creates + 1 view
    });

    it('should export specific document type history', () => {
      const exported = versioning.exportVersionHistory('privacyPolicy');
      const parsed = JSON.parse(exported);

      expect(parsed.documentVersions.privacyPolicy).toHaveLength(1);
      expect(parsed.documentVersions.termsOfService).toBeUndefined();
      expect(parsed.auditTrail).toHaveLength(2); // 1 create + 1 view for privacyPolicy only
    });
  });

  describe('Version Cleanup', () => {
    beforeEach(() => {
      // Create multiple versions
      for (let i = 0; i < 10; i++) {
        const doc = { ...mockDocument, content: `Content version ${i}` };
        versioning.createVersion('privacyPolicy', doc, [`Version ${i}`]);
      }
    });

    it('should keep only specified number of latest versions', () => {
      versioning.clearOldVersions('privacyPolicy', 3);

      const versions = versioning.getVersions('privacyPolicy');
      expect(versions).toHaveLength(3);
      expect(versions[0].version).toBe('1.0.7'); // Latest 3: 1.0.7, 1.0.8, 1.0.9
      expect(versions[2].version).toBe('1.0.9');
    });

    it('should not modify versions if count is within limit', () => {
      versioning.clearOldVersions('privacyPolicy', 15);

      const versions = versioning.getVersions('privacyPolicy');
      expect(versions).toHaveLength(10); // All versions should remain
    });

    it('should add audit entry for cleanup', () => {
      versioning.clearOldVersions('privacyPolicy', 3);

      const auditTrail = versioning.getAuditTrail({ userId: 'system', action: 'updated' });
      expect(auditTrail).toHaveLength(1);
      expect(auditTrail[0].action).toBe('updated');
      expect(auditTrail[0].userId).toBe('system');
    });
  });

  describe('Storage Persistence', () => {
    it('should persist versions across instances', () => {
      const versioning1 = new LegalDocumentVersioning();
      versioning1.createVersion('privacyPolicy', mockDocument, ['Initial version']);

      // Create new instance (simulating page reload)
      const versioning2 = new LegalDocumentVersioning();
      const versions = versioning2.getVersions('privacyPolicy');

      expect(versions).toHaveLength(1);
      expect(versions[0].version).toBe('1.0.0');
    });

    it('should persist audit trail across instances', () => {
      const versioning1 = new LegalDocumentVersioning();
      versioning1.trackDocumentView('privacyPolicy', '1.0.0', 'user123');

      // Create new instance (simulating page reload)
      const versioning2 = new LegalDocumentVersioning();
      const auditTrail = versioning2.getAuditTrail();

      expect(auditTrail).toHaveLength(1);
      expect(auditTrail[0].action).toBe('viewed');
    });

    it('should handle corrupted storage gracefully', () => {
      localStorageMock.setItem('legal-document-versions', 'invalid json');
      localStorageMock.setItem('legal-document-audit', 'invalid json');

      // Should not throw error
      expect(() => new LegalDocumentVersioning()).not.toThrow();
    });
  });
});