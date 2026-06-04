import { useState, FormEvent } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { uploadFile } from "../../lib/storage";

interface YearFormProps {
  year?: string;
  groupPhotoUrl?: string;
  onClose: () => void;
  onSave: (data: { year: string; group_photo_url: string }) => void;
}

export function YearForm({ year, groupPhotoUrl, onClose, onSave }: YearFormProps) {
  const [formData, setFormData] = useState({
    year: year || new Date().getFullYear().toString(),
    group_photo_url: groupPhotoUrl || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);

    try {
      const publicUrl = await uploadFile(file, "member-photos", `group-${formData.year}`);

      if (publicUrl) {
        setFormData({ ...formData, group_photo_url: publicUrl });
      } else {
        alert("Gagal mengupload foto. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.group_photo_url) {
      alert("Silakan upload foto grup atau masukkan URL foto");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {year ? "Edit Tahun Kepengurusan" : "Tambah Tahun Kepengurusan Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Tahun *</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="2024"
              min="2020"
              max="2099"
              required
              disabled={!!year}
            />
            {year && (
              <p className="text-sm text-muted-foreground mt-1">
                Tahun tidak dapat diubah setelah dibuat
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold">Foto Grup Kepengurusan *</label>

            <div className="space-y-3">
              {/* File Upload Option */}
              <div>
                <label className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg ${uploading ? 'cursor-wait' : 'cursor-pointer hover:border-primary hover:bg-muted/30'} transition-colors`}>
                  <div className="text-center">
                    {uploading ? (
                      <>
                        <Loader2 className="mx-auto h-12 w-12 text-primary mb-2 animate-spin" />
                        <span className="text-sm text-primary font-semibold">
                          Mengupload foto...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Klik untuk upload foto grup
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG atau JPEG (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* OR divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">atau masukkan URL</span>
                </div>
              </div>

              {/* URL Input Option */}
              <input
                type="url"
                value={formData.group_photo_url.startsWith("data:") ? "" : formData.group_photo_url}
                onChange={(e) => setFormData({ ...formData, group_photo_url: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/group-photo.jpg"
              />
            </div>

            {/* Image Preview */}
            {formData.group_photo_url && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Preview:</p>
                <img
                  src={formData.group_photo_url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {year ? "Simpan Perubahan" : "Tambah Tahun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
