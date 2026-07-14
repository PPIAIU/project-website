import { useState, useEffect, FormEvent } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { uploadFile } from "../../lib/storage";

interface Member {
  id: string;
  name: string;
  position: string;
  division: string;
  photo_url: string;
}

interface MemberFormProps {
  member?: Member;
  year: string;
  onClose: () => void;
  onSave: (member: Omit<Member, "id"> & { id?: string }) => void;
}

export function MemberForm({ member, year, onClose, onSave }: MemberFormProps) {
  const getInitialPosition = (url: string | null): number => {
    if (!url) return 0; // Default to top (0%) to match existing object-top style
    const match = url.match(/[?&]pos=(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const [formData, setFormData] = useState({
    name: member?.name || "",
    position: member?.position || "",
    division: member?.division || "",
    photo_url: member?.photo_url || "",
  });
  const [imagePosition, setImagePosition] = useState<number>(() =>
    getInitialPosition(member?.photo_url || null)
  );
  const [uploading, setUploading] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startPos, setStartPos] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartPos(imagePosition);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartPos(imagePosition);
  };

  // Global drag listener for mouse and touch events
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const containerHeight = 224; // h-56 is 14rem = 224px
      const deltaY = e.clientY - startY;
      const pctChange = (deltaY / containerHeight) * 100;
      let newPos = Math.round(startPos - pctChange);
      newPos = Math.max(0, Math.min(100, newPos));
      setImagePosition(newPos);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const containerHeight = 224;
      const deltaY = e.touches[0].clientY - startY;
      const pctChange = (deltaY / containerHeight) * 100;
      let newPos = Math.round(startPos - pctChange);
      newPos = Math.max(0, Math.min(100, newPos));
      setImagePosition(newPos);
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalTouchMove);
    window.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging, startY, startPos]);

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
      const publicUrl = await uploadFile(file, "member-photos", year);

      if (publicUrl) {
        setFormData({ ...formData, photo_url: publicUrl });
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

    if (!formData.photo_url) {
      alert("Silakan upload foto atau masukkan URL foto");
      return;
    }

    // Append/update position query parameter in photo_url
    let finalPhotoUrl = formData.photo_url;
    try {
      const urlObj = new URL(finalPhotoUrl);
      urlObj.searchParams.set("pos", imagePosition.toString());
      finalPhotoUrl = urlObj.toString();
    } catch (err) {
      const cleanUrl = finalPhotoUrl.replace(/[?&]pos=\d+/, "");
      const separator = cleanUrl.includes("?") ? "&" : "?";
      finalPhotoUrl = `${cleanUrl}${separator}pos=${imagePosition}`;
    }

    onSave({
      id: member?.id,
      ...formData,
      photo_url: finalPhotoUrl,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {member ? "Edit Anggota" : "Tambah Anggota Baru"} - {year}
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
            <label className="block mb-2 font-semibold">Nama Lengkap *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Ahmad Rizki"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Jabatan *</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Ketua Umum, Kepala Divisi, Anggota"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Divisi *</label>
            <input
              type="text"
              value={formData.division}
              onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Ketua & Wakil, Divisi Akademik, Divisi Sosial"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Foto Anggota *</label>

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
                          Klik untuk upload foto
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
                value={formData.photo_url.startsWith("data:") ? "" : formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {/* Image Preview & Position Slider */}
            {formData.photo_url && (
              <div className="mt-4 space-y-2">
                <label className="block font-semibold text-sm">Preview & Penyelarasan Foto (Klik & Geser Foto):</label>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div 
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className={`relative w-40 h-56 bg-muted/20 rounded-lg border-2 ${isDragging ? 'border-primary cursor-grabbing scale-[1.02]' : 'border-border cursor-grab hover:border-primary/50'} overflow-hidden select-none flex items-center justify-center group transition-all duration-200`}
                    title="Klik dan seret foto ke atas/bawah untuk menyesuaikan posisi"
                  >
                    <img
                      src={formData.photo_url}
                      alt="Preview"
                      style={{ objectPosition: `center ${imagePosition}%` }}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {/* Hover instructions overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mb-1 animate-bounce">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                      </svg>
                      <span className="text-xs font-semibold">Klik & Geser</span>
                      <span className="text-[10px] opacity-80">ke atas / bawah</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-2">
                    <p className="text-sm font-medium">Instruksi Penyelarasan:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      <li>Arahkan mouse ke atas foto anggota di sebelah kiri.</li>
                      <li><strong>Klik dan tahan</strong> tombol mouse, lalu <strong>geser ke atas atau ke bawah</strong> untuk menyelaraskan wajah anggota agar pas di tengah.</li>
                      <li>Posisi fokus saat ini: <strong className="text-primary">{imagePosition}%</strong></li>
                    </ul>
                    
                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Atas (0%)</span>
                        <span>Bawah (100%)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={imagePosition}
                        onChange={(e) => setImagePosition(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
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
              {member ? "Simpan Perubahan" : "Tambah Anggota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
