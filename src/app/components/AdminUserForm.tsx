import { useState, FormEvent } from "react";
import { X, ShieldCheck, User, Mail, Lock, Shield } from "lucide-react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "editor";
  created_at: string;
}

interface AdminUserFormProps {
  user?: AdminUser;
  onClose: () => void;
  onSave: (data: { name: string; email: string; password?: string; role: "super_admin" | "editor" }) => void;
}

export function AdminUserForm({ user, onClose, onSave }: AdminUserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "editor" as "super_admin" | "editor",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Nama dan email wajib diisi");
      return;
    }

    if (!user && !formData.password.trim()) {
      setError("Password wajib diisi untuk akun baru");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    onSave({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password ? formData.password : undefined,
      role: formData.role,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-bold">
              {user ? "Edit Akun Admin" : "Tambah Akun Admin Baru"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium text-sm">Nama Lengkap Admin *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Contoh: Ahmad - Divisi Medkom"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm">Email Login *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="admin.sub@ppi-aiu.org"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm">
              {user ? "Password Baru (Kosongkan jika tidak ingin diubah)" : "Password *"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="••••••••"
                required={!user}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm font-semibold">Peran / Hak Akses (Role) *</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.role === "editor"
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="editor"
                  checked={formData.role === "editor"}
                  onChange={() => setFormData({ ...formData, role: "editor" })}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <Shield size={16} className="text-blue-500" />
                    Editor
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mengelola Blog & berita. Tidak bisa ubah akun admin.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.role === "super_admin"
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="super_admin"
                  checked={formData.role === "super_admin"}
                  onChange={() => setFormData({ ...formData, role: "super_admin" })}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <ShieldCheck size={16} className="text-amber-500" />
                    Super Admin
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Akses penuh (Semua Konten & Kelola Akun Admin).
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-sm rounded-lg hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {user ? "Simpan Perubahan" : "Buat Akun Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
