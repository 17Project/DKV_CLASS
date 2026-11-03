import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, GraduationCap, Briefcase } from 'lucide-react';
import type { Student, Sibling } from '../types/student.ts';

interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Student>, id?: string) => Promise<void>;
  studentToEdit?: Student | null;
  suggestedNo: number;
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  suggestedNo,
}) => {
  const [no, setNo] = useState<number>(suggestedNo);
  const [nama, setNama] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHpWhatsapp, setNoHpWhatsapp] = useState('');
  const [namaWali, setNamaWali] = useState('');
  const [noHpWhatsappWali, setNoHpWhatsappWali] = useState('');
  const [saudaraList, setSaudaraList] = useState<Sibling[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setNo(studentToEdit.no);
      setNama(studentToEdit.nama);
      setTempatLahir(studentToEdit.tempatLahir || '');
      setTanggalLahir(studentToEdit.tanggalLahir || '');
      setAlamat(studentToEdit.alamat || '');
      setNoHpWhatsapp(studentToEdit.noHpWhatsapp || '');
      setNamaWali(studentToEdit.namaWali || '');
      setNoHpWhatsappWali(studentToEdit.noHpWhatsappWali || '');
      setSaudaraList(studentToEdit.saudara ? [...studentToEdit.saudara] : []);
    } else {
      setNo(suggestedNo);
      setNama('');
      setTempatLahir('');
      setTanggalLahir('');
      setAlamat('');
      setNoHpWhatsapp('');
      setNamaWali('');
      setNoHpWhatsappWali('');
      setSaudaraList([]);
    }
    setErrorMsg('');
  }, [studentToEdit, suggestedNo, isOpen]);

  if (!isOpen) return null;

  const handleAddSibling = () => {
    setSaudaraList([
      ...saudaraList,
      {
        id: `sib_${Date.now()}_${saudaraList.length + 1}`,
        nama: '',
        statusPendidikan: 'Masih Sekolah',
        tempatPendidikan: '',
      },
    ]);
  };

  const handleRemoveSibling = (index: number) => {
    const list = [...saudaraList];
    list.splice(index, 1);
    setSaudaraList(list);
  };

  const handleUpdateSibling = (index: number, field: keyof Sibling, value: any) => {
    const list = [...saudaraList];
    list[index] = { ...list[index], [field]: value };
    setSaudaraList(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Nama siswa wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

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
        filledBy: 'admin',
      };

      await onSave(payload, studentToEdit?.id);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data siswa');
    } finally {
      setIsSubmitting(false);
    }
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

        <div className="mb-5 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {studentToEdit ? `Edit Biodata: ${studentToEdit.nama}` : 'Tambah Siswa Baru Kelas XII DKV'}
          </h3>
          <p className="text-xs text-slate-500">
            Perubahan langsung tersimpan ke database server dan tersinkronisasi di semua perangkat.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Presensi
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                placeholder="Nama lengkap..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm uppercase"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              rows={2}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No HP / WA Siswa
              </label>
              <input
                type="tel"
                value={noHpWhatsapp}
                onChange={(e) => setNoHpWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Wali
              </label>
              <input
                type="text"
                value={namaWali}
                onChange={(e) => setNamaWali(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No HP / WA Wali
              </label>
              <input
                type="tel"
                value={noHpWhatsappWali}
                onChange={(e) => setNoHpWhatsappWali(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Sibling Management */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">
                Data Saudara ({saudaraList.length})
              </span>
              <button
                type="button"
                onClick={handleAddSibling}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Saudara</span>
              </button>
            </div>

            {saudaraList.map((sib, sIdx) => (
              <div key={sib.id || sIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600">Saudara #{sIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSibling(sIdx)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nama saudara..."
                    value={sib.nama}
                    onChange={(e) => handleUpdateSibling(sIdx, 'nama', e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <select
                    value={sib.statusPendidikan}
                    onChange={(e) => handleUpdateSibling(sIdx, 'statusPendidikan', e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                  >
                    <option value="Masih Sekolah">Masih Sekolah</option>
                    <option value="Sudah Tamat Sekolah">Sudah Tamat Sekolah</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Tempat pendidikan saat ini..."
                    value={sib.tempatPendidikan}
                    onChange={(e) => handleUpdateSibling(sIdx, 'tempatPendidikan', e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
