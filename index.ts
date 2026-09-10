export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STAFF' | 'STUDENT' | 'PARENT';

export interface UserProfile {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  studentId?: string; // If role === 'STUDENT'
  teacherId?: string; // If role === 'TEACHER'
  parentLinkedStudentIds?: string[]; // If role === 'PARENT'
  createdAt: string;
}

export type StudentStatus = 'APPLICANT' | 'ACTIVE' | 'TRANSFERRED' | 'INACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface Student {
  studentId: string; // e.g. STU-000001
  firstName: string;
  lastName: string;
  fullName: string;
  photo?: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  school: string;
  grade: string; // e.g. 'Grade 8'
  classId: string;
  className: string;
  address: string;
  studentPhone?: string;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  whatsApp: string;
  email?: string;
  emergencyContact: string;
  registrationDate: string;
  status: StudentStatus;
  archiveReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type QRStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'SUSPENDED';

export interface QRCodeRecord {
  qrCodeId: string;
  studentId: string;
  publicQrId: string; // Secure random UUID / token
  tokenHash?: string;
  status: QRStatus;
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  issuedAt: string;
  revokedAt?: string;
  revokedBy?: string;
  revocationReason?: string;
  expiresAt?: string;
  lastScannedAt?: string;
  scanCount: number;
}

export interface QRReplacementRequest {
  requestId: string;
  studentId: string;
  studentName: string;
  requestedBy: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export type ClassSessionStatus = 'SCHEDULED' | 'OPEN' | 'CLOSED' | 'CANCELLED' | 'MAKEUP';

export interface ClassSession {
  sessionId: string;
  classId: string;
  className: string;
  grade: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: ClassSessionStatus;
  teacherId: string;
  teacherName: string;
  room: string;
  weekNumber?: number;
  notes?: string;
  createdAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';
export type AttendanceMethod = 'QR' | 'MANUAL_SEARCH';

export interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  studentName?: string;
  classId: string;
  className?: string;
  sessionId: string;
  academicYearId?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  attendanceMethod: AttendanceMethod;
  scannedQrCodeId?: string;
  markedBy: string;
  markedByName: string;
  markedByRole: string;
  markedAt: string;
  deviceId?: string;
  offlineRecordId?: string;
  isOffline?: boolean;
  syncedAt?: string;
  correctionStatus?: string;
  correctionReason?: string;
  correctedBy?: string;
  correctedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type QRScanResult =
  | 'SUCCESS'
  | 'DUPLICATE'
  | 'INVALID'
  | 'REVOKED'
  | 'EXPIRED'
  | 'UNAUTHORIZED'
  | 'WRONG_CLASS'
  | 'SESSION_CLOSED';

export interface QRScanLog {
  scanLogId: string;
  qrCodeId?: string;
  studentId?: string;
  scannerUserId: string;
  scannerRole: string;
  classId?: string;
  sessionId?: string;
  result: QRScanResult;
  failureReason?: string;
  deviceId?: string;
  scannedAt: string;
  createdAt: string;
}

export type FeeStatus = 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
export type FeeType = 'MONTHLY' | 'ADMISSION' | 'EXAM' | 'SPECIAL' | 'MATERIAL' | 'OTHER';

export interface Fee {
  feeId: string;
  studentId: string;
  studentName?: string;
  grade: string;
  classId: string;
  className?: string;
  feeType: FeeType;
  billingMonth: string; // e.g. "September 2026"
  amount: number;
  discount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: FeeStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CalculatedStudentFeeStatus {
  billingMonth: string;
  feeId: string;
  monthlyFee: number;
  discount: number;
  totalPaid: number;
  outstandingBalance: number;
  dueDate: string;
  paymentStatus: FeeStatus;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  recentPayments: Payment[];
  allUnpaidFeesCount: number;
  totalOutstandingBalance: number;
  isOverdue: boolean;
}

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';

export interface Payment {
  paymentId: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  feeId: string;
  amount: number;
  discountApplied?: number;
  paymentMethod: PaymentMethod;
  bankSlipUrl?: string;
  notes?: string;
  recordedBy: string;
  recordedByName: string;
  paymentDate: string;
  createdAt: string;
}

export interface Receipt {
  receiptId: string;
  receiptNumber: string;
  paymentId: string;
  studentId: string;
  studentName: string;
  grade: string;
  className: string;
  billingMonth: string;
  amount: number;
  discount: number;
  paid: number;
  balance: number;
  paymentMethod: string;
  date: string;
  recordedBy: string;
  verificationQrToken: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Rent'
  | 'Electricity'
  | 'Internet'
  | 'Teacher Salary'
  | 'Printing'
  | 'Equipment'
  | 'Other';

export interface Expense {
  expenseId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  recordedBy: string;
  notes?: string;
  createdAt: string;
}

export interface AcademyClass {
  classId: string;
  grade: string;
  name: string;
  teacherId: string;
  teacherName: string;
  day: string; // e.g. 'Saturday'
  startTime: string; // '09:00'
  endTime: string; // '11:00'
  room: string;
  capacity: number;
  monthlyFee: number;
  feeAmount?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Teacher {
  teacherId: string;
  name: string;
  photo?: string;
  phone: string;
  email: string;
  specialization: string;
  assignedClasses: string[]; // classIds
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Parent {
  parentId: string;
  name: string;
  phone: string;
  whatsApp: string;
  email?: string;
  address?: string;
  childrenStudentIds: string[];
}

export interface Lesson {
  lessonId: string;
  classId: string;
  grade: string;
  title: string;
  description: string;
  videoUrl?: string;
  durationMinutes?: number;
  materialUrls?: { name: string; url: string; type: string }[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  order: number;
  skillFocus?: 'Grammar' | 'Vocabulary' | 'Reading' | 'Writing' | 'Listening' | 'Speaking' | 'Pronunciation';
}

export interface StudentLessonProgress {
  progressId: string;
  studentId: string;
  lessonId: string;
  watchPercentage: number;
  lastPositionSeconds: number;
  isCompleted: boolean;
  completedAt?: string;
  updatedAt: string;
}

export interface Homework {
  homeworkId: string;
  classId: string;
  grade: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  attachments?: { name: string; url: string }[];
  createdBy: string;
  createdAt: string;
}

export interface HomeworkSubmission {
  submissionId: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  fileUrl?: string;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  status: 'SUBMITTED' | 'GRADED';
}

export interface QuizQuestion {
  questionId: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  marks: number;
}

export interface Quiz {
  quizId: string;
  classId: string;
  grade: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passMarkPercentage: number;
  questions: QuizQuestion[];
  isPublished: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  attemptId: string;
  quizId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  completedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  isPassed: boolean;
  answers: { questionId: string; answer: string; isCorrect: boolean }[];
}

export interface VocabularyWord {
  wordId: string;
  word: string;
  partOfSpeech: string;
  meaning: string;
  pronunciationIpa: string;
  exampleSentence: string;
  gradeLevel: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  audioPrompt?: string;
}

export interface EnglishSkillBreakdown {
  grammar: number; // 0 - 100
  vocabulary: number;
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
  pronunciation: number;
}

export interface LMSMaterial {
  materialId: string;
  title: string;
  description: string;
  type: 'PDF' | 'VIDEO' | 'AUDIO' | 'ASSIGNMENT';
  fileUrl: string;
  classId: string;
  className: string;
  grade: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadsCount: number;
}

export interface ExamResult {
  resultId: string;
  examName: string; // 'Term 1 Exam', 'Monthly Test', etc.
  studentId: string;
  studentName: string;
  grade: string;
  date: string;
  totalScore: number;
  maxScore: number;
  marks?: number;
  totalMarks?: number;
  percentage: number;
  gradeLetter: string; // A, B, C, S, F
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  skillScores: EnglishSkillBreakdown;
  teacherRemarks?: string;
}

export interface Announcement {
  announcementId: string;
  title: string;
  message: string;
  authorName: string;
  targetRole: 'ALL' | 'TEACHER' | 'STUDENT' | 'PARENT';
  targetGrade?: string;
  date: string;
  isUrgent?: boolean;
}

export interface InAppNotification {
  notificationId: string;
  recipientId: string; // userId or 'ALL'
  title: string;
  message: string;
  type: 'FEE' | 'PAYMENT' | 'ATTENDANCE' | 'HOMEWORK' | 'QUIZ' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export interface ProfileChangeRequest {
  requestId: string;
  studentId: string;
  studentName: string;
  requestedFields: Record<string, string>;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AdmissionApplication {
  admissionId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  school: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  whatsApp: string;
  email?: string;
  address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  notes?: string;
}

export interface AuditLog {
  logId: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  timestamp: string;
  performedByName?: string;
  role?: string;
  entity?: string;
}

export interface AcademySettings {
  academyName: string;
  tagline: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  whatsApp: string;
  website: string;
  currency: string; // Default: 'LKR'
  timezone: string; // Default: 'Asia/Colombo'
  language: 'en' | 'si' | 'ta';
  receiptFooter: string;
  termsAndConditions: string;
  classesPerMonth: number; // Default: 4
  attendanceOpenMinutesBefore: number; // Default: 30
  lateAfterMinutes: number; // Default: 15
  attendanceCloseMinutesAfter: number; // Default: 60
  learningLockPolicy: 'LOCK_IF_UNPAID' | 'ALLOW_ALL' | 'ALLOW_PARTIAL';
}

export interface StudentDocument {
  documentId: string;
  studentId: string;
  studentName?: string;
  title: string;
  category: 'PHOTO' | 'ID_CARD' | 'ADMISSION' | 'CERTIFICATE' | 'PAYMENT_PROOF' | 'HOMEWORK' | 'OTHER';
  fileUrl: string;
  fileType: string; // e.g. 'image/jpeg', 'application/pdf'
  fileSizeKb: number;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: string;
  uploadDate: string;
  permissionMetadata?: string;
}

export interface WaitingListEntry {
  waitingId: string;
  studentId: string;
  studentName: string;
  grade: string;
  preferredClassId: string;
  preferredClassName: string;
  date: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'WAITING' | 'OFFERED' | 'ENROLLED' | 'CANCELLED';
  notes?: string;
  addedBy: string;
  createdAt: string;
}

export interface ClassTransferRecord {
  transferId: string;
  studentId: string;
  studentName: string;
  fromClassId: string;
  fromClassName: string;
  toClassId: string;
  toClassName: string;
  transferDate: string;
  reason: string;
  transferredBy: string;
  transferredByName: string;
  createdAt: string;
}

export interface StudentPromotionBatch {
  promotionId: string;
  fromGrade: string;
  toGrade: string;
  fromClassId?: string;
  toClassId?: string;
  promotedStudentIds: string[];
  promotedDate: string;
  promotedBy: string;
  notes?: string;
}

export interface ExcusedAbsenceRecord {
  excuseId: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  sessionName?: string;
  date: string;
  reason: 'Sick' | 'School event' | 'Family reason' | 'Approved leave' | 'Other';
  notes?: string;
  actor: string;
  actorName: string;
  timestamp: string;
}

// System Control & Health
export interface SystemHealthStatus {
  firebaseConnected: boolean;
  authConnected: boolean;
  firestoreStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  storageStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  cloudFunctionsStatus: 'AVAILABLE' | 'NOT_DEPLOYED';
  pwaStatus: 'SUPPORTED' | 'ACTIVE' | 'NOT_SUPPORTED';
  isOnline: boolean;
  indexedDbReady: boolean;
  pendingSyncCount: number;
  failedSyncCount: number;
  recentErrorsCount: number;
  failedQrScansCount: number;
  attendanceErrorsCount: number;
  activeUsersCount: number;
  activeStudentsCount: number;
  storageUsageMb: number;
  lastBackupTimestamp?: string;
  lastBackupStatus: 'SUCCESS' | 'FAILED' | 'NEVER';
  securityPosture: 'SECURE' | 'ACTION_REQUIRED';
  appVersion: string;
  environment: string;
  lastCheckedAt: string;
}

export interface MaintenanceModeConfig {
  isEnabled: boolean;
  message: string;
  startedAt?: string;
  allowedRoles: UserRole[];
  estimatedRestoreAt?: string;
}

export interface SystemErrorLog {
  errorId: string;
  code?: string;
  message: string;
  stack?: string;
  context?: string;
  timestamp: string;
  userId?: string;
  resolved: boolean;
}

// Help Desk Tickets
export type TicketCategory = 'TECHNICAL' | 'PAYMENT' | 'ATTENDANCE' | 'ACCOUNT' | 'ACADEMIC' | 'OTHER';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface HelpDeskTicket {
  ticketId: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  submittedBy: string;
  submittedByName: string;
  submittedByRole: UserRole;
  assignedStaffId?: string;
  assignedStaffName?: string;
  comments: {
    commentId: string;
    authorName: string;
    authorRole: UserRole;
    text: string;
    createdAt: string;
  }[];
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Calendar & Timetable Events
export type AcademyEventType =
  | 'CLASS'
  | 'EXAM'
  | 'HOMEWORK_DEADLINE'
  | 'HOLIDAY'
  | 'MEETING'
  | 'SPECIAL_CLASS'
  | 'CANCELLED_CLASS'
  | 'MAKEUP_CLASS'
  | 'ACADEMY_EVENT'
  | 'TEACHER_MEETING'
  | 'PARENT_MEETING';

export interface AcademyCalendarEvent {
  eventId: string;
  title: string;
  description?: string;
  type: AcademyEventType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  classId?: string;
  className?: string;
  grade?: string;
  teacherId?: string;
  teacherName?: string;
  room?: string;
  isAllDay?: boolean;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
  targetAudience: 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS' | 'STAFF';
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
}

export interface TimetableConflict {
  type: 'TEACHER_DOUBLE_BOOKING' | 'ROOM_DOUBLE_BOOKING' | 'HOLIDAY_OVERLAP' | 'CAPACITY_EXCEEDED';
  description: string;
  affectedClassIds: string[];
  severity: 'WARNING' | 'BLOCKING';
}

// Attendance Alert Rules & Notifications
export interface AttendanceAlertConfig {
  alertAbsent: boolean;
  alertRepeatedlyLate: boolean;
  repeatedLateThreshold: number; // e.g. 3 times in 30 days
  lowAttendanceThreshold: number; // e.g. below 75%
  consecutiveAbsenceThreshold: number; // e.g. 2 consecutive
}

export interface AttendanceAlertItem {
  alertId: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  whatsApp: string;
  className: string;
  type: 'ABSENT' | 'REPEATED_LATE' | 'LOW_RATE' | 'CONSECUTIVE_ABSENCE';
  description: string;
  generatedAt: string;
  isDismissed: boolean;
}

// Cashier Shift Closing
export interface CashierDailyClosing {
  closingId: string;
  date: string; // YYYY-MM-DD
  closedBy: string;
  closedByName: string;
  totalCashCollected: number;
  totalBankTransferCollected: number;
  totalCardCollected: number;
  totalReceiptsCount: number;
  physicalCashCounted: number;
  discrepancy: number; // positive = surplus, negative = short
  notes?: string;
  verifiedByAdmin?: string;
  verifiedAt?: string;
  createdAt: string;
}

// Student Lifecycle Audit
export interface StudentLifecycleEvent {
  lifecycleId: string;
  studentId: string;
  fromStatus: StudentStatus;
  toStatus: StudentStatus;
  reason: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
}

// Device & Session
export interface UserSessionDevice {
  sessionId: string;
  userId: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET';
  browser: string;
  os: string;
  ipAddress?: string;
  locationEstimate?: string;
  lastActive: string;
  isCurrent: boolean;
}

// Custom Report Builder Types
export type ReportDataSource = 'STUDENTS' | 'ATTENDANCE' | 'FEES' | 'RECEIPTS' | 'EXAMS' | 'CLASSES';

export interface ReportFilterCriteria {
  dataSource: ReportDataSource;
  dateFrom?: string;
  dateTo?: string;
  grade?: string;
  classId?: string;
  status?: string;
  selectedColumns: string[];
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  groupBy?: string;
}
