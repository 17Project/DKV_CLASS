import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Student, SchoolSettings } from '../types/student.ts';

export function exportClassReportPDF(students: Student[], settings?: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const schoolName = settings?.schoolName || 'SMK NEGERI KREATIF NUSANTARA';
  const className = settings?.className || 'XII DKV';
  const academicYear = settings?.academicYear || '2026/2027';

  // Header / Kop Surat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(schoolName.toUpperCase(), pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`PROGRAM KEAHLIAN ${className}`.toUpperCase(), pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`LAPORAN BIODATA SISWA ${className.toUpperCase()} - TAHUN AJARAN ${academicYear}`, pageWidth / 2, 26, { align: 'center' });

  doc.setLineWidth(0.6);
  doc.line(14, 29, pageWidth - 14, 29);
  doc.setLineWidth(0.2);
  doc.line(14, 30, pageWidth - 14, 30);

  // Metadata info
  const completedCount = students.filter((s) => s.isCompleted).length;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Siswa: ${students.length} Orang   |   Sudah Mengisi: ${completedCount} Siswa   |   Belum Mengisi: ${students.length - completedCount} Siswa`, 14, 35);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 14, 35, { align: 'right' });

  // Table Data preparation
  const tableRows = students.map((s) => {
    // Format siblings details
    let siblingsText = '-';
    if (s.saudara && s.saudara.length > 0) {
      siblingsText = s.saudara
        .map((sib, i) => `${i + 1}. ${sib.nama} [${sib.statusPendidikan}] (${sib.tempatPendidikan || '-'})`)
        .join('\n');
    }

    return [
      s.no,
      s.nama,
      `${s.tempatLahir || '-'}${s.tanggalLahir ? ', ' + s.tanggalLahir : ''}`,
      s.alamat || '-',
      s.noHpWhatsapp || '-',
      s.namaWali ? `${s.namaWali}\n(${s.noHpWhatsappWali || '-'})` : '-',
      s.jumlahSaudara || (s.saudara ? s.saudara.length : 0),
      siblingsText,
      s.isCompleted ? 'Lengkap' : 'Belum',
    ];
  });

  autoTable(doc, {
    startY: 38,
    head: [
      [
        'NO',
        'NAMA SISWA',
        'TEMPAT, TGL LAHIR',
        'ALAMAT',
        'NO HP / WA',
        'NAMA WALI / NO HP',
        'JML SAUDARA',
        'DATA SAUDARA (STATUS & TEMPAT PENDIDIKAN)',
        'STATUS',
      ],
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 64, 175], // Royal blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      valign: 'middle',
      textColor: [30, 30, 30],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // NO
      1: { cellWidth: 36, fontStyle: 'bold' }, // NAMA
      2: { cellWidth: 32 }, // TTL
      3: { cellWidth: 42 }, // ALAMAT
      4: { cellWidth: 26 }, // NO HP
      5: { cellWidth: 32 }, // WALI
      6: { cellWidth: 14, halign: 'center' }, // JML
      7: { cellWidth: 62 }, // SAUDARA
      8: { cellWidth: 15, halign: 'center' }, // STATUS
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer page numbers
      const str = `Halaman ${data.pageNumber}`;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(str, pageWidth - 20, doc.internal.pageSize.getHeight() - 8);
    },
  });

  // Signature Block at the end
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 160;
  if (finalY + 35 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
  }
  const signY = (doc as any).lastAutoTable && finalY + 35 <= doc.internal.pageSize.getHeight() ? finalY : 20;

  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'normal');

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.text(`Mengetahui,`, 30, signY);
  doc.text(`Kepala Program Keahlian`, 30, signY + 5);
  doc.text(`( ${settings?.headOfProgramName || '..................................................'} )`, 30, signY + 25);
  doc.text(`NIP. ${settings?.headOfProgramNip || '...............................................'}`, 30, signY + 30);

  doc.text(`Ditetapkan pada: ${todayStr}`, pageWidth - 90, signY);
  doc.text(`Wali Kelas ${settings?.className || 'XII DKV'}`, pageWidth - 90, signY + 5);
  doc.text(`( ${settings?.waliKelasName || '..................................................'} )`, pageWidth - 90, signY + 25);
  doc.text(`NIP. ${settings?.waliKelasNip || '...............................................'}`, pageWidth - 90, signY + 30);

  const safeName = (settings?.schoolName || 'DKV').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`LAPORAN_BIODATA_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportSingleStudentPDF(student: Student, settings?: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const schoolName = settings?.schoolName || 'SMK NEGERI KREATIF NUSANTARA';
  const className = settings?.className || 'XII DKV (Desain Komunikasi Visual)';
  const academicYear = settings?.academicYear || '2026/2027';

  // Kop Surat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(schoolName.toUpperCase(), pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`KOMPETENSI KEAHLIAN ${className}`.toUpperCase(), pageWidth / 2, 21, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`LEMBAR BIODATA INDIVIDU SISWA TAHUN AJARAN ${academicYear}`, pageWidth / 2, 27, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(15, 30, pageWidth - 15, 30);
  doc.setLineWidth(0.2);
  doc.line(15, 31, pageWidth - 15, 31);

  let curY = 40;

  // Section 1: Data Siswa
  doc.setFillColor(238, 242, 255);
  doc.rect(15, curY, pageWidth - 30, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('A. DATA PRIBADI SISWA', 18, curY + 5);
  curY += 12;

  const personalData = [
    ['Nomor Urut Presensi', `: ${student.no}`],
    ['Nama Lengkap Siswa', `: ${student.nama}`],
    ['Kelas / Program', `: XII DKV (Desain Komunikasi Visual)`],
    ['Tempat Lahir', `: ${student.tempatLahir || '-'}`],
    ['Tanggal Lahir', `: ${student.tanggalLahir || '-'}`],
    ['Alamat Tempat Tinggal', `: ${student.alamat || '-'}`],
    ['Nomor HP / WhatsApp Siswa', `: ${student.noHpWhatsapp || '-'}`],
  ];

  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  personalData.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, curY);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 75, curY);
    curY += 6;
  });

  curY += 4;

  // Section 2: Data Wali
  doc.setFillColor(238, 242, 255);
  doc.rect(15, curY, pageWidth - 30, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('B. DATA ORANG TUA / WALI', 18, curY + 5);
  curY += 12;

  const parentData = [
    ['Nama Orang Tua / Wali', `: ${student.namaWali || '-'}`],
    ['Nomor HP / WhatsApp Wali', `: ${student.noHpWhatsappWali || '-'}`],
  ];

  parentData.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, curY);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 75, curY);
    curY += 6;
  });

  curY += 4;

  // Section 3: Data Saudara Siswa
  doc.setFillColor(238, 242, 255);
  doc.rect(15, curY, pageWidth - 30, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text(`C. DATA SAUDARA SISWA (JUMLAH: ${student.jumlahSaudara || (student.saudara ? student.saudara.length : 0)} ORANG)`, 18, curY + 5);
  curY += 10;

  if (student.saudara && student.saudara.length > 0) {
    const siblingRows = student.saudara.map((sib, i) => [
      i + 1,
      sib.nama || '-',
      sib.statusPendidikan,
      sib.tempatPendidikan || '-',
    ]);

    autoTable(doc, {
      startY: curY,
      head: [['No', 'Nama Saudara', 'Status Pendidikan Saat Ini', 'Tempat Pendidikan Saat Ini']],
      body: siblingRows,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 55 },
        2: { cellWidth: 45, halign: 'center' },
        3: { cellWidth: 70 },
      },
      margin: { left: 15, right: 15 },
    });

    curY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 12 : curY + 40;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('(Tidak ada data saudara kandung)', 20, curY + 3);
    curY += 14;
  }

  // Signature Block
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Tanggal Cetak: ${todayStr}`, pageWidth - 70, curY);
  doc.text(`Siswa yang bersangkutan,`, pageWidth - 70, curY + 6);
  doc.text(`( ${student.nama} )`, pageWidth - 70, curY + 28);

  doc.text(`Mengetahui,`, 20, curY);
  doc.text(`Orang Tua / Wali Siswa,`, 20, curY + 6);
  doc.text(`( ${student.namaWali || '...........................................'} )`, 20, curY + 28);

  doc.save(`BIODATA_${student.nama.replace(/\s+/g, '_')}_XII_DKV.pdf`);
}
