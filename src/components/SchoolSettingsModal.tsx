import React, { useState, useEffect } from 'react';
import {
  Building2,
  UserCheck,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import type { SchoolSettings } from '../types/student.ts';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SchoolSettings;
  onSaveSettings: (settings: Partial<SchoolSettings>) => Promise<void>;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [className, setClassName] = useState(settings.className);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [waliKelasName, setWaliKelasName] = useState(settings.waliKelasName);
  const [waliKelasNip, setWaliKelasNip] = useState(settings.waliKelasNip);
  const [headOfProgramName, setHeadOfProgramName] = useState(settings.headOfProgramName);
  const [headOfProgramNip, setHeadOfProgramNip] = useState(settings.headOfProgramNip);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSchoolName(settings.schoolName);
      setClassName(settings.className);
      setAcademicYear(settings.academicYear);
      setWaliKelasName(settings.waliKelasName);
      setWaliKelasNip(settings.waliKelasNip);
      setHeadOfProgramName(settings.headOfProgramName);
      setHeadOfProgramNip(settings.headOfProgramNip);
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      setErrorMsg('Nama sekolah wajib diisi!');
      return;
    }
    if (!waliKelasName.trim()) {
      setErrorMsg('Nama wali kelas wajib diisi!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await onSaveSettings({
        schoolName: schoolName.trim(),
        className: className.trim(),
        academicYear: academicYear.trim(),
        waliKelasName: waliKelasName.trim(),
        waliKelasNip: waliKelasNip.trim(),
        headOfProgramName: headOfProgramName.trim(),
        headOfProgramNip: headOfProgramNip.trim(),
      });
      setSuccessMsg('Pengaturan nama sekolah & wali kelas berhasil disimpan!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = () => {
    setSchoolName('SMK NEGERI KREATIF NUSANTARA');
    setClassName('XII DKV (Desain Komunikasi Visual)');
    setAcademicYear('2026/2027');
    setWaliKelasName('Drs. H. Mulyadi, M.Pd.');
    setWaliKelasNip('19780512 200312 1 004');
    setHeadOfProgramName('Budi Santoso, S.Sn., M.Ds.');
    setHeadOfProgramNip('19820719 200801 1 007');
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
        <div className="flex items-center space-x-3 pb-4 mb-5 border-b border-slate-100">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Pengaturan Sekolah & Wali Kelas
            </h3>
            <p className="text-xs text-slate-500">
              Sesuaikan nama sekolah, wali kelas, dan pimpinan program untuk kop surat serta lembar tanda tangan laporan PDF & Excel.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Informasi Sekolah & Kelas */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Identitas Sekolah & Kelas</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Resmi Sekolah / Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMK NEGERI 1 JAKARTA / SMK GRAFIKA..."
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Akan tercantum pada kop surat laporan PDF, lembar biodata individu, dan header file Excel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Kelas & Jurusan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XII DKV"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Ajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 2026/2027"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Wali Kelas */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Data Wali Kelas</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar Wali Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Drs. H. Mulyadi, M.Pd."
                  value={waliKelasName}
                  onChange={(e) => setWaliKelasName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NUPTK Wali Kelas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 19780512 200312 1 004"
                  value={waliKelasNip}
                  onChange={(e) => setWaliKelasNip(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Kepala Program Keahlian */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Data Kepala Program Keahlian (Tanda Tangan Mengetahui)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso, S.Sn., M.Ds."
                  value={headOfProgramName}
                  onChange={(e) => setHeadOfProgramName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NUPTK
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 19820719 200801 1 007"
                  value={headOfProgramNip}
                  onChange={(e) => setHeadOfProgramNip(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/70 text-xs">
            <span className="font-bold text-blue-900 block mb-1">
              Pratinjau Lembar Dokumen Laporan:
            </span>
            <div className="bg-white p-3 rounded-xl border border-blue-100 text-slate-700 space-y-1">
              <p className="font-bold text-center text-slate-900 uppercase">
                {schoolName || '(NAMA SEKOLAH)'}
              </p>
              <p className="text-center text-[11px] text-slate-600">
                PROGRAM KEAHLIAN {className.toUpperCase()} • TAHUN AJARAN {academicYear}
              </p>
              <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between text-[11px]">
                <div>
                  <span className="text-slate-400 block">Mengetahui:</span>
                  <span className="font-bold text-slate-800">{headOfProgramName || '-'}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">NIP. {headOfProgramNip || '-'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Wali Kelas:</span>
                  <span className="font-bold text-slate-800">{waliKelasName || '-'}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">NIP. {waliKelasNip || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pulihkan Nama Standar</span>
            </button>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
