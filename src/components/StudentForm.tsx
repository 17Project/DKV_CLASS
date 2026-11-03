import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  MapPin,
  Calendar,
  Phone,
  Users,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  GraduationCap,
  Briefcase,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type { Student, Sibling, SchoolSettings } from '../types/student.ts';
import { exportSingleStudentPDF } from '../lib/pdfExport.ts';

interface StudentFormProps {
  students: Student[];
  onSave: (id: string, data: Partial<Student>) => Promise<Student>;
  onAddNewStudent?: (data: Partial<Student>) => Promise<Student>;
  preselectedStudentId?: string | null;
  onSelectAnotherStudent?: () => void;
  settings?: SchoolSettings;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  students,
  onSave,
  onAddNewStudent,
  preselectedStudentId,
  onSelectAnotherStudent,
  settings,
}) => {
  const [selectedId, setSelectedId] = useState<string>(preselectedStudentId || (students[0]?.id ?? ''));
  const [isCustomStudent, setIsCustomStudent] = useState<boolean>(false);

  // Form State
  const [nama, setNama] = useState('');
  const [no, setNo] = useState<number>(1);
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHpWhatsapp, setNoHpWhatsapp] = useState('');
  const [namaWali, setNamaWali] = useState('');
  const [noHpWhatsappWali, setNoHpWhatsappWali] = useState('');
  const [saudaraList, setSaudaraList] = useState<Sibling[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedStudentData, setSavedStudentData] = useState<Student | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Update selection if preselected changed
  useEffect(() => {
    if (preselectedStudentId) {
      setSelectedId(preselectedStudentId);
      setIsCustomStudent(false);
    }
  }, [preselectedStudentId]);

  // Load selected student data
  useEffect(() => {
    if (isCustomStudent) {
      setNama('');
      setNo(students.length + 1);
      setTempatLahir('');
      setTanggalLahir('');
      setAlamat('');
      setNoHpWhatsapp('');
      setNamaWali('');
      setNoHpWhatsappWali('');
      setSaudaraList([]);
      setSaveSuccess(false);
      return;
    }

    const current = students.find((s) => s.id === selectedId);
    if (current) {
      setNama(current.nama);
      setNo(current.no);
      setTempatLahir(current.tempatLahir || '');
      setTanggalLahir(current.tanggalLahir || '');
      setAlamat(current.alamat || '');
      setNoHpWhatsapp(current.noHpWhatsapp || '');
      setNamaWali(current.namaWali || '');
      setNoHpWhatsappWali(current.noHpWhatsappWali || '');
      setSaudaraList(
        current.saudara && current.saudara.length > 0
          ? [...current.saudara]
          : []
      );
      setSaveSuccess(false);
      setErrorMessage('');
    }
  }, [selectedId, students, isCustomStudent]);

  // Handle adding sibling
  const handleAddSibling = () => {
    const newSibling: Sibling = {
      id: `sib_${Date.now()}_${saudaraList.length + 1}`,
      nama: '',
      statusPendidikan: 'Masih Sekolah',
      tempatPendidikan: '',
    };
    setSaudaraList([...saudaraList, newSibling]);
  };

  // Handle removing sibling
  const handleRemoveSibling = (index: number) => {
    const updated = [...saudaraList];
    updated.splice(index, 1);
    setSaudaraList(updated);
  };

  // Update sibling field
  const handleUpdateSibling = (index: number, field: keyof Sibling, value: any) => {
    const updated = [...saudaraList];
    updated[index] = { ...updated[index], [field]: value };
    setSaudaraList(updated);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMessage('Nama siswa wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload: Partial<Student> = {
        no,
        nama: nama.trim().toUpperCase(),
        tempatLahir: tempatLahir.trim(),
        tanggalLahir,
        alamat: alamat.trim(),
        noHpWhatsapp: noHpWhatsapp.trim(),
        namaWali: namaWali.trim(),
        noHpWhatsappWali: noHpWhatsappWali.trim(),
        jumlahSaudara: saudaraList.length,
        saudara: saudaraList,
        filledBy: 'siswa',
      };

      let result: Student;
      if (isCustomStudent && onAddNewStudent) {
        result = await onAddNewStudent(payload);
        setIsCustomStudent(false);
        setSelectedId(result.id);
      } else {
        result = await onSave(selectedId, payload);
      }

      setSavedStudentData(result);
      setSaveSuccess(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan biodata');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStudent = students.find((s) => s.id === selectedId);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Title Header Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Formulir Pendataan Resmi Siswa</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              BIODATA SISWA {settings?.className ? settings.className.toUpperCase() : 'KELAS XII DKV'}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              {settings?.schoolName ? `${settings.schoolName} • ` : ''}Tahun Ajaran {settings?.academicYear || '2026/2027'}. Silakan lengkapi data pribadi, data wali, serta informasi saudara kandung.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center w-full md:w-auto">
            <span className="text-xs text-blue-200 block">Status Pengisian Saat Ini</span>
            <span className={`inline-block mt-1 font-bold text-xs px-2.5 py-1 rounded-full ${
              currentStudent?.isCompleted 
                ? 'bg-emerald-400 text-emerald-950 font-bold' 
                : 'bg-amber-300 text-amber-950 font-bold'
            }`}>
              {currentStudent?.isCompleted ? '✓ Biodata Lengkap' : '○ Belum Dilengkapi'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-base font-bold text-emerald-900">
                Biodata Berhasil Disimpan ke Database Server!
              </h3>
              <p className="text-sm text-emerald-700 mt-0.5">
                Data untuk <span className="font-semibold">{savedStudentData?.nama || nama}</span> telah tersimpan dan dapat langsung diakses oleh wali kelas dan admin di berbagai perangkat.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => savedStudentData && exportSingleStudentPDF(savedStudentData, settings)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Lembar Biodata (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSaveSuccess(false)}
                  className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors"
                >
                  Lanjut Edit / Tutup Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 0: Pilih Siswa Dari Daftar Tabel */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Pilih Nama Siswa</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih nama kamu dari daftar 13 siswa Kelas XII DKV yang sudah terdaftar
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsCustomStudent(!isCustomStudent)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                {isCustomStudent ? '← Pilih dari 13 Siswa Terdaftar' : '+ Siswa Pindahan / Baru'}
              </button>
            </div>
          </div>

          {!isCustomStudent ? (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Nama Lengkap Siswa Terdaftar
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden transition-all"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.no}. {std.nama} {std.isCompleted ? '✓ (Sudah Lengkap)' : '○ (Belum Lengkap)'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor Presensi
                </label>
                <input
                  type="number"
                  min="1"
                  value={no}
                  onChange={(e) => setNo(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Siswa Baru
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap siswa..."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm uppercase"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Data Pribadi Siswa */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Pribadi Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Informasi kelahiran, domisili, dan nomor WhatsApp aktif siswa
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Contoh: Jakarta / Bandung"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap Tempat Tinggal <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Jl. Nama Jalan No. XX, RT/RW, Kelurahan, Kecamatan, Kota..."
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No Handphone / WhatsApp Siswa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={noHpWhatsapp}
                  onChange={(e) => setNoHpWhatsapp(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Pastikan nomor terhubung dengan WhatsApp aktif untuk koordinasi tugas dan info kelas
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Data Wali / Orang Tua */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Orang Tua / Wali
              </h2>
              <p className="text-xs text-slate-500">
                Kontak darurat orang tua atau wali murid
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Wali / Orang Tua
              </label>
              <input
                type="text"
                placeholder="Nama ayah / ibu / wali..."
                value={namaWali}
                onChange={(e) => setNamaWali(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No Handphone / WhatsApp Wali
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={noHpWhatsappWali}
                  onChange={(e) => setNoHpWhatsappWali(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Data Saudara Siswa (With Status Pendidikan) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span>Data Saudara Siswa</span>
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full border border-indigo-200">
                    Jumlah: {saudaraList.length} Orang
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Wajib mengisi Status Pendidikan Saat Ini (Masih Sekolah / Sudah Tamat Sekolah)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSibling}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Saudara</span>
            </button>
          </div>

          {saudaraList.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">
                Belum ada data saudara ditambahkan (Anak Tunggal)
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Jika memiliki kakak atau adik, klik tombol "Tambah Saudara" di atas.
              </p>
              <button
                type="button"
                onClick={handleAddSibling}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                + Tambah Data Saudara ke-1
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {saudaraList.map((sib, index) => (
                <div
                  key={sib.id || index}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 relative hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/70">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] inline-flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span>Saudara ke-{index + 1}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSibling(index)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="Hapus Saudara Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Sibling Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nama Saudara
                      </label>
                      <input
                        type="text"
                        placeholder="Nama saudara..."
                        value={sib.nama}
                        onChange={(e) => handleUpdateSibling(index, 'nama', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Sibling Educational Status - REQUIRED BY USER SPEC */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Status Pendidikan Saat Ini
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSibling(index, 'statusPendidikan', 'Masih Sekolah')}
                          className={`flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            sib.statusPendidikan === 'Masih Sekolah'
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Masih Sekolah</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateSibling(index, 'statusPendidikan', 'Sudah Tamat Sekolah')}
                          className={`flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            sib.statusPendidikan === 'Sudah Tamat Sekolah'
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Sudah Tamat</span>
                        </button>
                      </div>
                    </div>

                    {/* Sibling Educational Institution / Workplace */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {sib.statusPendidikan === 'Masih Sekolah'
                          ? 'Tempat Pendidikan Saat Ini'
                          : 'Sekolah Terakhir / Tempat Kerja'}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          sib.statusPendidikan === 'Masih Sekolah'
                            ? 'Contoh: SMPN 1 / Universitas...'
                            : 'Contoh: Lulus SMK / Bekerja di...'
                        }
                        value={sib.tempatPendidikan}
                        onChange={(e) => handleUpdateSibling(index, 'tempatPendidikan', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Actions Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {savedStudentData && (
            <button
              type="button"
              onClick={() => exportSingleStudentPDF(savedStudentData, settings)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-300"
            >
              <Download className="w-4 h-4" />
              <span>Cetak Lembar Biodata (PDF)</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan ke Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Biodata Sekarang</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
