import { useState, FormEvent } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import type { BlogPost } from "../data/blogPosts";
import { uploadFile } from "../../lib/storage";

interface BlogPostFormProps {
  post?: BlogPost;
  onClose: () => void;
  onSave: (post: Omit<BlogPost, "id"> & { id?: string }) => void;
}

export function BlogPostForm({ post, onClose, onSave }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    author: post?.author || "",
    image_url: post?.image_url || "",
    date: post?.date || new Date().toISOString().split("T")[0],
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
      const publicUrl = await uploadFile(file, "blog-images");

      if (publicUrl) {
        setFormData({ ...formData, image_url: publicUrl });
      } else {
        alert("Gagal mengupload gambar. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate image
    if (!formData.image_url) {
      alert("Silakan upload gambar atau masukkan URL gambar");
      return;
    }

    // Convert plain text content to simple HTML
    const contentWithParagraphs = formData.content
      .split("\n\n")
      .map((para) => {
        const trimmed = para.trim();
        if (!trimmed) return "";

        // Check if it's a heading (starts with ##)
        if (trimmed.startsWith("## ")) {
          return `<h3>${trimmed.substring(3)}</h3>`;
        }

        // Check if it's a list item (starts with -)
        if (trimmed.includes("\n- ")) {
          const items = trimmed
            .split("\n")
            .filter(line => line.trim().startsWith("- "))
            .map(line => `<li>${line.substring(2).trim()}</li>`)
            .join("\n");
          return `<ul>\n${items}\n</ul>`;
        }

        // Regular paragraph
        return `<p>${trimmed}</p>`;
      })
      .filter(Boolean)
      .join("\n\n");

    onSave({
      id: post?.id,
      ...formData,
      content: contentWithParagraphs,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {post ? "Edit Artikel" : "Tambah Artikel Baru"}
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
            <label className="block mb-2 font-semibold">Judul Artikel *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Kegiatan Bakti Sosial 2024"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Ringkasan/Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Ringkasan singkat yang muncul di card (1-2 kalimat)"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Konten Artikel *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              rows={15}
              placeholder="Tulis artikel Anda di sini...&#10;&#10;Tips:&#10;- Pisahkan paragraf dengan baris kosong (Enter 2x)&#10;- Untuk heading, awali dengan: ## Judul Bagian&#10;- Untuk list, awali dengan: - Item pertama"
              required
            />
            <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded">
              <strong>Cara menulis:</strong>
              <ul className="mt-2 space-y-1">
                <li>• <strong>Paragraf baru:</strong> Tekan Enter 2x</li>
                <li>• <strong>Heading:</strong> <code className="bg-muted px-1">## Judul Bagian</code></li>
                <li>• <strong>List:</strong> Setiap baris mulai dengan <code className="bg-muted px-1">-</code></li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Penulis *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Tim Media PPI AIU"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Gambar Artikel *</label>

            <div className="space-y-3">
              {/* File Upload Option */}
              <div>
                <label className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg ${uploading ? 'cursor-wait' : 'cursor-pointer hover:border-primary hover:bg-muted/30'} transition-colors`}>
                  <div className="text-center">
                    {uploading ? (
                      <>
                        <Loader2 className="mx-auto h-12 w-12 text-primary mb-2 animate-spin" />
                        <span className="text-sm text-primary font-semibold">
                          Mengupload gambar...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Klik untuk upload gambar
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
                value={formData.image_url.startsWith("data:") ? "" : formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Preview:</p>
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold">Tanggal *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
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
              {post ? "Simpan Perubahan" : "Tambah Artikel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
