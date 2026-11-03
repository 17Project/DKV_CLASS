import React from 'react';
import {
  X,
  User,
  MapPin,
  Calendar,
  Phone,
  Users,
  Download,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Edit,
} from 'lucide-react';
import type { Student, SchoolSettings } from '../types/student.ts';
import { exportSingleStudentPDF } from '../lib/pdfExport.ts';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  settings?: SchoolSettings;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
  settings,
}) => {
  if (!isOpen || !student) return null;

  const handleOpenWhatsApp = (phone: string, name: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    const text = encodeURIComponent(
      `Halo ${name}, kami dari pihak sekolah/wali kelas XII DKV mengenai pendataan biodata siswa.`
    );
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-500/20">
              #{student.no}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900">{student.nama}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    student.isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {student.isCompleted ? '✓ Lengkap' : '○ Belum Lengkap'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelas XII DKV (Desain Komunikasi Visual) • Tahun Ajaran 2026/2027
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1: Data Pribadi */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Data Pribadi Siswa</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Tempat & Tanggal Lahir:</span>
                <span className="font-semibold text-slate-800">
                  {student.tempatLahir || '-'}
                  {student.tanggalLahir ? `, ${student.tanggalLahir}` : ''}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Nomor WhatsApp Siswa:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">
                    {student.noHpWhatsapp || '-'}
                  </span>
                  {student.noHpWhatsapp && (
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp(student.noHpWhatsapp, student.nama)}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1 border border-emerald-200"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Chat WA</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-0.5">Alamat Tempat Tinggal:</span>
                <span className="font-medium text-slate-800">
                  {student.alamat || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Data Orang Tua / Wali */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Data Orang Tua / Wali</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Nama Orang Tua / Wali:</span>
                <span className="font-semibold text-slate-800">
                  {student.namaWali || '-'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Nomor WhatsApp Wali:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">
                    {student.noHpWhatsappWali || '-'}
                  </span>
                  {student.noHpWhatsappWali && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenWhatsApp(
                          student.noHpWhatsappWali,
                          `Bapak/Ibu Wali dari ${student.nama}`
                        )
                      }
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1 border border-emerald-200"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Chat WA</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Data Saudara Siswa (With Education Status) */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>
                  Data Saudara Siswa ({student.jumlahSaudara || (student.saudara ? student.saudara.length : 0)} Orang)
                </span>
              </h4>
            </div>

            {student.saudara && student.saudara.length > 0 ? (
              <div className="space-y-2.5">
                {student.saudara.map((sib, idx) => (
                  <div
                    key={sib.id || idx}
                    className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{sib.nama}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 ml-7">
                        Tempat Pendidikan: <span className="font-medium text-slate-700">{sib.tempatPendidikan || '-'}</span>
                      </p>
                    </div>

                    <div className="ml-7 sm:ml-0">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          sib.statusPendidikan === 'Masih Sekolah'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {sib.statusPendidikan === 'Masih Sekolah' ? (
                          <GraduationCap className="w-3 h-3" />
                        ) : (
                          <Briefcase className="w-3 h-3" />
                        )}
                        <span>{sib.statusPendidikan}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Tidak ada data saudara kandung terdaftar (Anak Tunggal).
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => exportSingleStudentPDF(student, settings)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Lembar Biodata (PDF)</span>
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Biodata</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
