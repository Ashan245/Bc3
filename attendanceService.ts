import { storageService } from './storageService';
import {
  AttendanceRecord,
  AttendanceStatus,
  ClassSession,
  QRScanResult,
  Student,
  UserRole,
  CalculatedStudentFeeStatus,
} from '../types';

export interface AttendanceValidationParams {
  scannedPayload?: string; // QR payload: e.g. "academy://student/eap_sec_..." or publicQrId
  manualStudentId?: string;
  sessionId: string;
  scannerUserId: string;
  scannerRole: UserRole;
  scannerName: string;
  deviceId?: string;
  isOffline?: boolean;
}

export interface AttendanceValidationResult {
  success: boolean;
  resultCode: QRScanResult;
  status?: AttendanceStatus;
  student?: Student;
  session?: ClassSession;
  record?: AttendanceRecord;
  alreadyRecorded?: AttendanceRecord;
  message: string;
  feeNotice?: string;
  feeStatus?: CalculatedStudentFeeStatus;
}

export const attendanceService = {
  /**
   * Universal attendance validator used for BOTH QR code scans and Manual search fallback.
   */
  processAttendance(params: AttendanceValidationParams): AttendanceValidationResult {
    const {
      scannedPayload,
      manualStudentId,
      sessionId,
      scannerUserId,
      scannerRole,
      scannerName,
      deviceId = 'web-scanner',
      isOffline = false,
    } = params;

    // 1. Check Scanner User Authorization
    const authorizedRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STAFF'];
    if (!authorizedRoles.includes(scannerRole)) {
      this.logScan({
        scannerUserId,
        scannerRole,
        sessionId,
        result: 'UNAUTHORIZED',
        failureReason: 'User role lacks permission to mark attendance',
        deviceId,
      });
      return {
        success: false,
        resultCode: 'UNAUTHORIZED',
        message: 'Unauthorized: Only teachers, staff, and administrators may record attendance.',
      };
    }

    // 2. Check Session Existence and Status
    const session = storageService.getSessionById(sessionId);
    if (!session) {
      this.logScan({
        scannerUserId,
        scannerRole,
        sessionId,
        result: 'SESSION_CLOSED',
        failureReason: 'Session not found',
        deviceId,
      });
      return {
        success: false,
        resultCode: 'SESSION_CLOSED',
        message: 'Class session not found.',
      };
    }

    if (session.status === 'CLOSED' || session.status === 'CANCELLED') {
      this.logScan({
        scannerUserId,
        scannerRole,
        sessionId,
        result: 'SESSION_CLOSED',
        failureReason: `Session is ${session.status}`,
        deviceId,
      });
      return {
        success: false,
        resultCode: 'SESSION_CLOSED',
        message: `This class session is currently ${session.status.toLowerCase()}. Attendance cannot be recorded.`,
      };
    }

    // 3. Resolve Student and QR Code
    let student: Student | undefined;
    let qrCodeId: string | undefined;
    const isQR = Boolean(scannedPayload);

    if (isQR && scannedPayload) {
      // Clean payload: allow raw publicQrId, academy://student/{id}, or url
      let publicQrId = scannedPayload.trim();
      if (publicQrId.includes('academy://student/')) {
        publicQrId = publicQrId.replace('academy://student/', '');
      } else if (publicQrId.includes('/qr/student/')) {
        publicQrId = publicQrId.split('/qr/student/').pop() || publicQrId;
      }

      const qrRecord = storageService.getQRByPublicId(publicQrId);
      if (!qrRecord) {
        this.logScan({
          scannerUserId,
          scannerRole,
          sessionId,
          result: 'INVALID',
          failureReason: 'QR token not recognized in system',
          deviceId,
        });
        return {
          success: false,
          resultCode: 'INVALID',
          message: 'Invalid or unrecognized QR code identifier.',
        };
      }

      qrCodeId = qrRecord.qrCodeId;

      if (qrRecord.status === 'REVOKED') {
        this.logScan({
          qrCodeId: qrRecord.qrCodeId,
          studentId: qrRecord.studentId,
          scannerUserId,
          scannerRole,
          sessionId,
          result: 'REVOKED',
          failureReason: `QR is revoked: ${qrRecord.revocationReason || 'Replaced'}`,
          deviceId,
        });
        return {
          success: false,
          resultCode: 'REVOKED',
          message: 'This QR code has been revoked and is no longer valid. Please request a new QR card.',
        };
      }

      if (qrRecord.status === 'EXPIRED') {
        this.logScan({
          qrCodeId: qrRecord.qrCodeId,
          studentId: qrRecord.studentId,
          scannerUserId,
          scannerRole,
          sessionId,
          result: 'EXPIRED',
          failureReason: 'QR token expired',
          deviceId,
        });
        return {
          success: false,
          resultCode: 'EXPIRED',
          message: 'This QR code has expired.',
        };
      }

      student = storageService.getStudentById(qrRecord.studentId);
    } else if (manualStudentId) {
      student = storageService.getStudentById(manualStudentId);
    }

    if (!student) {
      this.logScan({
        scannerUserId,
        scannerRole,
        sessionId,
        result: 'INVALID',
        failureReason: 'Student not found',
        deviceId,
      });
      return {
        success: false,
        resultCode: 'INVALID',
        message: 'Student record could not be found.',
      };
    }

    // 4. Verify Student Status
    if (student.status !== 'ACTIVE') {
      this.logScan({
        studentId: student.studentId,
        scannerUserId,
        scannerRole,
        sessionId,
        result: 'UNAUTHORIZED',
        failureReason: `Student status is ${student.status}`,
        deviceId,
      });
      return {
        success: false,
        resultCode: 'UNAUTHORIZED',
        message: `Student account is ${student.status.toLowerCase()}. Cannot mark attendance.`,
      };
    }

    // 5. Class Authorization Check (Requirement 27: WRONG CLASS)
    if (student.classId !== session.classId) {
      this.logScan({
        qrCodeId,
        studentId: student.studentId,
        scannerUserId,
        scannerRole,
        classId: session.classId,
        sessionId,
        result: 'WRONG_CLASS',
        failureReason: `Student is enrolled in ${student.classId}, but session is for ${session.classId}`,
        deviceId,
      });
      return {
        success: false,
        resultCode: 'WRONG_CLASS',
        student: {
          ...student,
        },
        session,
        message: 'This student is not assigned to this class.',
      };
    }

    // Real-time fee status from actual transactions
    const feeStatus = storageService.calculateStudentFeeStatus(student.studentId);
    let feeNotice: string | undefined;
    if (feeStatus.isOverdue || feeStatus.paymentStatus === 'OVERDUE') {
      feeNotice = `Outstanding fee: LKR ${feeStatus.outstandingBalance.toLocaleString()}`;
    } else if (feeStatus.paymentStatus === 'UNPAID' || feeStatus.paymentStatus === 'PARTIAL') {
      feeNotice = `Outstanding fee: LKR ${feeStatus.outstandingBalance.toLocaleString()}`;
    }

    // 6. Check Duplicate Attendance (studentId + sessionId)
    const existing = storageService.getAttendance().find(
      a => a.studentId === student!.studentId && a.sessionId === sessionId
    );

    if (existing) {
      this.logScan({
        qrCodeId,
        studentId: student.studentId,
        scannerUserId,
        scannerRole,
        classId: session.classId,
        sessionId,
        result: 'DUPLICATE',
        failureReason: `Already recorded at ${existing.markedAt}`,
        deviceId,
      });
      return {
        success: false,
        resultCode: 'DUPLICATE',
        student,
        session,
        alreadyRecorded: existing,
        feeStatus,
        feeNotice,
        message: `Attendance already recorded for ${student.fullName} (${existing.status}) at ${new Date(existing.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by ${existing.markedByName}.`,
      };
    }

    // 7. Calculate Attendance Status (PRESENT vs LATE based on configurable window)
    const settings = storageService.getSettings();
    const attendanceStatus = this.calculateAttendanceStatus(session, settings);

    // 8. Record Attendance
    const recordResult = storageService.recordAttendance({
      studentId: student.studentId,
      studentName: student.fullName,
      classId: session.classId,
      className: session.className,
      sessionId: session.sessionId,
      date: session.date,
      status: attendanceStatus,
      attendanceMethod: isQR ? 'QR' : 'MANUAL_SEARCH',
      scannedQrCodeId: qrCodeId,
      markedBy: scannerUserId,
      markedByName: scannerName,
      markedByRole: scannerRole,
      markedAt: new Date().toISOString(),
      deviceId,
      isOffline,
      offlineRecordId: isOffline ? `OFF-${Date.now()}-${student.studentId}` : undefined,
    });

    if (!recordResult.success) {
      return {
        success: false,
        resultCode: 'DUPLICATE',
        student,
        session,
        alreadyRecorded: recordResult.alreadyRecorded,
        feeStatus,
        feeNotice,
        message: recordResult.message || 'Duplicate attendance prevented.',
      };
    }

    // 10. Log Success
    this.logScan({
      qrCodeId,
      studentId: student.studentId,
      scannerUserId,
      scannerRole,
      classId: session.classId,
      sessionId,
      result: 'SUCCESS',
      deviceId,
    });

    return {
      success: true,
      resultCode: 'SUCCESS',
      status: attendanceStatus,
      student,
      session,
      record: recordResult.record,
      feeStatus,
      message: `Attendance recorded: ${student.fullName} marked as ${attendanceStatus}.`,
      feeNotice,
    };
  },

  calculateAttendanceStatus(
    session: ClassSession,
    settings: { lateAfterMinutes: number }
  ): AttendanceStatus {
    const now = new Date();
    const [startHour, startMin] = session.startTime.split(':').map(Number);
    const sessionStart = new Date(now);
    sessionStart.setHours(startHour || 9, startMin || 0, 0, 0);

    const lateThreshold = new Date(sessionStart.getTime() + (settings.lateAfterMinutes || 15) * 60 * 1000);

    if (now > lateThreshold) {
      return 'LATE';
    }
    return 'PRESENT';
  },

  logScan(log: {
    qrCodeId?: string;
    studentId?: string;
    scannerUserId: string;
    scannerRole: string;
    classId?: string;
    sessionId?: string;
    result: QRScanResult;
    failureReason?: string;
    deviceId?: string;
  }) {
    storageService.logQRScan({
      ...log,
      scannedAt: new Date().toISOString(),
    });
  },
};
