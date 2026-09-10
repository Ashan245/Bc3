import {
  Student,
  QRCodeRecord,
  QRReplacementRequest,
  AcademyClass,
  Teacher,
  ClassSession,
  AttendanceRecord,
  AttendanceStatus,
  QRScanLog,
  Fee,
  Payment,
  Receipt,
  Expense,
  Lesson,
  StudentLessonProgress,
  Homework,
  HomeworkSubmission,
  Quiz,
  QuizAttempt,
  ExamResult,
  VocabularyWord,
  Announcement,
  InAppNotification,
  ProfileChangeRequest,
  AdmissionApplication,
  AuditLog,
  AcademySettings,
  UserRole,
  LMSMaterial,
  CalculatedStudentFeeStatus,
  FeeStatus,
  StudentDocument,
  WaitingListEntry,
  ClassTransferRecord,
  StudentPromotionBatch,
  ExcusedAbsenceRecord,
} from '../types';
import {
  defaultSettings,
  sampleStudents,
  sampleQRCodes,
  sampleClasses,
  sampleTeachers,
  sampleClassSessions,
  sampleFees,
  samplePayments,
  sampleReceipts,
  sampleExpenses,
  sampleLessons,
  sampleQuizzes,
  sampleVocabulary,
  sampleExamResults,
  sampleAnnouncements,
} from './seedService';

const STORAGE_KEYS = {
  SETTINGS: 'eap_settings',
  STUDENTS: 'eap_students',
  QR_CODES: 'eap_qr_codes',
  QR_REQUESTS: 'eap_qr_requests',
  CLASSES: 'eap_classes',
  TEACHERS: 'eap_teachers',
  SESSIONS: 'eap_sessions',
  ATTENDANCE: 'eap_attendance',
  OFFLINE_ATTENDANCE_QUEUE: 'eap_offline_attendance_queue',
  QR_SCAN_LOGS: 'eap_qr_scan_logs',
  FEES: 'eap_fees',
  PAYMENTS: 'eap_payments',
  RECEIPTS: 'eap_receipts',
  EXPENSES: 'eap_expenses',
  LESSONS: 'eap_lessons',
  LESSON_PROGRESS: 'eap_lesson_progress',
  HOMEWORK: 'eap_homework',
  SUBMISSIONS: 'eap_submissions',
  QUIZZES: 'eap_quizzes',
  QUIZ_ATTEMPTS: 'eap_quiz_attempts',
  EXAM_RESULTS: 'eap_exam_results',
  VOCABULARY: 'eap_vocabulary',
  ANNOUNCEMENTS: 'eap_announcements',
  NOTIFICATIONS: 'eap_notifications',
  PROFILE_REQUESTS: 'eap_profile_requests',
  ADMISSIONS: 'eap_admissions',
  AUDIT_LOGS: 'eap_audit_logs',
  LMS_MATERIALS: 'eap_lms_materials',
  STUDENT_DOCUMENTS: 'eap_student_documents',
  WAITING_LIST: 'eap_waiting_list',
  CLASS_TRANSFERS: 'eap_class_transfers',
  PROMOTIONS: 'eap_promotions',
  EXCUSED_ABSENCES: 'eap_excused_absences',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data);
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Initialize seed data if not present
export function initializeStorageIfNeeded(): void {
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, defaultSettings);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    setItem(STORAGE_KEYS.STUDENTS, sampleStudents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QR_CODES)) {
    setItem(STORAGE_KEYS.QR_CODES, sampleQRCodes);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    setItem(STORAGE_KEYS.CLASSES, sampleClasses);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    setItem(STORAGE_KEYS.TEACHERS, sampleTeachers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    setItem(STORAGE_KEYS.SESSIONS, sampleClassSessions);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEES)) {
    setItem(STORAGE_KEYS.FEES, sampleFees);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    setItem(STORAGE_KEYS.PAYMENTS, samplePayments);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECEIPTS)) {
    setItem(STORAGE_KEYS.RECEIPTS, sampleReceipts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
    setItem(STORAGE_KEYS.EXPENSES, sampleExpenses);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LESSONS)) {
    setItem(STORAGE_KEYS.LESSONS, sampleLessons);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    setItem(STORAGE_KEYS.QUIZZES, sampleQuizzes);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOCABULARY)) {
    setItem(STORAGE_KEYS.VOCABULARY, sampleVocabulary);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS)) {
    setItem(STORAGE_KEYS.EXAM_RESULTS, sampleExamResults);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, sampleAnnouncements);
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOMEWORK)) {
    setItem(STORAGE_KEYS.HOMEWORK, [
      {
        homeworkId: 'HW-G08-01',
        classId: 'CLS-G08-SAT',
        grade: 'Grade 8',
        title: 'Conditional Clauses Essay: "If I Could Change One Rule in the World"',
        description: 'Write a 250-word essay applying at least 4 First Conditionals and 3 Second Conditionals. Highlight conditional clauses in bold.',
        dueDate: '2026-09-18',
        maxMarks: 20,
        createdBy: 'Mr. David Perera',
        createdAt: '2026-09-08T09:00:00.000Z',
      },
      {
        homeworkId: 'HW-G10-02',
        classId: 'CLS-G10-SUN',
        grade: 'Grade 10',
        title: 'Formal Newspaper Report: Environmental Clean-up Day',
        description: 'Transform active voice interview notes into formal passive voice news paragraphs suitable for a national newspaper print.',
        dueDate: '2026-09-20',
        maxMarks: 25,
        createdBy: 'Ms. Sarah Jenkins',
        createdAt: '2026-09-09T08:00:00.000Z',
      },
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    setItem(STORAGE_KEYS.SUBMISSIONS, [
      {
        submissionId: 'SUB-001',
        homeworkId: 'HW-G08-01',
        studentId: 'STU-000001',
        studentName: 'Kasun Lakshan Perera',
        submittedAt: '2026-09-09T10:00:00.000Z',
        content: 'If I could change one rule in the world, I would make high quality secondary education and English mastery accessible to every student without tuition barriers...',
        marksObtained: 18,
        feedback: 'Superb conditional sentence structure! Very strong vocabulary and coherent argument flow.',
        gradedBy: 'Mr. David Perera',
        status: 'GRADED',
      },
    ]);
  }
}

// Initialize immediately on import
initializeStorageIfNeeded();

export const storageService = {
  // SETTINGS
  getSettings(): AcademySettings {
    return getItem<AcademySettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },
  saveSettings(settings: AcademySettings, actor: string = 'Admin'): void {
    setItem(STORAGE_KEYS.SETTINGS, settings);
    this.logAudit({
      actor,
      actorRole: 'ADMIN',
      action: 'SETTINGS_UPDATED',
      entityType: 'SETTINGS',
      entityId: 'global',
      details: `Updated settings for ${settings.academyName}`,
    });
  },

  // STUDENTS
  getStudents(includeArchived: boolean = false): Student[] {
    const list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    if (includeArchived) return list;
    return list.filter(s => s.status !== 'ARCHIVED');
  },
  getArchivedStudents(): Student[] {
    const list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    return list.filter(s => s.status === 'ARCHIVED');
  },
  getStudentById(studentId: string): Student | undefined {
    const list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    return list.find(s => s.studentId === studentId);
  },
  saveStudent(student: Student, actor: string = 'Admin'): Student {
    const list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    const idx = list.findIndex(s => s.studentId === student.studentId);
    let updated: Student;

    if (idx >= 0) {
      updated = { ...list[idx], ...student, updatedAt: new Date().toISOString() };
      list[idx] = updated;
      this.logAudit({
        actor,
        actorRole: 'ADMIN',
        action: 'STUDENT_UPDATED',
        entityType: 'STUDENT',
        entityId: student.studentId,
        details: `Updated student ${student.fullName}`,
      });
    } else {
      updated = {
        ...student,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(updated);
      // Automatically generate QR record for new student
      this.generateNewQRForStudent(student.studentId, actor);
      this.logAudit({
        actor,
        actorRole: 'ADMIN',
        action: 'STUDENT_CREATED',
        entityType: 'STUDENT',
        entityId: student.studentId,
        details: `Created new student ${student.fullName}`,
      });
    }

    setItem(STORAGE_KEYS.STUDENTS, list);
    return updated;
  },
  archiveStudent(studentId: string, reason: string, actor: string = 'Staff'): boolean {
    const list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    const idx = list.findIndex(s => s.studentId === studentId);
    if (idx === -1) return false;

    list[idx].status = 'ARCHIVED';
    list[idx].archiveReason = reason;
    list[idx].updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.STUDENTS, list);

    // Revoke QR code
    const activeQR = this.getActiveQRForStudent(studentId);
    if (activeQR) {
      this.revokeQR(activeQR.qrCodeId, `Student archived: ${reason}`, actor);
    }

    this.logAudit({
      actor,
      actorRole: 'ADMIN',
      action: 'STUDENT_ARCHIVED',
      entityType: 'STUDENT',
      entityId: studentId,
      details: `Archived student ${studentId}. Reason: ${reason}`,
    });
    return true;
  },
  restoreStudent(studentId: string, actor: string = 'Admin'): boolean {
    const list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    const idx = list.findIndex(s => s.studentId === studentId);
    if (idx === -1) return false;

    list[idx].status = 'ACTIVE';
    list[idx].archiveReason = undefined;
    list[idx].updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.STUDENTS, list);

    // Re-issue QR
    this.generateNewQRForStudent(studentId, actor);

    this.logAudit({
      actor,
      actorRole: 'ADMIN',
      action: 'STUDENT_RESTORED',
      entityType: 'STUDENT',
      entityId: studentId,
      details: `Restored student ${studentId} from recycle bin.`,
    });
    return true;
  },
  deleteStudentPermanently(studentId: string, reason: string, actor: string = 'Super Admin'): boolean {
    let list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    const existing = list.find(s => s.studentId === studentId);
    if (!existing) return false;

    list = list.filter(s => s.studentId !== studentId);
    setItem(STORAGE_KEYS.STUDENTS, list);

    this.logAudit({
      actor,
      actorRole: 'SUPER_ADMIN',
      action: 'STUDENT_PERMANENTLY_DELETED',
      entityType: 'STUDENT',
      entityId: studentId,
      details: `Permanently deleted student ${studentId} (${existing.fullName}). Reason: ${reason}`,
    });
    return true;
  },
  generateNextStudentId(): string {
    const list = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    let max = 0;
    list.forEach(s => {
      const num = parseInt(s.studentId.replace('STU-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    });
    return `STU-${String(max + 1).padStart(6, '0')}`;
  },

  // QR SYSTEM
  getQRCodes(): QRCodeRecord[] {
    return getItem<QRCodeRecord[]>(STORAGE_KEYS.QR_CODES, []);
  },
  getActiveQRForStudent(studentId: string): QRCodeRecord | undefined {
    const list = this.getQRCodes();
    return list.find(q => q.studentId === studentId && q.status === 'ACTIVE');
  },
  getQRByPublicId(publicQrId: string): QRCodeRecord | undefined {
    const list = this.getQRCodes();
    return list.find(q => q.publicQrId === publicQrId);
  },
  generateNewQRForStudent(studentId: string, actor: string = 'Admin'): QRCodeRecord {
    const list = this.getQRCodes();
    // Revoke any existing active QR
    list.forEach(q => {
      if (q.studentId === studentId && q.status === 'ACTIVE') {
        q.status = 'REVOKED';
        q.revokedAt = new Date().toISOString();
        q.revokedBy = actor;
        q.revocationReason = 'Regenerated new QR identifier token';
      }
    });

    const randomSuffix = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const publicQrId = `eap_sec_${randomSuffix}`;
    const newQR: QRCodeRecord = {
      qrCodeId: `QR-${studentId}-${Date.now()}`,
      studentId,
      publicQrId,
      status: 'ACTIVE',
      version: 1,
      createdAt: new Date().toISOString(),
      createdBy: actor,
      issuedAt: new Date().toISOString(),
      scanCount: 0,
    };

    list.unshift(newQR);
    setItem(STORAGE_KEYS.QR_CODES, list);

    this.logAudit({
      actor,
      actorRole: 'ADMIN',
      action: 'QR_GENERATED',
      entityType: 'QR_CODE',
      entityId: newQR.qrCodeId,
      details: `Generated new attendance QR identifier for ${studentId}`,
    });

    return newQR;
  },
  revokeQR(qrCodeId: string, reason: string, actor: string = 'Admin'): boolean {
    const list = this.getQRCodes();
    const qr = list.find(q => q.qrCodeId === qrCodeId);
    if (!qr) return false;

    qr.status = 'REVOKED';
    qr.revokedAt = new Date().toISOString();
    qr.revokedBy = actor;
    qr.revocationReason = reason;
    setItem(STORAGE_KEYS.QR_CODES, list);

    this.logAudit({
      actor,
      actorRole: 'ADMIN',
      action: 'QR_REVOKED',
      entityType: 'QR_CODE',
      entityId: qrCodeId,
      details: `Revoked QR for student ${qr.studentId}. Reason: ${reason}`,
    });
    return true;
  },
  getQRReplacementRequests(): QRReplacementRequest[] {
    return getItem<QRReplacementRequest[]>(STORAGE_KEYS.QR_REQUESTS, []);
  },
  submitQRReplacementRequest(studentId: string, reason: string): QRReplacementRequest {
    const list = this.getQRReplacementRequests();
    const student = this.getStudentById(studentId);
    const req: QRReplacementRequest = {
      requestId: `REQ-QR-${Date.now()}`,
      studentId,
      studentName: student?.fullName || studentId,
      requestedBy: student?.fullName || 'Student',
      reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    list.unshift(req);
    setItem(STORAGE_KEYS.QR_REQUESTS, list);
    return req;
  },
  reviewQRReplacementRequest(requestId: string, approve: boolean, reviewer: string = 'Admin'): boolean {
    const list = this.getQRReplacementRequests();
    const req = list.find(r => r.requestId === requestId);
    if (!req) return false;

    req.status = approve ? 'APPROVED' : 'REJECTED';
    req.reviewedBy = reviewer;
    req.reviewedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.QR_REQUESTS, list);

    if (approve) {
      this.generateNewQRForStudent(req.studentId, reviewer);
    }
    return true;
  },

  // SESSIONS
  getClassSessions(): ClassSession[] {
    return getItem<ClassSession[]>(STORAGE_KEYS.SESSIONS, []);
  },
  getSessionById(sessionId: string): ClassSession | undefined {
    return this.getClassSessions().find(s => s.sessionId === sessionId);
  },
  saveClassSession(session: ClassSession): ClassSession {
    const list = this.getClassSessions();
    const idx = list.findIndex(s => s.sessionId === session.sessionId);
    if (idx >= 0) {
      list[idx] = session;
    } else {
      list.push(session);
    }
    setItem(STORAGE_KEYS.SESSIONS, list);
    return session;
  },
  closeSessionAndMarkAbsents(
    sessionId: string,
    actorId: string = 'SYS',
    actorName: string = 'System',
    actorRole: string = 'STAFF'
  ): { session: ClassSession; markedAbsentCount: number } {
    const session = this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    const attendanceList = this.getAttendance();
    const classStudents = this.getStudents(false).filter(
      s => s.classId === session.classId && s.status === 'ACTIVE'
    );

    let markedAbsentCount = 0;
    const nowStr = new Date().toISOString();

    classStudents.forEach(student => {
      const existing = attendanceList.find(
        a => a.studentId === student.studentId && a.sessionId === sessionId
      );
      if (!existing) {
        const newAbsentRecord: AttendanceRecord = {
          attendanceId: `ATT-${sessionId}-${student.studentId}`,
          studentId: student.studentId,
          studentName: student.fullName,
          classId: session.classId,
          className: session.className,
          sessionId: session.sessionId,
          date: session.date,
          status: 'ABSENT',
          attendanceMethod: 'MANUAL_SEARCH',
          markedBy: actorId,
          markedByName: actorName,
          markedByRole: actorRole,
          markedAt: nowStr,
          createdAt: nowStr,
        };
        attendanceList.unshift(newAbsentRecord);
        markedAbsentCount++;
      }
    });

    setItem(STORAGE_KEYS.ATTENDANCE, attendanceList);

    session.status = 'CLOSED';
    const allSessions = this.getClassSessions();
    const idx = allSessions.findIndex(s => s.sessionId === sessionId);
    if (idx >= 0) {
      allSessions[idx] = session;
      setItem(STORAGE_KEYS.SESSIONS, allSessions);
    }

    this.logAudit({
      actor: actorName,
      actorRole: 'STAFF',
      action: 'SESSION_CLOSED',
      entityType: 'SESSION',
      entityId: sessionId,
      details: `Session ${session.className} (${session.date}) closed. ${markedAbsentCount} unmarked student(s) marked ABSENT.`,
    });

    return { session, markedAbsentCount };
  },

  // ATTENDANCE
  getAttendance(): AttendanceRecord[] {
    return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
  },
  getOfflineAttendanceQueue(): AttendanceRecord[] {
    return getItem<AttendanceRecord[]>(STORAGE_KEYS.OFFLINE_ATTENDANCE_QUEUE, []);
  },
  getAttendanceForStudent(studentId: string): AttendanceRecord[] {
    return this.getAttendance().filter(a => a.studentId === studentId);
  },
  recordAttendance(record: Omit<AttendanceRecord, 'attendanceId' | 'createdAt'>): {
    success: boolean;
    record?: AttendanceRecord;
    alreadyRecorded?: AttendanceRecord;
    message?: string;
  } {
    const list = this.getAttendance();

    // CRITICAL: Duplicate Attendance Protection by studentId + sessionId
    const duplicate = list.find(
      a => a.studentId === record.studentId && a.sessionId === record.sessionId
    );

    if (duplicate) {
      return {
        success: false,
        alreadyRecorded: duplicate,
        message: 'Attendance already recorded for this student in this session.',
      };
    }

    const newRecord: AttendanceRecord = {
      ...record,
      attendanceId: `ATT-${record.studentId}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (record.isOffline) {
      const queue = this.getOfflineAttendanceQueue();
      queue.push(newRecord);
      setItem(STORAGE_KEYS.OFFLINE_ATTENDANCE_QUEUE, queue);
    }

    list.unshift(newRecord);
    setItem(STORAGE_KEYS.ATTENDANCE, list);

    // Update QR scan count if scanned
    if (record.scannedQrCodeId) {
      const qrs = this.getQRCodes();
      const qr = qrs.find(q => q.qrCodeId === record.scannedQrCodeId);
      if (qr) {
        qr.scanCount = (qr.scanCount || 0) + 1;
        qr.lastScannedAt = new Date().toISOString();
        setItem(STORAGE_KEYS.QR_CODES, qrs);
      }
    }

    return {
      success: true,
      record: newRecord,
    };
  },
  syncOfflineAttendance(): number {
    const queue = this.getOfflineAttendanceQueue();
    if (queue.length === 0) return 0;

    const mainList = this.getAttendance();
    let synced = 0;

    queue.forEach(item => {
      const existing = mainList.find(a => a.attendanceId === item.attendanceId);
      if (existing) {
        existing.isOffline = false;
        existing.syncedAt = new Date().toISOString();
        synced++;
      }
    });

    setItem(STORAGE_KEYS.ATTENDANCE, mainList);
    setItem(STORAGE_KEYS.OFFLINE_ATTENDANCE_QUEUE, []);
    return synced;
  },
  updateAttendanceStatus(attendanceId: string, status: AttendanceStatus, updatedBy: string = 'Staff'): boolean {
    const list = this.getAttendance();
    const item = list.find(a => a.attendanceId === attendanceId);
    if (!item) return false;
    item.status = status;
    item.markedByName = `${item.markedByName} (Updated by ${updatedBy})`;
    setItem(STORAGE_KEYS.ATTENDANCE, list);
    return true;
  },

  // QR SCAN LOGS
  getQRScanLogs(): QRScanLog[] {
    return getItem<QRScanLog[]>(STORAGE_KEYS.QR_SCAN_LOGS, []);
  },
  logQRScan(log: Omit<QRScanLog, 'scanLogId' | 'createdAt'>): void {
    const list = this.getQRScanLogs();
    list.unshift({
      ...log,
      scanLogId: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    });
    // Keep max 500 logs locally
    if (list.length > 500) list.pop();
    setItem(STORAGE_KEYS.QR_SCAN_LOGS, list);
  },

  // FEES & PAYMENTS
  getFees(): Fee[] {
    return getItem<Fee[]>(STORAGE_KEYS.FEES, []);
  },
  getFeesForStudent(studentId: string): Fee[] {
    return this.getFees().filter(f => f.studentId === studentId);
  },
  /**
   * Real-time calculation of student fee status from Firestore fee & payment transaction records.
   * fee.amount - discount - valid payment transactions = outstanding balance
   * Status automatically determined: PAID, PARTIAL, UNPAID, OVERDUE.
   */
  calculateStudentFeeStatus(studentId: string): CalculatedStudentFeeStatus {
    const fees = this.getFeesForStudent(studentId);
    const payments = this.getPayments().filter(p => p.studentId === studentId);

    // Sort payments by date descending
    const sortedPayments = [...payments].sort(
      (a, b) => new Date(b.paymentDate || b.createdAt).getTime() - new Date(a.paymentDate || a.createdAt).getTime()
    );

    // Calculate real status for each fee using actual transactions
    const now = new Date();
    const feesWithCalculatedState = fees.map(f => {
      const feePayments = payments.filter(p => p.feeId === f.feeId);
      const validPaymentsTotal = feePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const discount = f.discount || 0;
      const balance = Math.max(0, f.amount - discount - validPaymentsTotal);

      let calculatedStatus: FeeStatus = 'UNPAID';
      const isPastDue = f.dueDate ? new Date(f.dueDate) < now : false;

      if (balance === 0 && (validPaymentsTotal > 0 || f.amount === 0)) {
        calculatedStatus = 'PAID';
      } else if (validPaymentsTotal > 0 && balance > 0) {
        calculatedStatus = 'PARTIAL';
      } else if (isPastDue) {
        calculatedStatus = 'OVERDUE';
      } else {
        calculatedStatus = 'UNPAID';
      }

      return {
        fee: f,
        totalPaid: validPaymentsTotal,
        balance,
        calculatedStatus,
        isPastDue,
        discount,
      };
    });

    // Pick current fee: prefer unpaid/overdue fee first, else the most recent billing month
    const targetFeeState =
      feesWithCalculatedState.find(
        fs => fs.calculatedStatus === 'OVERDUE' || fs.calculatedStatus === 'UNPAID' || fs.calculatedStatus === 'PARTIAL'
      ) || feesWithCalculatedState[0];

    const lastPayment = sortedPayments[0];
    const totalOutstanding = feesWithCalculatedState.reduce((sum, fs) => sum + fs.balance, 0);
    const unpaidCount = feesWithCalculatedState.filter(fs => fs.calculatedStatus !== 'PAID').length;

    if (!targetFeeState) {
      const student = this.getStudentById(studentId);
      const assignedClass = student ? this.getClassById(student.classId) : undefined;
      const defaultMonthly = assignedClass?.monthlyFee || 3500;
      const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

      return {
        billingMonth: 'Current Month',
        feeId: `FEE-INIT-${studentId}`,
        monthlyFee: defaultMonthly,
        discount: 0,
        totalPaid: 0,
        outstandingBalance: defaultMonthly,
        dueDate,
        paymentStatus: 'UNPAID',
        recentPayments: [],
        allUnpaidFeesCount: 1,
        totalOutstandingBalance: defaultMonthly,
        isOverdue: false,
      };
    }

    return {
      billingMonth: targetFeeState.fee.billingMonth,
      feeId: targetFeeState.fee.feeId,
      monthlyFee: targetFeeState.fee.amount,
      discount: targetFeeState.discount,
      totalPaid: targetFeeState.totalPaid,
      outstandingBalance: targetFeeState.balance,
      dueDate: targetFeeState.fee.dueDate,
      paymentStatus: targetFeeState.calculatedStatus,
      lastPaymentDate: lastPayment?.paymentDate || lastPayment?.createdAt?.split('T')[0],
      lastPaymentAmount: lastPayment?.amount,
      recentPayments: sortedPayments.slice(0, 5),
      allUnpaidFeesCount: unpaidCount,
      totalOutstandingBalance: totalOutstanding,
      isOverdue: targetFeeState.calculatedStatus === 'OVERDUE',
    };
  },
  generateMonthlyFees(billingMonth: string, actor: string = 'Admin'): { created: number; skipped: number } {
    const activeStudents = this.getStudents(false).filter(s => s.status === 'ACTIVE');
    const classes = this.getClasses();
    const existingFees = this.getFees();

    let created = 0;
    let skipped = 0;

    activeStudents.forEach(student => {
      // Check if fee already exists for student + billingMonth + feeType
      const alreadyBilled = existingFees.some(
        f => f.studentId === student.studentId && f.billingMonth === billingMonth && f.feeType === 'MONTHLY'
      );

      if (alreadyBilled) {
        skipped++;
        return;
      }

      const assignedClass = classes.find(c => c.classId === student.classId);
      const monthlyAmount = assignedClass?.monthlyFee || 3500;

      const newFee: Fee = {
        feeId: `FEE-${billingMonth.replace(/\s+/g, '')}-${student.studentId}`,
        studentId: student.studentId,
        studentName: student.fullName,
        grade: student.grade,
        classId: student.classId,
        className: student.className,
        feeType: 'MONTHLY',
        billingMonth,
        amount: monthlyAmount,
        discount: 0,
        paidAmount: 0,
        balance: monthlyAmount,
        dueDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-10`,
        status: 'UNPAID',
        createdAt: new Date().toISOString(),
      };

      existingFees.unshift(newFee);
      created++;
    });

    setItem(STORAGE_KEYS.FEES, existingFees);
    this.logAudit({
      actor,
      actorRole: 'ADMIN',
      action: 'MONTHLY_FEES_GENERATED',
      entityType: 'FEES',
      entityId: billingMonth,
      details: `Generated monthly fees for ${billingMonth}: ${created} created, ${skipped} skipped (already billed)`,
    });

    return { created, skipped };
  },
  recordPayment(params: {
    studentId: string;
    feeId: string;
    amount: number;
    discount?: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';
    bankSlipUrl?: string;
    notes?: string;
    recordedBy: string;
    recordedByName: string;
  }): { payment: Payment; receipt: Receipt } {
    const fees = this.getFees();
    const fee = fees.find(f => f.feeId === params.feeId);
    if (!fee) throw new Error('Fee record not found.');

    const student = this.getStudentById(params.studentId);
    const discount = params.discount || 0;
    const paymentAmount = params.amount;

    // Update fee
    fee.discount = (fee.discount || 0) + discount;
    fee.paidAmount = (fee.paidAmount || 0) + paymentAmount;
    fee.balance = Math.max(0, fee.amount - fee.discount - fee.paidAmount);

    if (fee.balance === 0) {
      fee.status = 'PAID';
    } else if (fee.paidAmount > 0) {
      fee.status = 'PARTIAL';
    }

    setItem(STORAGE_KEYS.FEES, fees);

    // Generate unique receipt number
    const receipts = this.getReceipts();
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(receipts.length + 1).padStart(4, '0')}`;
    const paymentId = `PAY-${Date.now()}`;

    const newPayment: Payment = {
      paymentId,
      receiptNumber,
      studentId: params.studentId,
      studentName: student?.fullName || fee.studentName || params.studentId,
      feeId: params.feeId,
      amount: paymentAmount,
      discountApplied: discount,
      paymentMethod: params.paymentMethod,
      bankSlipUrl: params.bankSlipUrl,
      notes: params.notes,
      recordedBy: params.recordedBy,
      recordedByName: params.recordedByName,
      paymentDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const payments = this.getPayments();
    payments.unshift(newPayment);
    setItem(STORAGE_KEYS.PAYMENTS, payments);

    // Verification token for QR on printed receipt
    const verificationQrToken = `https://englishacademypro.lk/verify/rcp/${receiptNumber}`;

    const newReceipt: Receipt = {
      receiptId: receiptNumber,
      receiptNumber,
      paymentId,
      studentId: params.studentId,
      studentName: student?.fullName || fee.studentName || params.studentId,
      grade: fee.grade,
      className: fee.className || '',
      billingMonth: fee.billingMonth,
      amount: fee.amount,
      discount: fee.discount,
      paid: fee.paidAmount,
      balance: fee.balance,
      paymentMethod: params.paymentMethod,
      date: new Date().toISOString().split('T')[0],
      recordedBy: params.recordedByName,
      verificationQrToken,
      createdAt: new Date().toISOString(),
    };

    receipts.unshift(newReceipt);
    setItem(STORAGE_KEYS.RECEIPTS, receipts);

    this.logAudit({
      actor: params.recordedByName,
      actorRole: 'STAFF',
      action: 'PAYMENT_RECORDED',
      entityType: 'PAYMENT',
      entityId: paymentId,
      details: `Payment of Rs. ${paymentAmount} recorded for ${fee.studentName} (${receiptNumber}). Balance: Rs. ${fee.balance}`,
    });

    return { payment: newPayment, receipt: newReceipt };
  },
  getPayments(): Payment[] {
    return getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
  },
  getReceipts(): Receipt[] {
    return getItem<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
  },
  getReceiptById(receiptNumber: string): Receipt | undefined {
    return this.getReceipts().find(r => r.receiptNumber === receiptNumber || r.receiptId === receiptNumber);
  },

  // EXPENSES
  getExpenses(): Expense[] {
    return getItem<Expense[]>(STORAGE_KEYS.EXPENSES, []);
  },
  addExpense(expense: Omit<Expense, 'expenseId' | 'createdAt'>): Expense {
    const list = this.getExpenses();
    const newExp: Expense = {
      ...expense,
      expenseId: `EXP-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newExp);
    setItem(STORAGE_KEYS.EXPENSES, list);
    return newExp;
  },

  // CLASSES & TEACHERS
  getClasses(): AcademyClass[] {
    return getItem<AcademyClass[]>(STORAGE_KEYS.CLASSES, []);
  },
  getClassById(classId: string): AcademyClass | undefined {
    return this.getClasses().find(c => c.classId === classId);
  },
  saveClass(cls: AcademyClass): AcademyClass {
    const list = this.getClasses();
    const idx = list.findIndex(c => c.classId === cls.classId);
    if (idx >= 0) {
      list[idx] = cls;
    } else {
      list.push(cls);
    }
    setItem(STORAGE_KEYS.CLASSES, list);
    return cls;
  },
  getTeachers(): Teacher[] {
    return getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, []);
  },
  saveTeacher(teacher: Teacher): Teacher {
    const list = this.getTeachers();
    const idx = list.findIndex(t => t.teacherId === teacher.teacherId);
    if (idx >= 0) {
      list[idx] = teacher;
    } else {
      list.push(teacher);
    }
    setItem(STORAGE_KEYS.TEACHERS, list);
    return teacher;
  },

  // LMS: LESSONS, PROGRESS, QUIZZES, HOMEWORK, EXAMS
  getLessons(): Lesson[] {
    return getItem<Lesson[]>(STORAGE_KEYS.LESSONS, []);
  },
  saveLesson(lesson: Lesson): Lesson {
    const list = this.getLessons();
    const idx = list.findIndex(l => l.lessonId === lesson.lessonId);
    if (idx >= 0) {
      list[idx] = lesson;
    } else {
      list.push(lesson);
    }
    setItem(STORAGE_KEYS.LESSONS, list);
    return lesson;
  },
  getStudentLessonProgress(studentId: string): StudentLessonProgress[] {
    const all = getItem<StudentLessonProgress[]>(STORAGE_KEYS.LESSON_PROGRESS, []);
    return all.filter(p => p.studentId === studentId);
  },
  getLessonProgress(studentId: string): StudentLessonProgress[] {
    return this.getStudentLessonProgress(studentId);
  },
  updateLessonProgress(studentId: string, lessonId: string, watchPercentage: number, lastPositionSeconds: number): void {
    const all = getItem<StudentLessonProgress[]>(STORAGE_KEYS.LESSON_PROGRESS, []);
    let item = all.find(p => p.studentId === studentId && p.lessonId === lessonId);
    if (!item) {
      item = {
        progressId: `PRG-${studentId}-${lessonId}`,
        studentId,
        lessonId,
        watchPercentage,
        lastPositionSeconds,
        isCompleted: watchPercentage >= 90,
        completedAt: watchPercentage >= 90 ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      };
      all.push(item);
    } else {
      item.watchPercentage = Math.max(item.watchPercentage, watchPercentage);
      item.lastPositionSeconds = lastPositionSeconds;
      if (!item.isCompleted && watchPercentage >= 90) {
        item.isCompleted = true;
        item.completedAt = new Date().toISOString();
      }
      item.updatedAt = new Date().toISOString();
    }
    setItem(STORAGE_KEYS.LESSON_PROGRESS, all);
  },
  getQuizzes(): Quiz[] {
    return getItem<Quiz[]>(STORAGE_KEYS.QUIZZES, []);
  },
  saveQuiz(quiz: Quiz): Quiz {
    const list = this.getQuizzes();
    const idx = list.findIndex(q => q.quizId === quiz.quizId);
    if (idx >= 0) {
      list[idx] = quiz;
    } else {
      list.push(quiz);
    }
    setItem(STORAGE_KEYS.QUIZZES, list);
    return quiz;
  },
  getQuizAttempts(studentId?: string): QuizAttempt[] {
    const list = getItem<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    if (studentId) return list.filter(a => a.studentId === studentId);
    return list;
  },
  submitQuizAttempt(attempt: Omit<QuizAttempt, 'attemptId'>): QuizAttempt {
    const list = this.getQuizAttempts();
    const newAttempt: QuizAttempt = {
      ...attempt,
      attemptId: `ATTEMPT-${Date.now()}`,
    };
    list.unshift(newAttempt);
    setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, list);
    return newAttempt;
  },
  getExamResults(studentId?: string): ExamResult[] {
    const list = getItem<ExamResult[]>(STORAGE_KEYS.EXAM_RESULTS, []);
    if (studentId) return list.filter(r => r.studentId === studentId);
    return list;
  },
  saveExamResult(result: ExamResult): ExamResult {
    const list = this.getExamResults();
    const idx = list.findIndex(r => r.resultId === result.resultId);
    if (idx >= 0) {
      list[idx] = result;
    } else {
      list.unshift(result);
    }
    setItem(STORAGE_KEYS.EXAM_RESULTS, list);
    return result;
  },
  getVocabulary(): VocabularyWord[] {
    return getItem<VocabularyWord[]>(STORAGE_KEYS.VOCABULARY, []);
  },
  saveVocabularyWord(word: VocabularyWord): VocabularyWord {
    const list = this.getVocabulary();
    const idx = list.findIndex(w => w.wordId === word.wordId);
    if (idx >= 0) {
      list[idx] = word;
    } else {
      list.unshift(word);
    }
    setItem(STORAGE_KEYS.VOCABULARY, list);
    return word;
  },
  getHomework(): Homework[] {
    return getItem<Homework[]>(STORAGE_KEYS.HOMEWORK, []);
  },
  saveHomework(hw: Homework): Homework {
    const list = this.getHomework();
    const idx = list.findIndex(h => h.homeworkId === hw.homeworkId);
    if (idx >= 0) {
      list[idx] = hw;
    } else {
      list.unshift(hw);
    }
    setItem(STORAGE_KEYS.HOMEWORK, list);
    return hw;
  },
  getHomeworkSubmissions(homeworkId?: string, studentId?: string): HomeworkSubmission[] {
    let list = getItem<HomeworkSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    if (homeworkId) list = list.filter(s => s.homeworkId === homeworkId);
    if (studentId) list = list.filter(s => s.studentId === studentId);
    return list;
  },
  submitHomework(sub: Omit<HomeworkSubmission, 'submissionId' | 'submittedAt'>): HomeworkSubmission {
    const list = getItem<HomeworkSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    const newSub: HomeworkSubmission = {
      ...sub,
      submissionId: `SUB-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };
    list.unshift(newSub);
    setItem(STORAGE_KEYS.SUBMISSIONS, list);
    return newSub;
  },
  gradeHomework(submissionId: string, marks: number, feedback: string, grader: string): boolean {
    const list = getItem<HomeworkSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    const sub = list.find(s => s.submissionId === submissionId);
    if (!sub) return false;

    sub.marksObtained = marks;
    sub.feedback = feedback;
    sub.gradedBy = grader;
    sub.gradedAt = new Date().toISOString();
    sub.status = 'GRADED';
    setItem(STORAGE_KEYS.SUBMISSIONS, list);
    return true;
  },

  // ANNOUNCEMENTS & NOTIFICATIONS
  getAnnouncements(): Announcement[] {
    return getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, []);
  },
  addAnnouncement(announcement: Omit<Announcement, 'announcementId'>): Announcement {
    const list = this.getAnnouncements();
    const newAnn: Announcement = {
      ...announcement,
      announcementId: `ANN-${Date.now()}`,
    };
    list.unshift(newAnn);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return newAnn;
  },
  getNotifications(userId: string = 'ALL'): InAppNotification[] {
    const list = getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return list.filter(n => n.recipientId === 'ALL' || n.recipientId === userId);
  },
  addNotification(notif: Omit<InAppNotification, 'notificationId' | 'createdAt' | 'read'>): void {
    const list = getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    list.unshift({
      ...notif,
      notificationId: `NOTIF-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },
  markNotificationRead(notificationId: string): void {
    const list = getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const notif = list.find(n => n.notificationId === notificationId);
    if (notif) {
      notif.read = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },

  // ADMISSIONS
  getAdmissions(): AdmissionApplication[] {
    return getItem<AdmissionApplication[]>(STORAGE_KEYS.ADMISSIONS, []);
  },
  submitAdmission(app: Omit<AdmissionApplication, 'admissionId' | 'appliedDate' | 'status'>): AdmissionApplication {
    const list = this.getAdmissions();
    const newApp: AdmissionApplication = {
      ...app,
      admissionId: `ADM-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };
    list.unshift(newApp);
    setItem(STORAGE_KEYS.ADMISSIONS, list);
    return newApp;
  },
  approveAdmission(admissionId: string, assignedClassId: string, actor: string = 'Admin'): Student | null {
    const list = this.getAdmissions();
    const adm = list.find(a => a.admissionId === admissionId);
    if (!adm) return null;

    adm.status = 'APPROVED';
    setItem(STORAGE_KEYS.ADMISSIONS, list);

    const classes = this.getClasses();
    const assignedClass = classes.find(c => c.classId === assignedClassId);
    const newStudentId = this.generateNextStudentId();

    const student: Student = {
      studentId: newStudentId,
      firstName: adm.firstName,
      lastName: adm.lastName,
      fullName: `${adm.firstName} ${adm.lastName}`,
      dob: adm.dob,
      gender: (adm.gender as any) || 'OTHER',
      school: adm.school,
      grade: adm.grade,
      classId: assignedClassId,
      className: assignedClass?.name || assignedClassId,
      address: adm.address,
      parentName: adm.parentName,
      parentRelationship: 'Parent',
      parentPhone: adm.parentPhone,
      whatsApp: adm.whatsApp,
      email: adm.email,
      emergencyContact: adm.parentPhone,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      notes: adm.notes || 'Admitted via Online Admission Portal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.saveStudent(student, actor);
  },

  // PROFILE CHANGE REQUESTS
  getProfileChangeRequests(): ProfileChangeRequest[] {
    return getItem<ProfileChangeRequest[]>(STORAGE_KEYS.PROFILE_REQUESTS, []);
  },
  submitProfileChangeRequest(studentId: string, requestedFields: Record<string, string>, reason: string): ProfileChangeRequest {
    const list = this.getProfileChangeRequests();
    const student = this.getStudentById(studentId);
    const req: ProfileChangeRequest = {
      requestId: `PCR-${Date.now()}`,
      studentId,
      studentName: student?.fullName || studentId,
      requestedFields,
      reason,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };
    list.unshift(req);
    setItem(STORAGE_KEYS.PROFILE_REQUESTS, list);
    return req;
  },
  reviewProfileChangeRequest(requestId: string, approve: boolean, reviewer: string = 'Admin'): boolean {
    const list = this.getProfileChangeRequests();
    const req = list.find(r => r.requestId === requestId);
    if (!req) return false;

    req.status = approve ? 'APPROVED' : 'REJECTED';
    req.reviewedBy = reviewer;
    req.reviewedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.PROFILE_REQUESTS, list);

    if (approve) {
      const student = this.getStudentById(req.studentId);
      if (student) {
        Object.assign(student, req.requestedFields);
        this.saveStudent(student, reviewer);
      }
    }
    return true;
  },

  // AUDIT LOGS
  getAuditLogs(): AuditLog[] {
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  },
  logAudit(entry: Omit<AuditLog, 'logId' | 'timestamp'>): void {
    const list = this.getAuditLogs();
    list.unshift({
      ...entry,
      logId: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    });
    // Cap at 1000 logs
    if (list.length > 1000) list.pop();
    setItem(STORAGE_KEYS.AUDIT_LOGS, list);
  },

  getStudentsByClass(classId: string): Student[] {
    return this.getStudents(false).filter(s => s.classId === classId);
  },
  saveFee(fee: Fee): Fee {
    const list = this.getFees();
    const idx = list.findIndex(f => f.feeId === fee.feeId);
    if (idx >= 0) {
      list[idx] = fee;
    } else {
      list.unshift(fee);
    }
    setItem(STORAGE_KEYS.FEES, list);
    return fee;
  },
  exportFullBackup(): string {
    const backup: Record<string, any> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      backup[name] = getItem(key, null);
    });
    return JSON.stringify(backup, null, 2);
  },

  getLMSMaterials(): LMSMaterial[] {
    const fallback: LMSMaterial[] = [
      {
        materialId: 'LMS-001',
        title: 'Grade 8 English Tenses Comprehensive Handbook',
        description: 'Detailed breakdowns, timeline graphs, and 50 practice sentences for active vs passive and perfect tenses.',
        type: 'PDF',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        classId: 'CLS-G08-SAT',
        className: 'Grade 8 English Mastery',
        grade: 'Grade 8',
        uploadedBy: 'Mr. David Perera',
        uploadedAt: '2026-08-15',
        downloadsCount: 42,
      },
      {
        materialId: 'LMS-002',
        title: 'O/L English Vocabulary & Essay Writing Masterclass',
        description: 'Essential connectors, formal letter structures, and argumentative essay models with model answers.',
        type: 'PDF',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        classId: 'CLS-G11-SUN',
        className: 'Grade 11 O/L Intensive English',
        grade: 'Grade 11',
        uploadedBy: 'Mr. David Perera',
        uploadedAt: '2026-08-20',
        downloadsCount: 88,
      },
      {
        materialId: 'LMS-003',
        title: 'British Accent Pronunciation & Phonetics Guide',
        description: 'Vowel sounds, diphthongs, and intonation practice audio session with phonetic transcripts.',
        type: 'AUDIO',
        fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        classId: 'CLS-SPK-SUN',
        className: 'Spoken English & Public Speaking',
        grade: 'General',
        uploadedBy: 'Ms. Sarah Jenkins',
        uploadedAt: '2026-08-25',
        downloadsCount: 65,
      },
      {
        materialId: 'LMS-004',
        title: 'Reported Speech Video Lecture & Walkthrough',
        description: 'Comprehensive recorded video session explaining direct to indirect speech conversions step by step.',
        type: 'VIDEO',
        fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        classId: 'CLS-G09-SAT',
        className: 'Grade 9 Intermediate English',
        grade: 'Grade 9',
        uploadedBy: 'Mr. David Perera',
        uploadedAt: '2026-09-01',
        downloadsCount: 112,
      },
    ];
    return getItem<LMSMaterial[]>(STORAGE_KEYS.LMS_MATERIALS, fallback);
  },

  saveLMSMaterial(material: LMSMaterial): LMSMaterial[] {
    const list = this.getLMSMaterials();
    const idx = list.findIndex(m => m.materialId === material.materialId);
    if (idx >= 0) {
      list[idx] = material;
    } else {
      list.unshift(material);
    }
    setItem(STORAGE_KEYS.LMS_MATERIALS, list);
    return list;
  },

  // STUDENT DOCUMENTS (Firebase Storage compliant schema)
  getStudentDocuments(studentId?: string): StudentDocument[] {
    const all = getItem<StudentDocument[]>(STORAGE_KEYS.STUDENT_DOCUMENTS, [
      {
        documentId: 'DOC-001',
        studentId: 'STU-000124',
        studentName: 'Kamal Perera',
        title: 'Original Admission Form & Birth Certificate',
        category: 'ADMISSION',
        fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=60',
        fileType: 'application/pdf',
        fileSizeKb: 450,
        uploaderId: 'USR-ADMIN-01',
        uploaderName: 'Super Admin',
        uploaderRole: 'SUPER_ADMIN',
        uploadDate: '2026-01-10',
        permissionMetadata: 'AUTHORIZED_STAFF_ONLY',
      },
      {
        documentId: 'DOC-002',
        studentId: 'STU-000124',
        studentName: 'Kamal Perera',
        title: 'Student Academy ID Card Scan',
        category: 'ID_CARD',
        fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60',
        fileType: 'image/jpeg',
        fileSizeKb: 280,
        uploaderId: 'USR-STAFF-01',
        uploaderName: 'Office Staff',
        uploaderRole: 'STAFF',
        uploadDate: '2026-01-15',
        permissionMetadata: 'STUDENT_PARENT_STAFF',
      },
      {
        documentId: 'DOC-003',
        studentId: 'STU-000125',
        studentName: 'Nimal Fernando',
        title: 'Bank Transfer Payment Slip - August',
        category: 'PAYMENT_PROOF',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
        fileType: 'image/jpeg',
        fileSizeKb: 310,
        uploaderId: 'USR-PARENT-02',
        uploaderName: 'Sunil Fernando',
        uploaderRole: 'PARENT',
        uploadDate: '2026-08-12',
        permissionMetadata: 'FINANCE_STAFF_ONLY',
      },
    ]);
    if (studentId) {
      return all.filter(d => d.studentId === studentId);
    }
    return all;
  },

  saveStudentDocument(doc: Omit<StudentDocument, 'documentId' | 'uploadDate'>): StudentDocument {
    const list = this.getStudentDocuments();
    const newDoc: StudentDocument = {
      ...doc,
      documentId: `DOC-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    list.unshift(newDoc);
    setItem(STORAGE_KEYS.STUDENT_DOCUMENTS, list);

    this.logAudit({
      actor: doc.uploaderName,
      actorRole: doc.uploaderRole as UserRole,
      action: 'DOCUMENT_UPLOADED',
      entityType: 'DOCUMENT',
      entityId: newDoc.documentId,
      details: `Uploaded document "${doc.title}" for student ${doc.studentId}`,
    });

    return newDoc;
  },

  deleteStudentDocument(documentId: string, actor: string = 'Staff'): boolean {
    const list = this.getStudentDocuments();
    const item = list.find(d => d.documentId === documentId);
    if (!item) return false;
    const filtered = list.filter(d => d.documentId !== documentId);
    setItem(STORAGE_KEYS.STUDENT_DOCUMENTS, filtered);

    this.logAudit({
      actor,
      actorRole: 'STAFF',
      action: 'DOCUMENT_DELETED',
      entityType: 'DOCUMENT',
      entityId: documentId,
      details: `Deleted document "${item.title}" for student ${item.studentId}`,
    });
    return true;
  },

  // WAITING LIST FOR FULL CLASSES
  getWaitingList(): WaitingListEntry[] {
    return getItem<WaitingListEntry[]>(STORAGE_KEYS.WAITING_LIST, [
      {
        waitingId: 'WAIT-001',
        studentId: 'STU-000130',
        studentName: 'Ruwan Kumara',
        grade: 'Grade 8',
        preferredClassId: 'CLS-G08-A',
        preferredClassName: 'Grade 8 - English (A)',
        date: '2026-09-02',
        priority: 'HIGH',
        status: 'WAITING',
        notes: 'Requested weekend morning batch if capacity opens up.',
        addedBy: 'Office Staff',
        createdAt: '2026-09-02T10:00:00Z',
      },
    ]);
  },

  addToWaitingList(entry: Omit<WaitingListEntry, 'waitingId' | 'createdAt'>): WaitingListEntry {
    const list = this.getWaitingList();
    const newEntry: WaitingListEntry = {
      ...entry,
      waitingId: `WAIT-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEntry);
    setItem(STORAGE_KEYS.WAITING_LIST, list);

    this.logAudit({
      actor: entry.addedBy,
      actorRole: 'STAFF',
      action: 'WAITING_LIST_ADDED',
      entityType: 'CLASS',
      entityId: entry.preferredClassId,
      details: `Student ${entry.studentName} (${entry.studentId}) added to waiting list for class ${entry.preferredClassName}.`,
    });

    return newEntry;
  },

  updateWaitingListStatus(waitingId: string, status: WaitingListEntry['status'], actor: string = 'Staff'): boolean {
    const list = this.getWaitingList();
    const item = list.find(w => w.waitingId === waitingId);
    if (!item) return false;
    item.status = status;
    setItem(STORAGE_KEYS.WAITING_LIST, list);

    this.logAudit({
      actor,
      actorRole: 'STAFF',
      action: 'WAITING_LIST_STATUS_CHANGED',
      entityType: 'WAITING_LIST',
      entityId: waitingId,
      details: `Waiting list status for ${item.studentName} changed to ${status}.`,
    });
    return true;
  },

  // CLASS TRANSFERS (Preserves historical attendance)
  getClassTransfers(studentId?: string): ClassTransferRecord[] {
    const list = getItem<ClassTransferRecord[]>(STORAGE_KEYS.CLASS_TRANSFERS, []);
    if (studentId) return list.filter(t => t.studentId === studentId);
    return list;
  },

  transferStudent(params: {
    studentId: string;
    toClassId: string;
    reason: string;
    transferredBy: string;
    transferredByName: string;
    actorRole?: UserRole;
  }): { success: boolean; message: string; record?: ClassTransferRecord } {
    const student = this.getStudentById(params.studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    const classes = this.getClasses();
    const newClass = classes.find(c => c.classId === params.toClassId);
    if (!newClass) return { success: false, message: 'Target class not found.' };

    const oldClassId = student.classId;
    const oldClassName = student.className;

    if (oldClassId === params.toClassId) {
      return { success: false, message: 'Student is already in this class.' };
    }

    // Check capacity
    const enrolledInTarget = this.getStudents(false).filter(s => s.classId === params.toClassId && s.status === 'ACTIVE').length;
    if (newClass.capacity && enrolledInTarget >= newClass.capacity) {
      // Administrative warning allowed, but check proceeds
    }

    // Update Student's active class (Never touch past attendance records!)
    student.classId = newClass.classId;
    student.className = newClass.name;
    student.grade = newClass.grade;
    student.updatedAt = new Date().toISOString();
    this.saveStudent(student);

    const transferRecord: ClassTransferRecord = {
      transferId: `TRF-${Date.now()}-${params.studentId}`,
      studentId: student.studentId,
      studentName: student.fullName,
      fromClassId: oldClassId,
      fromClassName: oldClassName,
      toClassId: newClass.classId,
      toClassName: newClass.name,
      transferDate: new Date().toISOString().split('T')[0],
      reason: params.reason || 'Class schedule reorganization',
      transferredBy: params.transferredBy,
      transferredByName: params.transferredByName,
      createdAt: new Date().toISOString(),
    };

    const transfers = this.getClassTransfers();
    transfers.unshift(transferRecord);
    setItem(STORAGE_KEYS.CLASS_TRANSFERS, transfers);

    this.logAudit({
      actor: params.transferredByName,
      actorRole: params.actorRole || 'ADMIN',
      action: 'STUDENT_TRANSFERRED',
      entityType: 'STUDENT',
      entityId: student.studentId,
      details: `Student transferred from "${oldClassName}" (${oldClassId}) to "${newClass.name}" (${newClass.classId}). Reason: ${params.reason}. Historical attendance preserved.`,
    });

    return {
      success: true,
      message: `Student successfully transferred to ${newClass.name}. Historical attendance preserved.`,
      record: transferRecord,
    };
  },

  // BULK PROMOTION (End of academic year)
  getStudentPromotions(): StudentPromotionBatch[] {
    return getItem<StudentPromotionBatch[]>(STORAGE_KEYS.PROMOTIONS, []);
  },

  promoteStudents(params: {
    fromGrade: string;
    toGrade: string;
    toClassId?: string;
    studentIds: string[];
    promotedBy: string;
    notes?: string;
  }): { success: boolean; promotedCount: number } {
    const allStudents = this.getStudents(true);
    let promotedCount = 0;
    const targetClass = params.toClassId ? this.getClassById(params.toClassId) : undefined;

    params.studentIds.forEach(id => {
      const stu = allStudents.find(s => s.studentId === id);
      if (stu && stu.status === 'ACTIVE') {
        stu.grade = params.toGrade;
        if (targetClass) {
          stu.classId = targetClass.classId;
          stu.className = targetClass.name;
        }
        stu.updatedAt = new Date().toISOString();
        promotedCount++;
      }
    });

    setItem(STORAGE_KEYS.STUDENTS, allStudents);

    const batch: StudentPromotionBatch = {
      promotionId: `PROM-${Date.now()}`,
      fromGrade: params.fromGrade,
      toGrade: params.toGrade,
      fromClassId: undefined,
      toClassId: params.toClassId,
      promotedStudentIds: params.studentIds,
      promotedDate: new Date().toISOString().split('T')[0],
      promotedBy: params.promotedBy,
      notes: params.notes,
    };

    const batches = this.getStudentPromotions();
    batches.unshift(batch);
    setItem(STORAGE_KEYS.PROMOTIONS, batches);

    this.logAudit({
      actor: params.promotedBy,
      actorRole: 'SUPER_ADMIN',
      action: 'STUDENTS_BULK_PROMOTED',
      entityType: 'STUDENT_BATCH',
      entityId: batch.promotionId,
      details: `Bulk promoted ${promotedCount} students from ${params.fromGrade} to ${params.toGrade}. Historical records intact.`,
    });

    return { success: true, promotedCount };
  },

  // EXCUSED ABSENCES
  getExcusedAbsences(studentId?: string): ExcusedAbsenceRecord[] {
    const all = getItem<ExcusedAbsenceRecord[]>(STORAGE_KEYS.EXCUSED_ABSENCES, []);
    if (studentId) return all.filter(e => e.studentId === studentId);
    return all;
  },

  markExcusedAbsence(params: {
    studentId: string;
    sessionId: string;
    reason: 'Sick' | 'School event' | 'Family reason' | 'Approved leave' | 'Other';
    notes?: string;
    actor: string;
    actorName: string;
    actorRole?: UserRole;
  }): { success: boolean; message: string } {
    const student = this.getStudentById(params.studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    const session = this.getSessionById(params.sessionId);
    if (!session) return { success: false, message: 'Session not found.' };

    const attendanceList = this.getAttendance();
    const existingIdx = attendanceList.findIndex(
      a => a.studentId === params.studentId && a.sessionId === params.sessionId
    );

    const timestamp = new Date().toISOString();

    if (existingIdx >= 0) {
      attendanceList[existingIdx].status = 'EXCUSED';
      attendanceList[existingIdx].correctionStatus = 'EXCUSED_LEAVE';
      attendanceList[existingIdx].correctionReason = `${params.reason}: ${params.notes || 'Approved excused absence'}`;
      attendanceList[existingIdx].correctedBy = params.actorName;
      attendanceList[existingIdx].correctedAt = timestamp;
    } else {
      attendanceList.unshift({
        attendanceId: `ATT-${params.studentId}-${Date.now()}`,
        studentId: student.studentId,
        studentName: student.fullName,
        classId: session.classId,
        className: session.className,
        sessionId: session.sessionId,
        date: session.date,
        status: 'EXCUSED',
        attendanceMethod: 'MANUAL_SEARCH',
        markedBy: params.actor,
        markedByName: params.actorName,
        markedByRole: params.actorRole || 'STAFF',
        markedAt: timestamp,
        correctionReason: `${params.reason}: ${params.notes || 'Excused absence approved'}`,
        createdAt: timestamp,
      });
    }

    setItem(STORAGE_KEYS.ATTENDANCE, attendanceList);

    const excuseRecord: ExcusedAbsenceRecord = {
      excuseId: `EXC-${Date.now()}-${params.studentId}`,
      studentId: student.studentId,
      studentName: student.fullName,
      sessionId: session.sessionId,
      sessionName: session.className,
      date: session.date,
      reason: params.reason,
      notes: params.notes,
      actor: params.actor,
      actorName: params.actorName,
      timestamp,
    };

    const excuses = this.getExcusedAbsences();
    excuses.unshift(excuseRecord);
    setItem(STORAGE_KEYS.EXCUSED_ABSENCES, excuses);

    this.logAudit({
      actor: params.actorName,
      actorRole: params.actorRole || 'STAFF',
      action: 'ATTENDANCE_EXCUSED',
      entityType: 'ATTENDANCE',
      entityId: params.sessionId,
      details: `Student ${student.fullName} marked as EXCUSED for session ${session.className} (${session.date}). Reason: ${params.reason}.`,
    });

    return { success: true, message: `Absence marked as EXCUSED (${params.reason}).` };
  },

  // ATTENDANCE CORRECTION (With full audit trail)
  correctAttendanceRecord(params: {
    attendanceId: string;
    newStatus: AttendanceStatus;
    reason: string;
    correctedBy: string;
    correctedByName: string;
    actorRole?: UserRole;
  }): { success: boolean; message: string } {
    const list = this.getAttendance();
    const item = list.find(a => a.attendanceId === params.attendanceId);
    if (!item) return { success: false, message: 'Attendance record not found.' };

    const oldStatus = item.status;
    item.status = params.newStatus;
    item.correctionStatus = 'CORRECTED';
    item.correctionReason = params.reason;
    item.correctedBy = params.correctedByName;
    item.correctedAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();

    setItem(STORAGE_KEYS.ATTENDANCE, list);

    this.logAudit({
      actor: params.correctedByName,
      actorRole: params.actorRole || 'ADMIN',
      action: 'ATTENDANCE_CORRECTED',
      entityType: 'ATTENDANCE',
      entityId: params.attendanceId,
      details: `Attendance for ${item.studentName || item.studentId} corrected from ${oldStatus} to ${params.newStatus}. Reason: ${params.reason}`,
    });

    return { success: true, message: `Attendance corrected to ${params.newStatus}.` };
  },

  // RESET / RE-SEED
  resetToDefaultSeed(): void {
    localStorage.clear();
    initializeStorageIfNeeded();
  },
};
