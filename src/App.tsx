/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { StudentForm } from './components/StudentForm.tsx';
import { ClassPublicView } from './components/ClassPublicView.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { StudentDetailModal } from './components/StudentDetailModal.tsx';
import { api } from './services/api.ts';
import type { Student, ClassStats, SchoolSettings } from './types/student.ts';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [settings, setSettings] = useState<SchoolSettings>({
    schoolName: 'SMK NEGERI KREATIF NUSANTARA',
    className: 'XII DKV (Desain Komunikasi Visual)',
    academicYear: '2026/2027',
    waliKelasName: 'Drs. H. Mulyadi, M.Pd.',
    waliKelasNip: '19780512 200312 1 004',
    headOfProgramName: 'Budi Santoso, S.Sn., M.Ds.',
    headOfProgramNip: '19820719 200801 1 007',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'form' | 'list' | 'admin'>('list');

  // Selected student for form
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Detail Modal
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('xii_dkv_admin_auth') === 'true';
  });

  // Load Data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [studentsData, statsData, settingsData] = await Promise.all([
        api.getStudents(),
        api.getStats(),
        api.getSettings().catch(() => null),
      ]);
      setStudents(studentsData);
      setStats(statsData);
      if (settingsData) {
        setSettings(settingsData);
      }
      if (studentsData.length > 0 && !selectedStudentId) {
        setSelectedStudentId(studentsData[0].id);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Save Settings (School name & Wali Kelas)
  const handleSaveSettings = async (newSettings: Partial<SchoolSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  // Handle Save Student (From Form or Admin)
  const handleSaveStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
    const updated = await api.updateStudent(id, updates);
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    // Refresh stats
    api.getStats().then(setStats).catch(console.error);
    return updated;
  };

  // Handle Add New Student
  const handleAddNewStudent = async (data: Partial<Student>): Promise<Student> => {
    const newStudent = await api.addStudent(data);
    setStudents((prev) => [...prev, newStudent]);
    api.getStats().then(setStats).catch(console.error);
    return newStudent;
  };

  // Handle Admin Save (either add or edit)
  const handleAdminSaveStudent = async (data: Partial<Student>, id?: string) => {
    if (id) {
      await handleSaveStudent(id, data);
    } else {
      await handleAddNewStudent(data);
    }
  };

  // Handle Delete Student
  const handleDeleteStudent = async (id: string) => {
    await api.deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    api.getStats().then(setStats).catch(console.error);
  };

  // Handle Admin Login
  const handleAdminLogin = async (password: string) => {
    const res = await api.adminLogin(password);
    if (res.success) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('xii_dkv_admin_auth', 'true');
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('xii_dkv_admin_auth');
  };

  // Open form for a specific student
  const handleSelectStudentForForm = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open detail modal
  const handleOpenDetail = (student: Student) => {
    setDetailStudent(student);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleAdminLogout}
        settings={settings}
        stats={
          stats
            ? {
                totalStudents: stats.totalStudents,
                completedStudents: stats.completedStudents,
              }
            : undefined
        }
      />

      <main className="flex-1 pb-16">
        {isLoading && students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">
              Menghubungkan ke database server multi-perangkat...
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'form' && (
              <StudentForm
                students={students}
                onSave={handleSaveStudent}
                onAddNewStudent={handleAddNewStudent}
                preselectedStudentId={selectedStudentId}
                onSelectAnotherStudent={() => setSelectedStudentId(null)}
                settings={settings}
              />
            )}

            {currentTab === 'list' && (
              <ClassPublicView
                students={students}
                onSelectStudent={handleSelectStudentForForm}
                onOpenDetail={handleOpenDetail}
                onGoToAdmin={() => setCurrentTab('admin')}
                settings={settings}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                students={students}
                stats={stats}
                settings={settings}
                onSaveSettings={handleSaveSettings}
                isLoggedIn={isAdminLoggedIn}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
                onRefreshData={loadData}
                onSaveStudent={handleAdminSaveStudent}
                onDeleteStudent={handleDeleteStudent}
                onViewStudentDetail={handleOpenDetail}
              />
            )}
          </>
        )}
      </main>

      {/* Global Student Detail Modal */}
      <StudentDetailModal
        student={detailStudent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        settings={settings}
        onEdit={(std) => {
          setSelectedStudentId(std.id);
          setCurrentTab('form');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            {settings.schoolName} • {settings.className}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Wali Kelas: {settings.waliKelasName} {settings.waliKelasNip ? `(NIP. ${settings.waliKelasNip})` : ''} • Tahun Ajaran {settings.academicYear} • Database Multi-Perangkat
          </p>
        </div>
      </footer>
    </div>
  );
}
