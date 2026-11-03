import type { Student, ClassStats, AdminAuthResponse, SchoolSettings } from '../types/student.ts';

const API_BASE = '/api';

export const api = {
  async getStudents(): Promise<Student[]> {
    const res = await fetch(`${API_BASE}/students`);
    if (!res.ok) throw new Error('Gagal mengambil data siswa');
    const json = await res.json();
    return json.data || [];
  },

  async getStudent(id: string): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Siswa tidak ditemukan');
    const json = await res.json();
    return json.data;
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal memperbarui data siswa');
    }
    return json.data;
  },

  async addStudent(data: Partial<Student>): Promise<Student> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal menambahkan siswa baru');
    }
    return json.data;
  },

  async deleteStudent(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal menghapus siswa');
    }
  },

  async adminLogin(password: string): Promise<AdminAuthResponse> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Password salah');
    }
    return json;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal mengganti password');
    }
    return json;
  },

  async resetData(mode: 'default' | 'sample' | 'clear', password: string): Promise<{ success: boolean; message: string; count: number }> {
    const res = await fetch(`${API_BASE}/admin/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal melakukan reset data');
    }
    return json;
  },

  async getStats(): Promise<ClassStats> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Gagal memuat statistik');
    const json = await res.json();
    return json.data;
  },

  async getSettings(): Promise<SchoolSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Gagal memuat pengaturan sekolah');
    const json = await res.json();
    return json.data;
  },

  async updateSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal menyimpan pengaturan');
    }
    return json.data;
  },
};
