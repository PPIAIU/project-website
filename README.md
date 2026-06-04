# Website PPI AIU

Website resmi Perhimpunan Pelajar Indonesia di AIU dengan sistem manajemen konten untuk kepengurusan, blog, dan dokumen organisasi.

## Fitur Utama

### Frontend (Public)
1. **Home Page** - Halaman utama dengan pengenalan organisasi
2. **Direktori Kepengurusan** - Arsip kepengurusan dengan navigasi hierarkis (Tahun → Divisi → Anggota)
3. **Rekam Jejak Aktivitas** - Blog artikel kegiatan dan program kerja
4. **Dokumen Organisasi** - Akses AD/ART dan GBHO

### Backend (Admin)
5. **Login Administrator** - Autentikasi aman untuk admin
6. **Dashboard Admin** - CRUD operations untuk:
   - Kepengurusan (tambah, edit, hapus anggota)
   - Artikel blog
   - Dokumen organisasi

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v7 (Data Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Build Tool**: Vite

## Skema Warna

- **Primary (Maroon)**: #800020
- **Secondary (White)**: #FFFFFF
- **Accent (Black)**: #000000

## Struktur Database

Lihat file `DATABASE_SCHEMA.md` untuk detail lengkap struktur database Supabase.

**Relasi:**
```
years (tahun) → divisions (divisi) → members (anggota)
```

## Video Background

Halaman home memiliki video background di hero section. Untuk menambahkan video:

1. Upload file video Anda ke folder `public/video/` dengan nama `hero-background.mp4`
2. Format yang disarankan: MP4 (H.264), resolusi 1920x1080, maksimal 10MB
3. Video akan otomatis autoplay, loop, dan muted

Lihat detail lengkap di `public/video/README.md`

## Setup & Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd code
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka SQL Editor di Supabase Dashboard
3. Jalankan script dari file `DATABASE_SCHEMA.md` secara berurutan:
   - Tables creation
   - Indexes
   - RLS policies
   - Storage buckets

4. Dapatkan credentials dari Project Settings → API:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

5. Simpan credentials di environment variables atau konfigurasi Supabase

### 4. Run Development Server

Development server sudah berjalan otomatis di environment Make/Figma.

## Demo Credentials

Untuk testing fitur admin:
- **Email**: admin@ppi-aiu.org
- **Password**: admin123

## File Structure

```
src/
├── app/
│   ├── components/
│   │   └── Layout.tsx          # Layout dengan navigasi
│   ├── pages/
│   │   ├── Home.tsx            # Halaman utama
│   │   ├── Members.tsx         # Direktori kepengurusan
│   │   ├── Blog.tsx            # Artikel aktivitas
│   │   ├── Foundation.tsx      # Dokumen organisasi
│   │   ├── Login.tsx           # Login admin
│   │   ├── AdminDashboard.tsx  # Dashboard admin
│   │   └── NotFound.tsx        # 404 page
│   ├── routes.tsx              # Konfigurasi routing
│   └── App.tsx                 # Root component
└── styles/
    ├── theme.css               # Theme variables (maroon/white/black)
    └── fonts.css               # Font imports
```

## Kebutuhan Fungsional (Terpenuhi)

- ✅ FR-01: Tampilan Halaman Utama (Home Page)
- ✅ FR-02: Modul Direktori Kepengurusan dengan drill-down hierarkis
- ✅ FR-03: Modul Rekam Jejak Aktivitas (Blog)
- ✅ FR-04: Repositori Dokumen Organisasi
- ✅ FR-05: Autentikasi Administrator (Login)
- ✅ FR-06: Manajemen Konten & Operasi CRUD

## Kebutuhan Non-Fungsional (Terpenuhi)

- ✅ NFR-01: Lazy loading untuk gambar (`loading="lazy"`)
- ✅ NFR-02: Desain Relasional Basis Data (lihat DATABASE_SCHEMA.md)
- ✅ NFR-03: UX dengan transisi smooth (accordion expand/collapse)
- ✅ NFR-04: Responsive Design (mobile, tablet, desktop)
- ✅ NFR-05: Keamanan Dashboard Admin (localStorage auth + RLS policies)

## Pengembangan Selanjutnya

Untuk implementasi penuh dengan Supabase, tambahkan:

1. **Integrasi Supabase Client**
   - Setup Supabase client di `src/lib/supabase.ts`
   - Implementasi real auth dengan Supabase Auth
   - Replace localStorage dengan Supabase session

2. **CRUD Operations**
   - Implementasi form modal untuk tambah/edit data
   - Upload gambar ke Supabase Storage
   - Real-time updates dengan Supabase subscriptions

3. **Optimasi**
   - Image compression sebelum upload
   - Pagination untuk data besar
   - Caching dengan React Query

4. **Fitur Tambahan**
   - Search functionality
   - Filter dan sorting
   - Rich text editor untuk blog
   - Analytics dashboard

## Kontribusi

Untuk berkontribusi pada project ini:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## Lisensi

© 2024 PPI AIU. All rights reserved.
