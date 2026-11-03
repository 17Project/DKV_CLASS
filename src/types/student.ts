export interface Sibling {
  id: string;
  nama: string;
  statusPendidikan: 'Masih Sekolah' | 'Sudah Tamat Sekolah';
  tempatPendidikan: string;
}

export interface Student {
  id: string;
  no: number;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  noHpWhatsapp: string;
  namaWali: string;
  noHpWhatsappWali: string;
  jumlahSaudara: number;
  saudara: Sibling[];
  isCompleted: boolean;
  updatedAt: string;
  filledBy?: 'siswa' | 'admin';
}

export interface ClassStats {
  totalStudents: number;
  completedStudents: number;
  pendingStudents: number;
  totalSiblings: number;
  siblingsInSchool: number;
  siblingsGraduated: number;
}

export interface AdminAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface SchoolSettings {
  schoolName: string;
  className: string;
  academicYear: string;
  waliKelasName: string;
  waliKelasNip: string;
  headOfProgramName: string;
  headOfProgramNip: string;
}

