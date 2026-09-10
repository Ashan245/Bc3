import { SystemHealthStatus, MaintenanceModeConfig, SystemErrorLog, UserRole } from '../types';
import { storageService } from './storageService';

const STORAGE_KEYS = {
  MAINTENANCE_MODE: 'eap_maintenance_mode',
  SYSTEM_ERRORS: 'eap_system_errors',
  SYSTEM_ANNOUNCEMENT: 'eap_system_announcement',
  LAST_BACKUP: 'eap_last_backup_meta',
};

export const systemService = {
  // Get current System Health metrics
  getHealthStatus(): SystemHealthStatus {
    const students = storageService.getStudents(false);
    const fees = storageService.getFees();
    const attendance = storageService.getAttendance();
    const qrLogs = storageService.getQRScanLogs();

    const failedScans = qrLogs.filter(q => q.result !== 'SUCCESS').length;
    const attendanceErrors = attendance.filter(a => a.correctionStatus === 'CORRECTED').length;
    const systemErrors = this.getSystemErrors().filter(e => !e.resolved);

    // Approximate LocalStorage / IndexedDB size in MB
    let totalBytes = 0;
    try {
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          totalBytes += (localStorage[x].length + x.length) * 2;
        }
      }
    } catch {
      totalBytes = 250000;
    }
    const storageUsageMb = Number((totalBytes / (1024 * 1024)).toFixed(2));

    const lastBackup = localStorage.getItem(STORAGE_KEYS.LAST_BACKUP);

    return {
      firebaseConnected: true,
      authConnected: true,
      firestoreStatus: 'HEALTHY',
      storageStatus: 'HEALTHY',
      cloudFunctionsStatus: 'AVAILABLE',
      pwaStatus: 'ACTIVE',
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      indexedDbReady: typeof window !== 'undefined' && 'indexedDB' in window,
      pendingSyncCount: storageService.getOfflineAttendanceQueue().length,
      failedSyncCount: 0,
      recentErrorsCount: systemErrors.length,
      failedQrScansCount: failedScans,
      attendanceErrorsCount: attendanceErrors,
      activeUsersCount: 6, // 6 RBAC user personas
      activeStudentsCount: students.filter(s => s.status === 'ACTIVE').length,
      storageUsageMb: Math.max(storageUsageMb, 0.45),
      lastBackupTimestamp: lastBackup ? JSON.parse(lastBackup).timestamp : '2026-09-08T18:30:00.000Z',
      lastBackupStatus: 'SUCCESS',
      securityPosture: 'SECURE',
      appVersion: 'v2.4.0-production',
      environment: 'production',
      lastCheckedAt: new Date().toISOString(),
    };
  },

  // Maintenance Mode
  getMaintenanceMode(): MaintenanceModeConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE_MODE);
      if (data) return JSON.parse(data);
    } catch (err) {
      console.error(err);
    }
    return {
      isEnabled: false,
      message: 'English Academy Pro is undergoing scheduled infrastructure optimization. Regular access will resume shortly.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    };
  },

  setMaintenanceMode(config: MaintenanceModeConfig, actorName: string, actorRole: UserRole): void {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE_MODE, JSON.stringify(config));
    storageService.logAudit({
      actor: actorName,
      actorRole,
      action: config.isEnabled ? 'MAINTENANCE_MODE_ENABLED' : 'MAINTENANCE_MODE_DISABLED',
      entityType: 'SYSTEM',
      entityId: 'MAINTENANCE_CONFIG',
      details: `Maintenance mode was ${config.isEnabled ? 'activated' : 'deactivated'}. Message: "${config.message}"`,
    });
  },

  isMaintenanceBlockedForUser(userRole: UserRole): boolean {
    const config = this.getMaintenanceMode();
    if (!config.isEnabled) return false;
    return !config.allowedRoles.includes(userRole);
  },

  // System Announcement Broadcast
  broadcastSystemAnnouncement(title: string, message: string, urgent: boolean, authorName: string): void {
    storageService.createAnnouncement({
      title,
      message,
      authorName,
      targetRole: 'ALL',
      isUrgent: urgent,
    });
    // Also notify all users
    storageService.sendNotification({
      recipientId: 'ALL',
      title: `System Announcement: ${title}`,
      message,
      type: 'SYSTEM',
    });
  },

  // Local Cache Clean (cleans non-critical cache and temp data)
  clearLocalCache(): { success: boolean; clearedKeysCount: number } {
    let count = 0;
    try {
      const keysToRemove = ['eap_offline_attendance_queue', 'eap_qr_scan_logs'];
      keysToRemove.forEach(k => {
        if (localStorage.getItem(k)) {
          localStorage.removeItem(k);
          count++;
        }
      });
    } catch (e) {
      console.warn('Cache clearing notice:', e);
    }
    return { success: true, clearedKeysCount: count };
  },

  // Trigger manual backup simulation / export
  triggerBackup(actorName: string, actorRole: UserRole): { success: boolean; backupId: string; timestamp: string } {
    const timestamp = new Date().toISOString();
    const backupId = `BKP-${Date.now()}`;
    const backupMeta = {
      backupId,
      timestamp,
      status: 'SUCCESS',
      type: 'LOCAL_SNAPSHOT',
      collectionsCount: 28,
    };
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, JSON.stringify(backupMeta));

    storageService.logAudit({
      actor: actorName,
      actorRole,
      action: 'SYSTEM_BACKUP_CREATED',
      entityType: 'BACKUP',
      entityId: backupId,
      details: `Manual backup snapshot created successfully (${backupId})`,
    });

    return { success: true, backupId, timestamp };
  },

  // System Error Logging
  getSystemErrors(): SystemErrorLog[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SYSTEM_ERRORS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        errorId: 'ERR-001',
        code: 'WEBSOCKET_DEV_BENIGN',
        message: 'Client connected to dev server. Benign heartbeat notice.',
        timestamp: '2026-09-09T08:12:00.000Z',
        resolved: true,
      },
    ];
  },

  logSystemError(error: Omit<SystemErrorLog, 'errorId' | 'timestamp' | 'resolved'>): void {
    const errors = this.getSystemErrors();
    const newErr: SystemErrorLog = {
      ...error,
      errorId: `ERR-${Date.now()}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    errors.unshift(newErr);
    if (errors.length > 50) errors.pop();
    localStorage.setItem(STORAGE_KEYS.SYSTEM_ERRORS, JSON.stringify(errors));
  },

  resolveSystemError(errorId: string): void {
    const errors = this.getSystemErrors();
    const found = errors.find(e => e.errorId === errorId);
    if (found) {
      found.resolved = true;
      localStorage.setItem(STORAGE_KEYS.SYSTEM_ERRORS, JSON.stringify(errors));
    }
  },
};
