import React, { useState } from 'react';
import { RotateCcw, X, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { api } from '../services/api.ts';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'default' | 'sample' | 'clear'>('default');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      setErrorMsg('Masukkan password admin untuk konfirmasi reset!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.resetData(mode, adminPassword);
      setSuccessMsg(res.message);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMsg('');
        setAdminPassword('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mereset data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Reset Data Database</h3>
            <p className="text-xs text-slate-500">Fitur khusus administrator untuk mengembalikan data</p>
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
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Opsi Reset Data:
            </label>
            
            <div className="space-y-2.5">
              <label
                className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                  mode === 'default'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="default"
                  checked={mode === 'default'}
                  onChange={() => setMode('default')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-slate-900">
                    Reset ke 13 Siswa Awal Tabel (Formulir Kosong)
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Memuat kembali 13 nama siswa resmi dari lembar DKV (AURA CANDRA DEWI s/d TRINETTA ANGELICA) dalam status belum terisi.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                  mode === 'sample'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="sample"
                  checked={mode === 'sample'}
                  onChange={() => setMode('sample')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-slate-900">
                    Muat Data Contoh Lengkap (Demo Laporan)
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Memuat data lengkap dengan alamat, wali, dan berbagai variasi status pendidikan saudara untuk simulasi cetak PDF dan Excel.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                  mode === 'clear'
                    ? 'border-red-600 bg-red-50/70 ring-1 ring-red-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="resetMode"
                  value="clear"
                  checked={mode === 'clear'}
                  onChange={() => setMode('clear')}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-red-950">
                    Kosongkan Semua Data Siswa
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Menghapus seluruh baris siswa dari database (0 siswa).
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Konfirmasi Password Admin</span>
            </label>
            <input
              type="password"
              placeholder="Masukkan password admin..."
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Verifikasi diperlukan untuk mencegah tindakan reset tidak disengaja.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
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
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              {isLoading ? 'Memproses Reset...' : 'Jalankan Reset Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
