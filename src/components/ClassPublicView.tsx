import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Eye,
} from 'lucide-react';
import type { Student, SchoolSettings } from '../types/student.ts';

interface ClassPublicViewProps {
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onOpenDetail: (student: Student) => void;
  onGoToAdmin: () => void;
  settings?: SchoolSettings;
}

export const ClassPublicView: React.FC<ClassPublicViewProps> = ({
  students,
  onSelectStudent,
  onOpenDetail,
  onGoToAdmin,
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  const completedCount = students.filter((s) => s.isCompleted).length;
  const progressPercent = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.alamat && s.alamat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.tempatLahir && s.tempatLahir.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'completed') return s.isCompleted;
    if (filterStatus === 'pending') return !s.isCompleted;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Progress Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 backdrop-blur-md rounded-full text-xs font-semibold text-blue-300 border border-blue-400/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {settings?.schoolName ? `${settings.schoolName} • ` : ''}
                  {settings?.className || 'Kelas XII DKV'} • {settings?.academicYear || '2026/2027'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Rekapitulasi Pengisian Biodata Siswa
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Wali Kelas: <span className="font-semibold text-white">{settings?.waliKelasName || 'Wali Kelas XII DKV'}</span>. Setiap siswa wajib melengkapi biodata untuk keperluan pendataan rapor, dapodik, dan arsip sekolah.
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 min-w-[260px]">
              <div className="flex items-center justify-between text-xs text-blue-200 mb-2">
                <span>Progress Pengisian Kelas</span>
                <span className="font-bold text-white text-sm">{progressPercent}%</span>
              </div>
              
              <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-blue-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center space-x-1 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedCount} Lengkap</span>
                </div>
                <div className="flex items-center space-x-1 text-amber-300 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{students.length - completedCount} Belum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua ({students.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ✓ Sudah Lengkap ({completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ○ Belum Lengkap ({students.length - completedCount})
          </button>
        </div>
      </div>

      {/* Grid of Student Cards */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">Tidak ada siswa ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Coba ubah kata kunci pencarian atau filter status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredStudents.map((std) => {
            const siblingsCount = std.saudara ? std.saudara.length : std.jumlahSaudara || 0;
            const inSchoolSiblings = (std.saudara || []).filter((s) => s.statusPendidikan === 'Masih Sekolah').length;
            const graduatedSiblings = (std.saudara || []).filter((s) => s.statusPendidikan === 'Sudah Tamat Sekolah').length;

            return (
              <div
                key={std.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/60">
                      #{std.no}
                    </span>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        std.isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {std.isCompleted ? '✓ Lengkap' : '○ Belum Lengkap'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {std.nama}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center text-slate-500">
                      <span className="w-24 text-slate-400 shrink-0">Tempat Lahir:</span>
                      <span className="font-medium text-slate-800 truncate">
                        {std.tempatLahir || '-'}
                      </span>
                    </div>

                    <div className="flex items-center text-slate-500">
                      <span className="w-24 text-slate-400 shrink-0">WhatsApp:</span>
                      <span className="font-medium text-slate-800 truncate">
                        {std.noHpWhatsapp || '-'}
                      </span>
                    </div>

                    <div className="flex items-center text-slate-500">
                      <span className="w-24 text-slate-400 shrink-0">Wali:</span>
                      <span className="font-medium text-slate-800 truncate">
                        {std.namaWali || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Sibling status summary pill */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Saudara:</span>
                      <strong className="text-slate-700 font-semibold">{siblingsCount}</strong>
                    </span>

                    {siblingsCount > 0 && (
                      <div className="flex items-center space-x-1 text-[11px]">
                        {inSchoolSiblings > 0 && (
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 font-medium">
                            {inSchoolSiblings} Sekolah
                          </span>
                        )}
                        {graduatedSiblings > 0 && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 font-medium">
                            {graduatedSiblings} Tamat
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(std)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors text-xs flex items-center space-x-1"
                    title="Lihat Detail Lengkap"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Detail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectStudent(std.id)}
                    className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      std.isCompleted
                        ? 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    <span>{std.isCompleted ? 'Perbarui Biodata' : 'Isi Biodata Sekarang'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin footer prompt */}
      <div className="mt-12 text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-sm font-medium text-slate-700">
          Wali Kelas atau Staf Kurikulum?
        </p>
        <p className="text-xs text-slate-500 mt-0.5 mb-3">
          Akses menu admin untuk melihat laporan tabel utuh, unduh laporan dalam format Excel / PDF, reset data, atau ubah kata sandi.
        </p>
        <button
          onClick={onGoToAdmin}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Masuk ke Panel Admin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
