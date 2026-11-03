import type { Student, ClassStats, AdminAuthResponse, SchoolSettings } from '../types/student.ts';
import { firestoreService } from './firestoreService.ts';

export const api = {
  async getStudents(): Promise<Student[]> {
    return firestoreService.getStudents();
  },

  subscribeStudents(callback: (students: Student[]) => void) {
    return firestoreService.subscribeStudents(callback);
  },

  async getStudent(id: string): Promise<Student> {
    const students = await firestoreService.getStudents();
    const student = students.find((s) => s.id === id);
    if (!student) throw new Error('Siswa tidak ditemukan');
    return student;
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    return firestoreService.updateStudent(id, data);
  },

  async addStudent(data: Partial<Student>): Promise<Student> {
    return firestoreService.addStudent(data);
  },

  async deleteStudent(id: string): Promise<void> {
    return firestoreService.deleteStudent(id);
  },

  async adminLogin(password: string): Promise<AdminAuthResponse> {
    return firestoreService.adminLogin(password);
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return firestoreService.changePassword(oldPassword, newPassword);
  },

  async resetData(mode: 'default' | 'sample' | 'clear', password: string): Promise<{ success: boolean; message: string; count: number }> {
    return firestoreService.resetData(mode, password);
  },

  async getStats(): Promise<ClassStats> {
    const students = await firestoreService.getStudents();
    return firestoreService.calculateStats(students);
  },

  async getSettings(): Promise<SchoolSettings> {
    return firestoreService.getSettings();
  },

  subscribeSettings(callback: (settings: SchoolSettings) => void) {
    return firestoreService.subscribeSettings(callback);
  },

  async updateSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    return firestoreService.updateSettings(settings);
  },
};
