# 🌐 Panduan Migrasi Domain Website (SEO-Friendly)

Dokumen ini berisi langkah-langkah standar industri untuk memindahkan domain website lama (misal: dari `.vercel.app`) ke domain baru (misal: `.com` atau `.id`) tanpa merusak atau menghilangkan reputasi SEO yang sudah ada di Google.

---

## 📋 Langkah-Langkah Utama

### 1. Pasang Pengalihan Permanen (301 Redirect)
Ini adalah langkah paling krusial agar pengunjung manusia dan robot Google otomatis dialihkan ke alamat yang baru.
* **Prinsip Kerja:** Mengalihkan `domain-lama.com/halaman-a` secara otomatis ke `domain-baru.com/halaman-a`.
* **Cara di Vercel:** 
  1. Masuk ke Dashboard Vercel > Pilih Proyek Kamu.
  2. Buka menu **Settings** > **Domains**.
  3. Tambahkan domain lama kamu, lalu klik *Edit* dan atur opsi **Redirect** menuju domain baru dengan status kode **301 (Moved Permanently)**.

### 2. Daftarkan Domain Baru ke Google Search Console
Kamu perlu memverifikasi ke Google bahwa kamu adalah pemilik sah dari alamat domain yang baru.
* Buka [Google Search Console](https://search.google.com/search-console/).
* Klik menu pilihan properti di pojok kiri atas, lalu pilih **Add Property** (Tambahkan Properti).
* Masukkan URL domain baru kamu dan selesaikan proses verifikasinya (biasanya menggunakan metode *DNS TXT Record* atau memasang *Meta Tag* di kode HTML).

### 3. Gunakan Fitur "Change of Address" (Ubah Alamat) di Google
Langkah ini secara resmi menyuruh sistem Google untuk mentransfer seluruh "reputasi dan ranking" dari domain lama ke domain baru.
* Pada Google Search Console, pastikan kamu sedang membuka properti **Domain Lama**.
* Masuk ke menu **Settings** (Pengaturan) di panel sebelah kiri.
* Cari dan klik fitur **Change of Address** (Perubahan Alamat).
* Ikuti instruksi di layar: Pilih properti **Domain Baru** (yang sudah diverifikasi di langkah 2), lalu klik **Submit**.

### 4. Kirimkan Sitemap Baru
Bantu robot Google mempercepat pendataan ulang semua halaman dengan alamat domain barumu.
* Di Google Search Console, ganti properti ke **Domain Baru**.
* Klik menu **Sitemaps** di panel sebelah kiri.
* Masukkan tautan sitemap baru kamu (contoh: `https://domain-baru.com/sitemap.xml`).
* Klik **Submit**.

---

## 💡 Tips Penting Setelah Migrasi

> ⚠️ **Pertahankan Domain Lama (Sangat Penting)**
> Jangan langsung menghapus atau mematikan domain lama! Biarkan domain lama tetap aktif dan melakukan fungsi *redirect* (Langkah 1) selama minimal **6 hingga 12 bulan**. Jika domain lama langsung dimatikan, link lama yang telanjur ada di internet/Google akan rusak (Error 404) dan merusak SEO.

* **Fluktuasi Trafik:** Sangat wajar jika dalam kurun waktu 1-3 minggu setelah pindahan, jumlah pengunjung agak naik-turun. Ini tanda Google sedang memproses pemindahan data di database mereka.
* **Cek Internal Link:** Pastikan di dalam kode program website kamu (misalnya di menu navigasi, footer, atau link artikel) tidak ada URL domain lama yang ditulis secara permanen (*hardcoded*). Ubah semuanya mengikuti domain baru atau gunakan *relative path* (seperti `/members` bukan `https://domain-lama.com/members`).