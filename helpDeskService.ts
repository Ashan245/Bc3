import { HelpDeskTicket, TicketCategory, TicketPriority, TicketStatus, UserRole } from '../types';
import { storageService } from './storageService';

const STORAGE_KEYS = {
  HELP_DESK_TICKETS: 'eap_help_desk_tickets',
};

const defaultSampleTickets: HelpDeskTicket[] = [
  {
    ticketId: 'TCK-001',
    ticketNumber: 'TKT-2026-081',
    title: 'Duplicate Fee Receipt Query for August 2026',
    description: 'Parent made a bank transfer on 28th August and paid cash at counter on 30th August. Needs verification and credit adjustment toward September.',
    category: 'PAYMENT',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    submittedBy: 'USR-PARENT-01',
    submittedByName: 'Mr. Sunil Perera (Parent)',
    submittedByRole: 'PARENT',
    assignedStaffId: 'USR-STAFF-01',
    assignedStaffName: 'Niroshan Bandara (Cashier)',
    comments: [
      {
        commentId: 'COM-01',
        authorName: 'Niroshan Bandara (Cashier)',
        authorRole: 'STAFF',
        text: 'Checked counter ledger. Bank slip was confirmed and verified. Adjusting credit of LKR 3,500 toward September billing.',
        createdAt: '2026-09-08T11:20:00.000Z',
      },
    ],
    createdAt: '2026-09-08T09:15:00.000Z',
    updatedAt: '2026-09-08T11:20:00.000Z',
  },
  {
    ticketId: 'TCK-002',
    ticketNumber: 'TKT-2026-082',
    title: 'Damaged Student ID Card QR Code Replacement',
    description: 'Physical laminated student card was bent and QR scanner cannot read it during morning check-in. Requesting urgent reprint.',
    category: 'ACCOUNT',
    priority: 'MEDIUM',
    status: 'OPEN',
    submittedBy: 'STU-000002',
    submittedByName: 'Fathima Nuha (Student)',
    submittedByRole: 'STUDENT',
    comments: [],
    createdAt: '2026-09-09T08:45:00.000Z',
    updatedAt: '2026-09-09T08:45:00.000Z',
  },
  {
    ticketId: 'TCK-003',
    ticketNumber: 'TKT-2026-083',
    title: 'Audio File Not Playing on Lesson 3 Pronunciation Guide',
    description: 'The IPA vowel sound practice mp3 link gives a playback codec message on iOS Safari browser.',
    category: 'TECHNICAL',
    priority: 'LOW',
    status: 'RESOLVED',
    submittedBy: 'USR-TEACHER-02',
    submittedByName: 'Mrs. Devika Senaratne',
    submittedByRole: 'TEACHER',
    assignedStaffId: 'USR-ADMIN-01',
    assignedStaffName: 'Registrar & IT Admin',
    comments: [
      {
        commentId: 'COM-02',
        authorName: 'Registrar & IT Admin',
        authorRole: 'ADMIN',
        text: 'Re-encoded audio asset to AAC/MP3 128kbps stereo web-optimized format. Playback verified on Mobile Safari.',
        createdAt: '2026-09-09T14:10:00.000Z',
      },
    ],
    resolution: 'Re-encoded audio file to standard AAC Web Audio compatible container.',
    resolvedAt: '2026-09-09T14:10:00.000Z',
    createdAt: '2026-09-09T10:00:00.000Z',
    updatedAt: '2026-09-09T14:10:00.000Z',
  },
];

export const helpDeskService = {
  getTickets(): HelpDeskTicket[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HELP_DESK_TICKETS);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(STORAGE_KEYS.HELP_DESK_TICKETS, JSON.stringify(defaultSampleTickets));
    return defaultSampleTickets;
  },

  createTicket(params: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    submittedBy: string;
    submittedByName: string;
    submittedByRole: UserRole;
  }): HelpDeskTicket {
    const tickets = this.getTickets();
    const count = tickets.length + 84;
    const newTicket: HelpDeskTicket = {
      ticketId: `TCK-${Date.now()}`,
      ticketNumber: `TKT-2026-${String(count).padStart(3, '0')}`,
      title: params.title,
      description: params.description,
      category: params.category,
      priority: params.priority,
      status: 'OPEN',
      submittedBy: params.submittedBy,
      submittedByName: params.submittedByName,
      submittedByRole: params.submittedByRole,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tickets.unshift(newTicket);
    localStorage.setItem(STORAGE_KEYS.HELP_DESK_TICKETS, JSON.stringify(tickets));

    storageService.logAudit({
      actor: params.submittedByName,
      actorRole: params.submittedByRole,
      action: 'TICKET_CREATED',
      entityType: 'HELP_DESK',
      entityId: newTicket.ticketNumber,
      details: `Created ticket: "${params.title}" (${params.category} - ${params.priority})`,
    });

    return newTicket;
  },

  addComment(params: {
    ticketId: string;
    authorName: string;
    authorRole: UserRole;
    text: string;
  }): boolean {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.ticketId === params.ticketId);
    if (!ticket) return false;

    ticket.comments.push({
      commentId: `COM-${Date.now()}`,
      authorName: params.authorName,
      authorRole: params.authorRole,
      text: params.text,
      createdAt: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.HELP_DESK_TICKETS, JSON.stringify(tickets));
    return true;
  },

  updateTicketStatus(params: {
    ticketId: string;
    status: TicketStatus;
    resolution?: string;
    actorName: string;
    actorRole: UserRole;
    assignedStaffName?: string;
  }): boolean {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.ticketId === params.ticketId);
    if (!ticket) return false;

    ticket.status = params.status;
    if (params.assignedStaffName) {
      ticket.assignedStaffName = params.assignedStaffName;
    }
    if (params.resolution) {
      ticket.resolution = params.resolution;
      ticket.resolvedAt = new Date().toISOString();
    }
    ticket.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.HELP_DESK_TICKETS, JSON.stringify(tickets));

    storageService.logAudit({
      actor: params.actorName,
      actorRole: params.actorRole,
      action: 'TICKET_STATUS_UPDATED',
      entityType: 'HELP_DESK',
      entityId: ticket.ticketNumber,
      details: `Ticket status set to ${params.status}. Resolution: ${params.resolution || 'None specified'}`,
    });

    return true;
  },
};
