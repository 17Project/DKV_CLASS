import * as XLSX from 'xlsx';
import type { Student, SchoolSettings } from '../types/student.ts';

export function exportStudentsToExcel(students: Student[], settings?: SchoolSettings, customFileName?: string) {
  const schoolName = settings?.schoolName || 'SMK';
  const fileName = customFileName || `BIODATA_${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  const maxSiblings = Math.max(5, ...students.map((s) => (s.saudara ? s.saudara.length : 0)));

  const rows: any[] = [];

  students.forEach((s) => {
    const row: Record<string, any> = {
      'NO': s.no,
      'NAMA': s.nama,
      'TEMPAT LAHIR': s.tempatLahir || '',
      'TANGGAL LAHIR': s.tanggalLahir || '',
      'ALAMAT': s.alamat || '',
      'NO HANDPHONE / WHATSAPP': s.noHpWhatsapp || '',
      'NAMA WALI': s.namaWali || '',
      'NO HANDPHONE / WHATSAPP WALI': s.noHpWhatsappWali || '',
      'JUMLAH SAUDARA': s.jumlahSaudara || (s.saudara ? s.saudara.length : 0),
    };

    // Sibling columns 1 to maxSiblings
    for (let i = 0; i < maxSiblings; i++) {
      const sib = s.saudara && s.saudara[i];
      const idx = i + 1;
      row[`NAMA SAUDARA (${idx})`] = sib ? sib.nama : '';
      row[`STATUS PENDIDIKAN SAUDARA (${idx})`] = sib ? sib.statusPendidikan : '';
      row[`TEMPAT PENDIDIKAN SAUDARA SAAT INI (${idx})`] = sib ? sib.tempatPendidikan : '';
    }

    row['STATUS PENGISIAN'] = s.isCompleted ? 'Lengkap' : 'Belum Lengkap';
    rows.push(row);
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set widths
  const keys = Object.keys(rows[0] || {});
  worksheet['!cols'] = keys.map((key) => {
    let max = key.length;
    rows.forEach((r) => {
      const val = String(r[key] || '');
      if (val.length > max) max = val.length;
    });
    return { wch: Math.min(Math.max(max + 2, 10), 38) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(workbook, fileName);
}
