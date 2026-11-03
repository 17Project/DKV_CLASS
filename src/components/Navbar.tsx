import React from 'react';
import { GraduationCap, Shield, UserCheck, FileText, CheckCircle2 } from 'lucide-react';
import type { SchoolSettings } from '../types/student.ts';

interface NavbarProps {
  currentTab: 'form' | 'list' | 'admin';
  setCurrentTab: (tab: 'form' | 'list' | 'admin') => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  stats?: {
    totalStudents: number;
    completedStudents: number;
  };
  settings?: SchoolSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isAdminLoggedIn,
  onLogoutAdmin,
  stats,
  settings,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School/Class Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('list')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  {settings?.className ? `BIODATA ${settings.className.toUpperCase()}` : 'BIODATA KELAS XII DKV'}
                </span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200 hidden sm:inline-block">
                  {settings?.academicYear || '2026/2027'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                {settings?.schoolName || 'Desain Komunikasi Visual • Sistem Pendataan Siswa'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentTab('form')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'form'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Isi Biodata</span>
            </button>

            <button
              onClick={() => setCurrentTab('list')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Daftar Siswa</span>
              {stats && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    currentTab === 'list' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {stats.completedStudents}/{stats.totalStudents}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'admin'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'Panel Admin' : 'Masuk Admin'}</span>
              {isAdminLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
              )}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Sub-banner device sync info */}
      <div className="bg-slate-50 border-t border-slate-100 py-1 px-4 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
        <span>Database Aktif & Tersinkronisasi Multi-Perangkat (Akses Real-time via HP & Komputer)</span>
      </div>
    </header>
  );
};
