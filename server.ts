import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import { Database } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  const db = Database.getInstance();

  app.use(express.json());

  // === API ROUTES ===

  // 1. Get all students
  app.get('/api/students', (req, res) => {
    try {
      const students = db.getStudents();
      res.json({ success: true, data: students });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Get student by ID
  app.get('/api/students/:id', (req, res) => {
    try {
      const student = db.getStudentById(req.params.id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
      }
      res.json({ success: true, data: student });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Update student data (by student or admin)
  app.put('/api/students/:id', (req, res) => {
    try {
      const updated = db.updateStudent(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
      }
      res.json({ success: true, data: updated, message: 'Biodata berhasil disimpan!' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Add new student
  app.post('/api/students', (req, res) => {
    try {
      if (!req.body.nama || !req.body.nama.trim()) {
        return res.status(400).json({ success: false, message: 'Nama siswa wajib diisi' });
      }
      const newStudent = db.addStudent(req.body);
      res.status(201).json({ success: true, data: newStudent, message: 'Siswa berhasil ditambahkan' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Delete student
  app.delete('/api/students/:id', (req, res) => {
    try {
      const success = db.deleteStudent(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
      }
      res.json({ success: true, message: 'Data siswa berhasil dihapus' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Admin Login
  app.post('/api/admin/login', (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password wajib diisi' });
      }
      const isValid = db.verifyAdminPassword(password);
      if (isValid) {
        // Return dummy auth token with timestamp
        const token = `admin_auth_${Date.now()}`;
        return res.json({ success: true, message: 'Login berhasil', token });
      } else {
        return res.status(401).json({ success: false, message: 'Password admin salah!' });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Admin Change Password
  app.post('/api/admin/change-password', (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi' });
      }
      const result = db.changeAdminPassword(oldPassword, newPassword);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Admin Reset Data
  app.post('/api/admin/reset', (req, res) => {
    try {
      const { mode, password } = req.body;
      if (!password || !db.verifyAdminPassword(password)) {
        return res.status(401).json({ success: false, message: 'Konfirmasi password admin salah!' });
      }
      const result = db.resetData(mode || 'default');
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. Admin Stats
  app.get('/api/admin/stats', (req, res) => {
    try {
      const stats = db.getStats();
      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 10. School & Wali Kelas Settings
  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.getSettings();
      res.json({ success: true, data: settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json({
        success: true,
        data: updated,
        message: 'Pengaturan nama sekolah dan wali kelas berhasil disimpan!',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 11. Export to Excel
  app.get('/api/export/excel', (req, res) => {
    try {
      const students = db.getStudents();
      const settings = db.getSettings();

      // Find maximum siblings count (at least 5 to match original sheet format)
      const maxSiblings = Math.max(5, ...students.map((s) => (s.saudara ? s.saudara.length : 0)));

      // Build header row 1 & row 2
      const excelRows: any[] = [];

      students.forEach((s) => {
        const row: Record<string, any> = {
          'NO': s.no,
          'NAMA SISWA': s.nama,
          'TEMPAT LAHIR': s.tempatLahir || '-',
          'TANGGAL LAHIR': s.tanggalLahir || '-',
          'ALAMAT': s.alamat || '-',
          'NO HP / WA SISWA': s.noHpWhatsapp || '-',
          'NAMA WALI': s.namaWali || '-',
          'NO HP / WA WALI': s.noHpWhatsappWali || '-',
          'JUMLAH SAUDARA': s.jumlahSaudara || (s.saudara ? s.saudara.length : 0),
        };

        // Populate Sibling columns 1..maxSiblings
        for (let i = 0; i < maxSiblings; i++) {
          const sib = s.saudara && s.saudara[i];
          const num = i + 1;
          row[`NAMA SAUDARA (${num})`] = sib ? sib.nama : '-';
          row[`STATUS PENDIDIKAN SAUDARA (${num})`] = sib ? sib.statusPendidikan : '-';
          row[`TEMPAT PENDIDIKAN SAUDARA (${num})`] = sib ? sib.tempatPendidikan : '-';
        }

        row['STATUS PENGISIAN'] = s.isCompleted ? 'Lengkap' : 'Belum Lengkap';
        excelRows.push(row);
      });

      const worksheet = XLSX.utils.json_to_sheet(excelRows);

      // Auto column width calculation
      const colWidths = Object.keys(excelRows[0] || {}).map((key) => {
        let maxLen = key.length;
        excelRows.forEach((r) => {
          const val = String(r[key] || '');
          if (val.length > maxLen) maxLen = val.length;
        });
        return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
      });
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Biodata Siswa');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const safeSchoolName = (settings.schoolName || 'SMK').replace(/[^a-zA-Z0-9]/g, '_');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="BIODATA_${safeSchoolName}_${new Date().toISOString().slice(0, 10)}.xlsx"`
      );
      res.send(buffer);
    } catch (err: any) {
      console.error('Export error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // === STATIC ASSETS & VITE INTEGRATION ===
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
