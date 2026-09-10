import { AttendanceAlertItem, AttendanceAlertConfig } from '../types';
import { storageService } from './storageService';

const STORAGE_KEYS = {
  ALERT_CONFIG: 'eap_attendance_alert_config',
  DISMISSED_ALERTS: 'eap_dismissed_attendance_alerts',
};

export const attendanceAlertService = {
  getConfig(): AttendanceAlertConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ALERT_CONFIG);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      alertAbsent: true,
      alertRepeatedlyLate: true,
      repeatedLateThreshold: 3,
      lowAttendanceThreshold: 75,
      consecutiveAbsenceThreshold: 2,
    };
  },

  saveConfig(config: AttendanceAlertConfig): void {
    localStorage.setItem(STORAGE_KEYS.ALERT_CONFIG, JSON.stringify(config));
  },

  getDismissedAlertIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DISMISSED_ALERTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  },

  dismissAlert(alertId: string): void {
    const dismissed = this.getDismissedAlertIds();
    if (!dismissed.includes(alertId)) {
      dismissed.push(alertId);
      localStorage.setItem(STORAGE_KEYS.DISMISSED_ALERTS, JSON.stringify(dismissed));
    }
  },

  // Generate Real Attendance Alerts from current Firestore/LocalStorage records
  generateAlerts(): AttendanceAlertItem[] {
    const config = this.getConfig();
    const dismissed = this.getDismissedAlertIds();
    const students = storageService.getStudents(false).filter(s => s.status === 'ACTIVE');
    const attendance = storageService.getAttendance();
    const todayStr = new Date().toISOString().split('T')[0];

    const alerts: AttendanceAlertItem[] = [];

    students.forEach(student => {
      const studentRecords = attendance.filter(a => a.studentId === student.studentId);
      if (studentRecords.length === 0) return;

      // 1. Absent Today Alert
      if (config.alertAbsent) {
        const todayRecord = studentRecords.find(a => a.date === todayStr);
        if (todayRecord && todayRecord.status === 'ABSENT') {
          const alertId = `ALERT-ABSENT-${student.studentId}-${todayStr}`;
          if (!dismissed.includes(alertId)) {
            alerts.push({
              alertId,
              studentId: student.studentId,
              studentName: student.fullName,
              parentPhone: student.parentPhone,
              whatsApp: student.whatsApp,
              className: student.className,
              type: 'ABSENT',
              description: `Absent for today's scheduled session (${todayRecord.className || student.className}).`,
              generatedAt: todayRecord.markedAt || new Date().toISOString(),
              isDismissed: false,
            });
          }
        }
      }

      // 2. Repeatedly Late Alert (late >= threshold)
      if (config.alertRepeatedlyLate) {
        const lateRecords = studentRecords.filter(a => a.status === 'LATE');
        if (lateRecords.length >= config.repeatedLateThreshold) {
          const alertId = `ALERT-LATE-${student.studentId}-${lateRecords.length}`;
          if (!dismissed.includes(alertId)) {
            alerts.push({
              alertId,
              studentId: student.studentId,
              studentName: student.fullName,
              parentPhone: student.parentPhone,
              whatsApp: student.whatsApp,
              className: student.className,
              type: 'REPEATED_LATE',
              description: `Recorded late arrival ${lateRecords.length} times across recent academy sessions.`,
              generatedAt: new Date().toISOString(),
              isDismissed: false,
            });
          }
        }
      }

      // 3. Low Attendance Rate (< configured threshold)
      const totalSessions = studentRecords.length;
      const presentCount = studentRecords.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      const rate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

      if (totalSessions >= 4 && rate < config.lowAttendanceThreshold) {
        const alertId = `ALERT-LOWRATE-${student.studentId}-${rate}`;
        if (!dismissed.includes(alertId)) {
          alerts.push({
            alertId,
            studentId: student.studentId,
            studentName: student.fullName,
            parentPhone: student.parentPhone,
            whatsApp: student.whatsApp,
            className: student.className,
            type: 'LOW_RATE',
            description: `Cumulative attendance is ${rate}%, which is below the academy required threshold (${config.lowAttendanceThreshold}%).`,
            generatedAt: new Date().toISOString(),
            isDismissed: false,
          });
        }
      }

      // 4. Consecutive Absences
      if (studentRecords.length >= config.consecutiveAbsenceThreshold) {
        const sorted = [...studentRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const recent = sorted.slice(0, config.consecutiveAbsenceThreshold);
        const allRecentAbsent = recent.every(r => r.status === 'ABSENT');

        if (allRecentAbsent) {
          const alertId = `ALERT-CONSEC-${student.studentId}-${recent[0].date}`;
          if (!dismissed.includes(alertId)) {
            alerts.push({
              alertId,
              studentId: student.studentId,
              studentName: student.fullName,
              parentPhone: student.parentPhone,
              whatsApp: student.whatsApp,
              className: student.className,
              type: 'CONSECUTIVE_ABSENCE',
              description: `Recorded ${config.consecutiveAbsenceThreshold} consecutive unexcused absences.`,
              generatedAt: new Date().toISOString(),
              isDismissed: false,
            });
          }
        }
      }
    });

    return alerts;
  },

  // Generates safe WhatsApp link with respectful pre-filled academic notification
  generateWhatsAppAlertLink(alert: AttendanceAlertItem, academyName: string): string {
    const cleanPhone = (alert.whatsApp || alert.parentPhone || '').replace(/[^0-9]/g, '');
    let msg = '';

    if (alert.type === 'ABSENT') {
      msg = `Dear Parent/Guardian,\n\nThis is an attendance notice from ${academyName}. Your child ${alert.studentName} (${alert.studentId}) was marked absent for today's session in ${alert.className}.\n\nIf this was an authorized absence or if you require homework materials, please reply to this message. Thank you.`;
    } else if (alert.type === 'REPEATED_LATE') {
      msg = `Dear Parent/Guardian,\n\nGreetings from ${academyName}. We would like to inform you that ${alert.studentName} has arrived late for multiple recent English sessions in ${alert.className}. To ensure full participation in the opening grammar drills, we kindly request timely arrival. Thank you.`;
    } else if (alert.type === 'LOW_RATE') {
      msg = `Dear Parent/Guardian,\n\nNotice from ${academyName}: ${alert.studentName}'s attendance has fallen below the 75% term requirement. Regular class attendance is essential for syllabus completion and term certificate eligibility. Please contact our academic coordinator if assistance is needed.`;
    } else {
      msg = `Dear Parent/Guardian,\n\nThis is an attendance update from ${academyName} regarding ${alert.studentName} (${alert.className}). Please contact the academy office regarding recent class absences to coordinate makeup materials. Thank you.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  },
};
