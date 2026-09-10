import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Receipt, Student, AcademySettings } from '../types';

export const pdfService = {
  /**
   * Generates a data URL or image for a QR string
   */
  async generateQRDataUrl(text: string, size: number = 200): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: size,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('Error generating QR Data URL:', err);
      return '';
    }
  },

  /**
   * Generates and downloads an official academy payment receipt PDF
   */
  async downloadReceiptPDF(receipt: Receipt, settings: AcademySettings): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5', // A5 is standard for formal receipts
    });

    const qrDataUrl = await this.generateQRDataUrl(receipt.verificationQrToken || receipt.receiptNumber, 150);

    // Header Background Accent
    doc.setFillColor(30, 58, 138); // Navy blue (#1e3a8a)
    doc.rect(0, 0, 148, 28, 'F');

    // Academy Branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(settings.academyName, 12, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(220, 230, 255);
    doc.text(settings.tagline || 'Excellence in English Language Education', 12, 17);
    doc.text(`${settings.address} | Tel: ${settings.phone}`, 12, 22);

    // Receipt Badge
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(100, 6, 38, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text('OFFICIAL RECEIPT', 103, 12);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(receipt.receiptNumber, 103, 18);

    // Meta Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text('Date:', 12, 36);
    doc.text('Payment Method:', 75, 36);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(receipt.date, 25, 36);
    doc.text(receipt.paymentMethod, 105, 36);

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(12, 40, 136, 40);

    // Student Information Block
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(12, 43, 124, 24, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('STUDENT NAME', 16, 49);
    doc.text('STUDENT ID', 80, 49);
    doc.text('GRADE / CLASS', 16, 61);
    doc.text('BILLING MONTH', 80, 61);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(receipt.studentName, 16, 55);
    doc.text(receipt.studentId, 80, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`${receipt.grade} (${receipt.className})`, 16, 66);
    doc.text(receipt.billingMonth, 80, 66);

    // Financial Breakdown Table
    let y = 74;
    doc.setFillColor(241, 245, 249);
    doc.rect(12, y, 124, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('DESCRIPTION', 16, y + 5.5);
    doc.text('AMOUNT (LKR)', 105, y + 5.5);

    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Monthly Tuition Fee - ${receipt.billingMonth}`, 16, y);
    doc.text(receipt.amount.toLocaleString(), 134, y, { align: 'right' });

    if (receipt.discount > 0) {
      y += 6;
      doc.setTextColor(22, 101, 52);
      doc.text('Scholarship / Fee Discount', 16, y);
      doc.text(`- ${receipt.discount.toLocaleString()}`, 134, y, { align: 'right' });
    }

    y += 6;
    doc.line(12, y, 136, y);

    // Paid & Balance
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text('AMOUNT PAID NOW:', 60, y);
    doc.text(`Rs. ${receipt.paid.toLocaleString()}`, 134, y, { align: 'right' });

    y += 6;
    doc.setFontSize(9);
    if (receipt.balance > 0) {
      doc.setTextColor(185, 28, 28);
      doc.text('OUTSTANDING BALANCE:', 60, y);
      doc.text(`Rs. ${receipt.balance.toLocaleString()}`, 134, y, { align: 'right' });
    } else {
      doc.setTextColor(22, 101, 52);
      doc.text('PAYMENT STATUS:', 60, y);
      doc.text('FULLY PAID (NIL BALANCE)', 134, y, { align: 'right' });
    }

    // QR Verification & Signatures
    y += 14;
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 14, y, 26, 26);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Scan to verify authentic receipt', 14, y + 29);
    }

    // Signature line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Issued By: ${receipt.recordedBy}`, 75, y + 10);
    doc.line(75, y + 22, 132, y + 22);
    doc.setFontSize(7);
    doc.text('Authorized Signature & Academy Stamp', 75, y + 26);

    // Footer terms
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(settings.receiptFooter || 'Fees once paid are non-refundable.', 12, 195);
    doc.text('Generated by English Academy Pro Management System', 12, 199);

    doc.save(`Receipt_${receipt.receiptNumber}.pdf`);
  },

  /**
   * Generates and downloads a Student ID Card PDF
   */
  async downloadStudentIDCardPDF(student: Student, qrCode: string, settings: AcademySettings): Promise<void> {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98], // Standard CR80 credit card size
    });

    const qrDataUrl = await this.generateQRDataUrl(qrCode, 180);

    // Background gradient header
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 85.6, 14, 'F');

    // Academy title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(settings.academyName, 4, 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(219, 234, 254);
    doc.text('STUDENT IDENTIFICATION CARD', 4, 10);

    // Student details
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(student.fullName, 4, 21);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(71, 85, 105);
    doc.text('ID:', 4, 26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(student.studentId, 12, 26);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Grade:', 4, 30);
    doc.setTextColor(15, 23, 42);
    doc.text(student.grade, 14, 30);

    doc.setTextColor(71, 85, 105);
    doc.text('Class:', 4, 34);
    doc.setTextColor(15, 23, 42);
    doc.text(student.className.substring(0, 26), 14, 34);

    doc.setTextColor(71, 85, 105);
    doc.text('School:', 4, 38);
    doc.setTextColor(15, 23, 42);
    doc.text(student.school.substring(0, 26), 14, 38);

    doc.setTextColor(71, 85, 105);
    doc.text('Emergency:', 4, 42);
    doc.setTextColor(185, 28, 28);
    doc.text(student.emergencyContact || student.parentPhone, 18, 42);

    // QR Code
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 56, 17, 26, 26);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5);
      doc.setTextColor(100, 116, 139);
      doc.text('Scan for Attendance', 57, 45);
    }

    // Bottom banner
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 48, 85.6, 6, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Property of ${settings.academyName} | Tel: ${settings.phone}`, 4, 52);

    doc.save(`IDCard_${student.studentId}.pdf`);
  },

  /**
   * Generates a WhatsApp share deep-link with formatted receipt text
   */
  getWhatsAppShareUrl(receipt: Receipt, studentPhone?: string, academyName: string = 'English Academy Pro'): string {
    const text = encodeURIComponent(
      `*${academyName} - PAYMENT RECEIPT*\n` +
      `--------------------------------\n` +
      `Receipt No: *${receipt.receiptNumber}*\n` +
      `Student: *${receipt.studentName}* (${receipt.studentId})\n` +
      `Class: ${receipt.grade} - ${receipt.className}\n` +
      `Month: *${receipt.billingMonth}*\n` +
      `--------------------------------\n` +
      `Fee Amount: Rs. ${receipt.amount.toLocaleString()}\n` +
      `Amount Paid: *Rs. ${receipt.paid.toLocaleString()}*\n` +
      `Balance Due: *Rs. ${receipt.balance.toLocaleString()}*\n` +
      `Payment Method: ${receipt.paymentMethod}\n` +
      `Date: ${receipt.date}\n` +
      `Issued By: ${receipt.recordedBy}\n` +
      `--------------------------------\n` +
      `Verify Receipt: ${receipt.verificationQrToken}\n` +
      `_Thank you for your valued payment!_`
    );

    const cleanPhone = studentPhone ? studentPhone.replace(/[^0-9]/g, '') : '';
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${text}`;
    }
    return `https://api.whatsapp.com/send?text=${text}`;
  },
};
