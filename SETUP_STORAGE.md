# Setup Supabase Storage Buckets

## Masalah
Ketika Anda mencoba upload gambar di Admin Dashboard, gambar tidak muncul karena **Storage Buckets belum dibuat** di Supabase.

## Solusi: Buat Buckets di Supabase Dashboard

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Kunjungi: https://supabase.com/dashboard/project/clfgsfdnyvdjgcevafzw/storage/buckets
   - Login dengan akun Supabase Anda

2. **Buat 3 Buckets berikut:**

   #### Bucket 1: member-photos
   - Klik tombol **"New bucket"**
   - Name: `member-photos`
   - ✅ Centang **"Public bucket"** (penting!)
   - Klik **"Create bucket"**

   #### Bucket 2: blog-images
   - Klik tombol **"New bucket"** lagi
   - Name: `blog-images`
   - ✅ Centang **"Public bucket"** (penting!)
   - Klik **"Create bucket"**

   #### Bucket 3: documents
   - Klik tombol **"New bucket"** lagi
   - Name: `documents`
   - ✅ Centang **"Public bucket"** (penting!)
   - Klik **"Create bucket"**

3. **Verifikasi**
   - Anda sekarang harus melihat 3 buckets di Storage dashboard:
     - ✅ member-photos (public)
     - ✅ blog-images (public)
     - ✅ documents (public)

4. **Coba Upload Lagi**
   - Kembali ke Admin Dashboard website Anda
   - Coba upload foto anggota atau artikel lagi
   - Seharusnya sekarang berhasil!

## Catatan Penting

- **Public bucket** diperlukan agar gambar yang diupload bisa diakses oleh pengunjung website
- Jika bucket tidak public, foto akan gagal dimuat di halaman publik
- Setiap bucket punya limit 5MB per file (sudah dikonfigurasi di kode)

## Troubleshooting

### Upload masih gagal?
- Pastikan semua bucket sudah dibuat dengan nama yang **persis sama** (case-sensitive)
- Pastikan semua bucket diset sebagai **Public**
- Cek browser console (F12) untuk melihat error message detail
- Verifikasi Supabase credentials di `src/lib/supabase.ts` masih valid

### Gambar lama tidak muncul?
- Gambar yang diupload sebelum bucket dibuat tidak akan tersimpan
- Anda perlu upload ulang gambar-gambar tersebut
- Atau gunakan URL eksternal (Unsplash, Imgur, etc.) sebagai alternatif
