import { useState, FormEvent } from "react";
import { X, Upload, Loader2, FileText } from "lucide-react";
import { uploadFile } from "../../lib/storage";

interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
}

interface DocumentFormProps {
  document?: Document;
  onClose: () => void;
  onSave: (doc: Omit<Document, "id"> & { id?: string }) => void;
}

export function DocumentForm({ document, onClose, onSave }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    title: document?.title || "",
    description: document?.description || "",
    file_url: document?.file_url || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept PDF and images
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("File harus berupa gambar atau PDF");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setUploading(true);

    try {
      const publicUrl = await uploadFile(file, "documents");

      if (publicUrl) {
        setFormData({ ...formData, file_url: publicUrl });
      } else {
        alert("Gagal mengupload file. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat mengupload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.file_url) {
      alert("Silakan upload file atau masukkan URL file");
      return;
    }

    onSave({
      id: document?.id,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {document ? "Edit Dokumen" : "Tambah Dokumen Baru"}
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
            <label className="block mb-2 font-semibold">Judul Dokumen *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: AD/ART PPI AIU"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Deskripsi *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Deskripsi singkat tentang dokumen ini"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">File Dokumen *</label>

            <div className="space-y-3">
              {/* File Upload Option */}
              <div>
                <label className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg ${uploading ? 'cursor-wait' : 'cursor-pointer hover:border-primary hover:bg-muted/30'} transition-colors`}>
                  <div className="text-center">
                    {uploading ? (
                      <>
                        <Loader2 className="mx-auto h-12 w-12 text-primary mb-2 animate-spin" />
                        <span className="text-sm text-primary font-semibold">
                          Mengupload file...
                        </span>
                      </>
                    ) : (
                      <>
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Klik untuk upload dokumen
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF atau gambar (max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileUpload}
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
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/document.pdf"
              />
            </div>

            {/* File Preview */}
            {formData.file_url && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm font-semibold mb-2">File Uploaded:</p>
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{formData.file_url}</p>
                  </div>
                  <a
                    href={formData.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat
                  </a>
                </div>
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
              {document ? "Simpan Perubahan" : "Tambah Dokumen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
