import React, { useState } from 'react';
import {
  Shield,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  KeyRound,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  HelpCircle,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  Users,
  GraduationCap,
  Briefcase,
  Lock,
  Download,
  Building2,
  UserCheck,
} from 'lucide-react';
import type { Student, ClassStats, SchoolSettings } from '../types/student.ts';
import { exportClassReportPDF, exportSingleStudentPDF } from '../lib/pdfExport.ts';
import { exportStudentsToExcel } from '../lib/excelExport.ts';
import { ChangePasswordModal } from './ChangePasswordModal.tsx';
import { ResetDataModal } from './ResetDataModal.tsx';
import { AddEditStudentModal } from './AddEditStudentModal.tsx';
import { SchoolSettingsModal } from './SchoolSettingsModal.tsx';

interface AdminDashboardProps {
  students: Student[];
  stats: ClassStats | null;
  settings: SchoolSettings;
  onSaveSettings: (settings: Partial<SchoolSettings>) => Promise<void>;
  isLoggedIn: boolean;
  onLogin: (password: string) => Promise<void>;
  onLogout: () => void;
  onRefreshData: () => Promise<void>;
  onSaveStudent: (data: Partial<Student>, id?: string) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onViewStudentDetail: (student: Student) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  stats,
  settings,
  onSaveSettings,
  isLoggedIn,
  onLogin,
  onLogout,
  onRefreshData,
  onSaveStudent,
  onDeleteStudent,
  onViewStudentDetail,
}) => {
  // Login Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Modals state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isResetDataOpen, setIsResetDataOpen] = useState(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Table Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await onLogin(passwordInput);
      setPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Password salah!');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If not logged in, show Login Screen
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-center text-slate-900">
            Akses Administrator
          </h2>
          <p className="text-xs text-center text-slate-500 mt-1 mb-6">
            Masuk untuk mengakses laporan, unduh Excel / PDF, kelola data siswa, dan reset data database.
          </p>

          {loginError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              <div className="flex items-start space-x-2">
                <span className="font-bold shrink-0">Perhatian:</span>
                <div>
                  <p>{loginError}</p>
                  <p className="mt-1 text-[11px] text-red-600">
                    Gunakan password bawaan: <code className="bg-red-100 px-1 py-0.5 rounded font-mono font-bold text-red-800">admin</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password Administrator
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordInput('admin')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Isi Otomatis: admin
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password admin..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                <span>Password bawaan: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono font-bold">admin</code></span>
                <span className="text-slate-400">atau: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">admin123</code></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Memverifikasi...' : 'Masuk ke Panel Admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.alamat && s.alamat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.tempatLahir && s.tempatLahir.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.namaWali && s.namaWali.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'completed') return s.isCompleted;
    if (filterStatus === 'pending') return !s.isCompleted;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Panel Administrator Kelas XII DKV
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Online Terhubung</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan lengkap biodata siswa, ekspor dokumen resmi, kelola akun dan pengaturan database.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Settings School & Wali Kelas */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors border border-indigo-200 shadow-2xs"
            title="Ubah Nama Sekolah & Wali Kelas"
          >
            <Building2 className="w-4 h-4" />
            <span>Sekolah & Wali</span>
          </button>

          {/* Download Excel */}
          <button
            onClick={() => exportStudentsToExcel(students, settings)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            title="Unduh format spreadsheet .xlsx"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Excel (.xlsx)</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={() => exportClassReportPDF(students, settings)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            title="Unduh laporan kelas format PDF"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh PDF (Laporan)</span>
          </button>

          {/* Add Student */}
          <button
            onClick={() => {
              setEditingStudent(null);
              setIsAddEditOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>

          {/* Change Password */}
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-300"
            title="Ganti Password Admin"
          >
            <KeyRound className="w-4 h-4" />
            <span>Ganti Password</span>
          </button>

          {/* Reset Data */}
          <button
            onClick={() => setIsResetDataOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors border border-red-200"
            title="Reset Data Siswa"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Keluar dari Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* School & Wali Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-900/50">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                {settings.schoolName}
              </h2>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                {settings.academicYear}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-indigo-200 mt-1">
              <span>Program: <strong className="text-white font-medium">{settings.className}</strong></span>
              <span>Wali Kelas: <strong className="text-white font-medium">{settings.waliKelasName}</strong> {settings.waliKelasNip ? `(NIP. ${settings.waliKelasNip})` : ''}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors self-start md:self-center shrink-0"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Ganti Nama Sekolah & Wali</span>
        </button>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
            Total Siswa
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats?.totalStudents ?? students.length}
          </div>
          <span className="text-[11px] text-slate-500">Kelas XII DKV</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase block mb-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sudah Lengkap</span>
          </span>
          <div className="text-2xl font-extrabold text-emerald-700">
            {stats?.completedStudents ?? students.filter((s) => s.isCompleted).length}
          </div>
          <span className="text-[11px] text-emerald-600">Biodata lengkap</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase block mb-1 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Belum Lengkap</span>
          </span>
          <div className="text-2xl font-extrabold text-amber-700">
            {stats?.pendingStudents ?? students.filter((s) => !s.isCompleted).length}
          </div>
          <span className="text-[11px] text-amber-600">Perlu pengisian</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase block mb-1 flex items-center space-x-1">
            <Users className="w-3.5 h-3.5" />
            <span>Total Saudara</span>
          </span>
          <div className="text-2xl font-extrabold text-indigo-700">
            {stats?.totalSiblings ?? 0}
          </div>
          <span className="text-[11px] text-slate-500">Terdaftar di kelas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs bg-blue-50/30">
          <span className="text-[11px] font-semibold text-blue-700 uppercase block mb-1 flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Masih Sekolah</span>
          </span>
          <div className="text-2xl font-extrabold text-blue-800">
            {stats?.siblingsInSchool ?? 0}
          </div>
          <span className="text-[11px] text-blue-600">Saudara siswa</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/30">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase block mb-1 flex items-center space-x-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Sudah Tamat</span>
          </span>
          <div className="text-2xl font-extrabold text-emerald-800">
            {stats?.siblingsGraduated ?? 0}
          </div>
          <span className="text-[11px] text-emerald-600">Saudara tamat</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari siswa, alamat, wali..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua ({students.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Lengkap ({students.filter((s) => s.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Belum ({students.filter((s) => !s.isCompleted).length})
          </button>
        </div>
      </div>

      {/* Main Table: Matches PDF Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-3 text-center w-12 border-r border-slate-800">NO</th>
                <th className="py-3 px-4 border-r border-slate-800 min-w-[180px]">NAMA SISWA</th>
                <th className="py-3 px-3 border-r border-slate-800 min-w-[160px]">TEMPAT & TGL LAHIR</th>
                <th className="py-3 px-3 border-r border-slate-800 min-w-[180px]">ALAMAT</th>
                <th className="py-3 px-3 border-r border-slate-800 min-w-[130px]">NO HP / WA</th>
                <th className="py-3 px-3 border-r border-slate-800 min-w-[160px]">WALI / NO WA</th>
                <th className="py-3 px-2 text-center border-r border-slate-800 w-16">SAUDARA</th>
                <th className="py-3 px-4 border-r border-slate-800 min-w-[280px]">
                  DATA SAUDARA (STATUS & TEMPAT PENDIDIKAN)
                </th>
                <th className="py-3 px-3 text-center border-r border-slate-800 w-24">STATUS</th>
                <th className="py-3 px-3 text-center w-28">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada siswa yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-900 border-r border-slate-100">
                      {std.no}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100">
                      {std.nama}
                    </td>

                    <td className="py-3 px-3 border-r border-slate-100 text-slate-600">
                      {std.tempatLahir ? (
                        <>
                          <div>{std.tempatLahir}</div>
                          <div className="text-[11px] text-slate-400">{std.tanggalLahir || '-'}</div>
                        </>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3 border-r border-slate-100 text-slate-600 max-w-xs truncate">
                      {std.alamat || <span className="text-slate-300">-</span>}
                    </td>

                    <td className="py-3 px-3 border-r border-slate-100 font-mono text-[11px]">
                      {std.noHpWhatsapp || <span className="text-slate-300">-</span>}
                    </td>

                    <td className="py-3 px-3 border-r border-slate-100 text-slate-600">
                      {std.namaWali ? (
                        <>
                          <div className="font-medium text-slate-800">{std.namaWali}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{std.noHpWhatsappWali || '-'}</div>
                        </>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-center font-semibold text-slate-800 border-r border-slate-100">
                      {std.saudara ? std.saudara.length : std.jumlahSaudara || 0}
                    </td>

                    {/* Sibling Details with Required Education Status */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      {std.saudara && std.saudara.length > 0 ? (
                        <div className="space-y-1.5">
                          {std.saudara.map((sib, sIdx) => (
                            <div key={sib.id || sIdx} className="flex items-start space-x-1.5 text-[11px]">
                              <span className="font-semibold text-slate-900 shrink-0">
                                {sIdx + 1}. {sib.nama}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded-md font-semibold text-[10px] shrink-0 ${
                                  sib.statusPendidikan === 'Masih Sekolah'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {sib.statusPendidikan === 'Masih Sekolah' ? 'Sekolah' : 'Tamat'}
                              </span>
                              {sib.tempatPendidikan && (
                                <span className="text-slate-500 truncate max-w-[140px]">
                                  ({sib.tempatPendidikan})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Tidak ada saudara</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center border-r border-slate-100">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          std.isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {std.isCompleted ? 'Lengkap' : 'Belum'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => onViewStudentDetail(std)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingStudent(std);
                            setIsAddEditOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Biodata"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => exportSingleStudentPDF(std, settings)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Unduh PDF Individu"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus ${std.nama}?`)) {
                              onDeleteStudent(std.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <SchoolSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={onSaveSettings}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <ResetDataModal
        isOpen={isResetDataOpen}
        onClose={() => setIsResetDataOpen(false)}
        onSuccess={onRefreshData}
      />

      <AddEditStudentModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={onSaveStudent}
        studentToEdit={editingStudent}
        suggestedNo={students.length + 1}
      />
    </div>
  );
};
