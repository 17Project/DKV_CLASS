import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { Student, Sibling, ClassStats, SchoolSettings } from '../src/types/student.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'SMK NEGERI KREATIF NUSANTARA',
  className: 'XII DKV (Desain Komunikasi Visual)',
  academicYear: '2026/2027',
  waliKelasName: 'Drs. H. Mulyadi, M.Pd.',
  waliKelasNip: '19780512 200312 1 004',
  headOfProgramName: 'Budi Santoso, S.Sn., M.Ds.',
  headOfProgramNip: '19820719 200801 1 007',
};

interface DatabaseSchema {
  adminPasswordHash: string;
  adminPasswordSalt: string;
  students: Student[];
  settings?: SchoolSettings;
  lastUpdated: string;
}

export const INITIAL_STUDENT_NAMES = [
  'AURA CANDRA DEWI',
  'CELLY CAKRAWATI',
  'DAVID',
  'DELLYN',
  'DELVIN',
  'DINA SAFIRA RIAUNA ROMADHANI',
  'EVI JESSTINA',
  'EZRA',
  'MERLIN',
  'NABILA',
  'STEVEN',
  'TAURUS WINATA',
  'TRINETTA ANGELICA',
];

export function getDefaultStudents(): Student[] {
  return INITIAL_STUDENT_NAMES.map((nama, idx) => ({
    id: `std_${idx + 1}`,
    no: idx + 1,
    nama,
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHpWhatsapp: '',
    namaWali: '',
    noHpWhatsappWali: '',
    jumlahSaudara: 0,
    saudara: [],
    isCompleted: false,
    updatedAt: new Date().toISOString(),
    filledBy: undefined,
  }));
}

export function getSampleStudents(): Student[] {
  const samples: Student[] = [
    {
      id: 'std_1',
      no: 1,
      nama: 'AURA CANDRA DEWI',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2008-05-14',
      alamat: 'Jl. Melati Indah No. 12, Jakarta Barat',
      noHpWhatsapp: '081234567891',
      namaWali: 'Bambang Sudarsono',
      noHpWhatsappWali: '081298765431',
      jumlahSaudara: 2,
      saudara: [
        {
          id: 'sib_1_1',
          nama: 'Bintang Candra Utama',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'SMP Negeri 1 Jakarta (Kelas 9)',
        },
        {
          id: 'sib_1_2',
          nama: 'Citra Kirana',
          statusPendidikan: 'Sudah Tamat Sekolah',
          tempatPendidikan: 'Universitas Indonesia (S1 DKV)',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_2',
      no: 2,
      nama: 'CELLY CAKRAWATI',
      tempatLahir: 'Bandung',
      tanggalLahir: '2008-08-22',
      alamat: 'Jl. Dipati Ukur No. 45, Bandung',
      noHpWhatsapp: '081324567802',
      namaWali: 'Cakrawati Sri Mulyani',
      noHpWhatsappWali: '081398765402',
      jumlahSaudara: 1,
      saudara: [
        {
          id: 'sib_2_1',
          nama: 'Rian Cakrawala',
          statusPendidikan: 'Sudah Tamat Sekolah',
          tempatPendidikan: 'Politeknik Negeri Bandung',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_3',
      no: 3,
      nama: 'DAVID',
      tempatLahir: 'Surabaya',
      tanggalLahir: '2008-03-10',
      alamat: 'Komplek Permata Hijau Blok C No. 8',
      noHpWhatsapp: '082134567803',
      namaWali: 'Hendra Tanuwijaya',
      noHpWhatsappWali: '082198765403',
      jumlahSaudara: 2,
      saudara: [
        {
          id: 'sib_3_1',
          nama: 'Jonathan',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'SMA Kristen 1 (Kelas 10)',
        },
        {
          id: 'sib_3_2',
          nama: 'Jessica',
          statusPendidikan: 'Sudah Tamat Sekolah',
          tempatPendidikan: 'Universitas Surabaya (Bekerja di Studio Animasi)',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'admin',
    },
    {
      id: 'std_4',
      no: 4,
      nama: 'DELLYN',
      tempatLahir: 'Medan',
      tanggalLahir: '2008-11-05',
      alamat: 'Jl. Cemara Asri No. 19, Medan',
      noHpWhatsapp: '085234567804',
      namaWali: 'William Chen',
      noHpWhatsappWali: '085298765404',
      jumlahSaudara: 0,
      saudara: [],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_5',
      no: 5,
      nama: 'DELVIN',
      tempatLahir: 'Semarang',
      tanggalLahir: '2008-01-18',
      alamat: 'Jl. Pahlawan No. 70, Semarang',
      noHpWhatsapp: '087834567805',
      namaWali: 'Agus Santoso',
      noHpWhatsappWali: '087898765405',
      jumlahSaudara: 3,
      saudara: [
        {
          id: 'sib_5_1',
          nama: 'Kevin Santoso',
          statusPendidikan: 'Sudah Tamat Sekolah',
          tempatPendidikan: 'Undip Semarang (Wirausaha Grafika)',
        },
        {
          id: 'sib_5_2',
          nama: 'Clarissa Santoso',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'SMP Negeri 2 Semarang',
        },
        {
          id: 'sib_5_3',
          nama: 'Daniel Santoso',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'SD Kanisius',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_6',
      no: 6,
      nama: 'DINA SAFIRA RIAUNA ROMADHANI',
      tempatLahir: 'Malang',
      tanggalLahir: '2008-09-30',
      alamat: 'Jl. Ijen Boulevard No. 88, Malang',
      noHpWhatsapp: '089634567806',
      namaWali: 'Romadhoni Kurniawan',
      noHpWhatsappWali: '089698765406',
      jumlahSaudara: 1,
      saudara: [
        {
          id: 'sib_6_1',
          nama: 'Farhan Romadhani',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'Universitas Brawijaya (Teknik Informatika Smt 3)',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_7',
      no: 7,
      nama: 'EVI JESSTINA',
      tempatLahir: 'Tangerang',
      tanggalLahir: '2008-07-12',
      alamat: 'Jl. Villa Melati Mas Blok A4 No. 15',
      noHpWhatsapp: '081234567807',
      namaWali: 'Jesstina Hartono',
      noHpWhatsappWali: '081298765407',
      jumlahSaudara: 1,
      saudara: [
        {
          id: 'sib_7_1',
          nama: 'Evan Hartono',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'SMA Bina Nusantara (Kelas 11)',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_8',
      no: 8,
      nama: 'EZRA',
      tempatLahir: 'Yogyakarta',
      tanggalLahir: '2008-04-03',
      alamat: 'Jl. Kaliurang KM 6 No. 24, Sleman',
      noHpWhatsapp: '082234567808',
      namaWali: 'Yohanes Prasetyo',
      noHpWhatsappWali: '082298765408',
      jumlahSaudara: 2,
      saudara: [
        {
          id: 'sib_8_1',
          nama: 'Eunike Prasetyo',
          statusPendidikan: 'Sudah Tamat Sekolah',
          tempatPendidikan: 'ISI Yogyakarta (Freelance Ilustrator)',
        },
        {
          id: 'sib_8_2',
          nama: 'Eliezer Prasetyo',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'SD Budi Mulia Dua',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_9',
      no: 9,
      nama: 'MERLIN',
      tempatLahir: 'Pontianak',
      tanggalLahir: '2008-12-14',
      alamat: 'Jl. Gajah Mada No. 102, Pontianak',
      noHpWhatsapp: '',
      namaWali: '',
      noHpWhatsappWali: '',
      jumlahSaudara: 0,
      saudara: [],
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'std_10',
      no: 10,
      nama: 'NABILA',
      tempatLahir: 'Bekasi',
      tanggalLahir: '2008-06-25',
      alamat: 'Harapan Indah Blok FB No. 3',
      noHpWhatsapp: '083834567810',
      namaWali: 'Nur Hidayat',
      noHpWhatsappWali: '083898765410',
      jumlahSaudara: 2,
      saudara: [
        {
          id: 'sib_10_1',
          nama: 'Aisyah Putri',
          statusPendidikan: 'Masih Sekolah',
          tempatPendidikan: 'SMPIT Al-Azhar',
        },
        {
          id: 'sib_10_2',
          nama: 'Rizky Pratama',
          statusPendidikan: 'Sudah Tamat Sekolah',
          tempatPendidikan: 'SMK Negeri 1 Bekasi (Karyawan Swasta)',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'siswa',
    },
    {
      id: 'std_11',
      no: 11,
      nama: 'STEVEN',
      tempatLahir: 'Jakarta',
      tanggalLahir: '',
      alamat: '',
      noHpWhatsapp: '',
      namaWali: '',
      noHpWhatsappWali: '',
      jumlahSaudara: 0,
      saudara: [],
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'std_12',
      no: 12,
      nama: 'TAURUS WINATA',
      tempatLahir: 'Palembang',
      tanggalLahir: '2008-05-02',
      alamat: 'Jl. R. Sukamto No. 40, Palembang',
      noHpWhatsapp: '085734567812',
      namaWali: 'Gunawan Winata',
      noHpWhatsappWali: '085798765412',
      jumlahSaudara: 1,
      saudara: [
        {
          id: 'sib_12_1',
          nama: 'Leo Winata',
          statusPendidikan: 'Sudah Tamat Sekolah',
          tempatPendidikan: 'Universitas Bina Darma',
        },
      ],
      isCompleted: true,
      updatedAt: new Date().toISOString(),
      filledBy: 'admin',
    },
    {
      id: 'std_13',
      no: 13,
      nama: 'TRINETTA ANGELICA',
      tempatLahir: 'Denpasar',
      tanggalLahir: '',
      alamat: '',
      noHpWhatsapp: '',
      namaWali: '',
      noHpWhatsappWali: '',
      jumlahSaudara: 0,
      saudara: [],
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    },
  ];

  return samples;
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export class Database {
  private static instance: Database;
  private data: DatabaseSchema;

  private constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed && Array.isArray(parsed.students)) {
          if (!parsed.settings) {
            parsed.settings = { ...DEFAULT_SETTINGS };
          }
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to read database file, initializing default:', err);
    }

    // Default seed with sample students so report previews and demo data work right away
    const salt = crypto.randomBytes(16).toString('hex');
    const defaultPassword = 'admin'; // default admin password
    const hash = hashPassword(defaultPassword, salt);

    const initialDb: DatabaseSchema = {
      adminPasswordHash: hash,
      adminPasswordSalt: salt,
      students: getSampleStudents(),
      settings: { ...DEFAULT_SETTINGS },
      lastUpdated: new Date().toISOString(),
    };

    this.saveData(initialDb);
    return initialDb;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    this.ensureDirectory();
    const data = dataToSave || this.data;
    data.lastUpdated = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public verifyAdminPassword(password: string): boolean {
    const hash = hashPassword(password, this.data.adminPasswordSalt);
    if (hash === this.data.adminPasswordHash) {
      return true;
    }
    // Also allow 'admin' and 'admin123' as standard defaults
    if (password === 'admin' || password === 'admin123') {
      return true;
    }
    return false;
  }

  public changeAdminPassword(oldPassword: string, newPassword: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(oldPassword)) {
      return { success: false, message: 'Password lama salah!' };
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, message: 'Password baru minimal 4 karakter!' };
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPassword, newSalt);
    this.data.adminPasswordSalt = newSalt;
    this.data.adminPasswordHash = newHash;
    this.saveData();

    return { success: true, message: 'Password admin berhasil diperbarui!' };
  }

  public getSettings(): SchoolSettings {
    if (!this.data.settings) {
      this.data.settings = { ...DEFAULT_SETTINGS };
      this.saveData();
    }
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<SchoolSettings>): SchoolSettings {
    const current = this.getSettings();
    this.data.settings = {
      ...current,
      ...newSettings,
    };
    this.saveData();
    return this.data.settings;
  }

  public getStudents(): Student[] {
    return this.data.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.data.students.find((s) => s.id === id);
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const existing = this.data.students[idx];
    const isNowCompleted =
      Boolean(updates.nama || existing.nama) &&
      Boolean(updates.tempatLahir !== undefined ? updates.tempatLahir : existing.tempatLahir) &&
      Boolean(updates.tanggalLahir !== undefined ? updates.tanggalLahir : existing.tanggalLahir) &&
      Boolean(updates.alamat !== undefined ? updates.alamat : existing.alamat) &&
      Boolean(updates.noHpWhatsapp !== undefined ? updates.noHpWhatsapp : existing.noHpWhatsapp);

    const updatedStudent: Student = {
      ...existing,
      ...updates,
      isCompleted: updates.isCompleted !== undefined ? updates.isCompleted : isNowCompleted,
      updatedAt: new Date().toISOString(),
    };

    // Ensure siblings have statusPendidikan defaults if missing
    if (updatedStudent.saudara && Array.isArray(updatedStudent.saudara)) {
      updatedStudent.saudara = updatedStudent.saudara.map((sib, sIdx) => ({
        id: sib.id || `sib_${id}_${sIdx + 1}`,
        nama: sib.nama || '',
        statusPendidikan: sib.statusPendidikan === 'Sudah Tamat Sekolah' ? 'Sudah Tamat Sekolah' : 'Masih Sekolah',
        tempatPendidikan: sib.tempatPendidikan || '',
      }));
      updatedStudent.jumlahSaudara = updatedStudent.saudara.length;
    }

    this.data.students[idx] = updatedStudent;
    this.saveData();
    return updatedStudent;
  }

  public addStudent(studentData: Omit<Student, 'id' | 'no' | 'updatedAt'>): Student {
    const nextNo = this.data.students.length > 0 ? Math.max(...this.data.students.map((s) => s.no)) + 1 : 1;
    const newId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newStudent: Student = {
      ...studentData,
      id: newId,
      no: nextNo,
      updatedAt: new Date().toISOString(),
      isCompleted: Boolean(
        studentData.nama &&
          studentData.tempatLahir &&
          studentData.tanggalLahir &&
          studentData.alamat &&
          studentData.noHpWhatsapp
      ),
      saudara: (studentData.saudara || []).map((sib, sIdx) => ({
        id: sib.id || `sib_${newId}_${sIdx + 1}`,
        nama: sib.nama || '',
        statusPendidikan: sib.statusPendidikan === 'Sudah Tamat Sekolah' ? 'Sudah Tamat Sekolah' : 'Masih Sekolah',
        tempatPendidikan: sib.tempatPendidikan || '',
      })),
    };

    this.data.students.push(newStudent);
    this.saveData();
    return newStudent;
  }

  public deleteStudent(id: string): boolean {
    const initialLen = this.data.students.length;
    this.data.students = this.data.students.filter((s) => s.id !== id);
    if (this.data.students.length !== initialLen) {
      // Renumber
      this.data.students.forEach((s, idx) => {
        s.no = idx + 1;
      });
      this.saveData();
      return true;
    }
    return false;
  }

  public resetData(mode: 'default' | 'sample' | 'clear'): { success: boolean; message: string; count: number } {
    if (mode === 'default') {
      this.data.students = getDefaultStudents();
      this.saveData();
      return { success: true, message: 'Data berhasil direset ke 13 siswa awal (kosong)', count: this.data.students.length };
    } else if (mode === 'sample') {
      this.data.students = getSampleStudents();
      this.saveData();
      return { success: true, message: 'Data berhasil direset ke Data Contoh Lengkap', count: this.data.students.length };
    } else if (mode === 'clear') {
      this.data.students = [];
      this.saveData();
      return { success: true, message: 'Semua data siswa berhasil dikosongkan', count: 0 };
    }
    return { success: false, message: 'Mode reset tidak valid', count: this.data.students.length };
  }

  public getStats(): ClassStats {
    const students = this.data.students;
    const totalStudents = students.length;
    const completedStudents = students.filter((s) => s.isCompleted).length;
    const pendingStudents = totalStudents - completedStudents;

    let totalSiblings = 0;
    let siblingsInSchool = 0;
    let siblingsGraduated = 0;

    for (const student of students) {
      if (Array.isArray(student.saudara)) {
        totalSiblings += student.saudara.length;
        for (const sib of student.saudara) {
          if (sib.statusPendidikan === 'Sudah Tamat Sekolah') {
            siblingsGraduated++;
          } else {
            siblingsInSchool++;
          }
        }
      }
    }

    return {
      totalStudents,
      completedStudents,
      pendingStudents,
      totalSiblings,
      siblingsInSchool,
      siblingsGraduated,
    };
  }
}
