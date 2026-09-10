import { AcademyCalendarEvent, TimetableConflict, AcademyClass } from '../types';
import { storageService } from './storageService';

const STORAGE_KEYS = {
  CALENDAR_EVENTS: 'eap_calendar_events',
};

const defaultSampleEvents: AcademyCalendarEvent[] = [
  {
    eventId: 'EVT-001',
    title: 'Grade 8 Saturday Morning Elite',
    description: 'Weekly scheduled session covering Comparative and Superlative Adjectives with spoken debate.',
    type: 'CLASS',
    date: '2026-09-12',
    startTime: '08:30',
    endTime: '10:30',
    classId: 'CLS-G08-SAT',
    className: 'Grade 8 - Saturday Morning Elite',
    grade: 'Grade 8',
    teacherId: 'TCH-001',
    teacherName: 'Dr. Arthur Wickramasinghe',
    room: 'Hall A (Smart Room 1)',
    targetAudience: 'ALL',
    status: 'CONFIRMED',
    createdBy: 'System Timetable',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    eventId: 'EVT-002',
    title: 'Grade 6 Saturday Foundations',
    description: 'Weekly grammar mastery session on irregular past verbs and spelling drills.',
    type: 'CLASS',
    date: '2026-09-12',
    startTime: '11:00',
    endTime: '13:00',
    classId: 'CLS-G06-SAT',
    className: 'Grade 6 - Saturday Foundations',
    grade: 'Grade 6',
    teacherId: 'TCH-002',
    teacherName: 'Mrs. Devika Senaratne',
    room: 'Hall B',
    targetAudience: 'ALL',
    status: 'CONFIRMED',
    createdBy: 'System Timetable',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    eventId: 'EVT-003',
    title: 'Term 2 Mid-Evaluation Paper',
    description: 'Comprehensive written paper: Reading comprehension, Vocabulary & Formal Letter Composition.',
    type: 'EXAM',
    date: '2026-09-19',
    startTime: '09:00',
    endTime: '11:00',
    classId: 'CLS-G08-SAT',
    className: 'Grade 8 - Saturday Morning Elite',
    grade: 'Grade 8',
    teacherId: 'TCH-001',
    teacherName: 'Dr. Arthur Wickramasinghe',
    room: 'Main Examination Auditorium',
    priority: 'HIGH',
    targetAudience: 'ALL',
    status: 'CONFIRMED',
    createdBy: 'Examination Directorate',
    createdAt: '2026-09-02T00:00:00.000Z',
  },
  {
    eventId: 'EVT-004',
    title: 'Milad-un-Nabi Public Holiday',
    description: 'Academy closed for national religious observance. All regular classes suspended.',
    type: 'HOLIDAY',
    date: '2026-09-16',
    startTime: '00:00',
    endTime: '23:59',
    isAllDay: true,
    targetAudience: 'ALL',
    status: 'CONFIRMED',
    createdBy: 'Registrar Office',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    eventId: 'EVT-005',
    title: 'Homework Deadline: Conditional Clauses Essay',
    description: 'Final submission deadline on LMS portal for 250-word conditional essay.',
    type: 'HOMEWORK_DEADLINE',
    date: '2026-09-18',
    startTime: '23:59',
    endTime: '23:59',
    classId: 'CLS-G08-SAT',
    className: 'Grade 8 - Saturday Morning Elite',
    grade: 'Grade 8',
    targetAudience: 'STUDENTS',
    status: 'CONFIRMED',
    createdBy: 'Mr. David Perera',
    createdAt: '2026-09-08T00:00:00.000Z',
  },
  {
    eventId: 'EVT-006',
    title: 'Staff Academic Strategy Meeting',
    description: 'Monthly pedagogical review and curriculum pacing assessment for upcoming term exams.',
    type: 'TEACHER_MEETING',
    date: '2026-09-14',
    startTime: '14:30',
    endTime: '16:00',
    room: 'Board Room',
    targetAudience: 'TEACHERS',
    status: 'CONFIRMED',
    createdBy: 'Academy Principal',
    createdAt: '2026-09-05T00:00:00.000Z',
  },
];

export const calendarService = {
  getEvents(): AcademyCalendarEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    // Seed initial
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(defaultSampleEvents));
    return defaultSampleEvents;
  },

  createEvent(event: Omit<AcademyCalendarEvent, 'eventId' | 'createdAt'>): AcademyCalendarEvent {
    const events = this.getEvents();
    const newEvent: AcademyCalendarEvent = {
      ...event,
      eventId: `EVT-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
    return newEvent;
  },

  updateEvent(eventId: string, updates: Partial<AcademyCalendarEvent>): boolean {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.eventId === eventId);
    if (idx === -1) return false;
    events[idx] = { ...events[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
    return true;
  },

  deleteEvent(eventId: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter(e => e.eventId !== eventId);
    if (filtered.length === events.length) return false;
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(filtered));
    return true;
  },

  // Timetable Conflict Detection Engine
  detectConflicts(classes?: AcademyClass[]): TimetableConflict[] {
    const classList = classes || storageService.getClasses();
    const conflicts: TimetableConflict[] = [];

    // Helper: convert HH:mm to minutes
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    // Check teacher and room overlaps on the same day
    for (let i = 0; i < classList.length; i++) {
      const c1 = classList[i];
      const start1 = toMinutes(c1.startTime);
      const end1 = toMinutes(c1.endTime);

      for (let j = i + 1; j < classList.length; j++) {
        const c2 = classList[j];
        if (c1.day !== c2.day) continue;

        const start2 = toMinutes(c2.startTime);
        const end2 = toMinutes(c2.endTime);

        // Check if times overlap
        const isOverlap = Math.max(start1, start2) < Math.min(end1, end2);

        if (isOverlap) {
          // Teacher conflict
          if (c1.teacherId === c2.teacherId) {
            conflicts.push({
              type: 'TEACHER_DOUBLE_BOOKING',
              description: `Teacher ${c1.teacherName} is scheduled simultaneously for "${c1.name}" (${c1.startTime}-${c1.endTime}) and "${c2.name}" (${c2.startTime}-${c2.endTime}) on ${c1.day}.`,
              affectedClassIds: [c1.classId, c2.classId],
              severity: 'BLOCKING',
            });
          }

          // Room conflict
          if (c1.room.trim().toLowerCase() === c2.room.trim().toLowerCase()) {
            conflicts.push({
              type: 'ROOM_DOUBLE_BOOKING',
              description: `Room "${c1.room}" is double-booked on ${c1.day} between "${c1.name}" and "${c2.name}".`,
              affectedClassIds: [c1.classId, c2.classId],
              severity: 'BLOCKING',
            });
          }
        }
      }

      // Check capacity validation against active enrolled students
      const enrolledCount = storageService.getStudents().filter(s => s.classId === c1.classId && s.status === 'ACTIVE').length;
      if (enrolledCount > c1.capacity) {
        conflicts.push({
          type: 'CAPACITY_EXCEEDED',
          description: `Class "${c1.name}" exceeds physical capacity: ${enrolledCount} active students enrolled for a room capacity of ${c1.capacity}.`,
          affectedClassIds: [c1.classId],
          severity: 'WARNING',
        });
      }
    }

    return conflicts;
  },
};
