# Database Schema untuk PPI AIU Website

## Overview

Database ini dirancang dengan struktur relasional yang efisien untuk mendukung semua kebutuhan fungsional website PPI AIU.

## Struktur Tabel

### 1. years (Tahun Kepengurusan)

```sql
CREATE TABLE years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year VARCHAR(4) NOT NULL UNIQUE,
  group_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. divisions (Divisi)

```sql
CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id UUID NOT NULL REFERENCES years(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year_id, name)
);
```

### 3. members (Anggota Kepengurusan)

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id UUID NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  photo_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  bio TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. blog_posts (Artikel/Aktivitas)

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  author VARCHAR(255),
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. documents (Dokumen Organisasi)

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size VARCHAR(50),
  document_type VARCHAR(100),
  version VARCHAR(20),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes untuk Optimasi Performa

```sql
-- Index untuk pencarian berdasarkan tahun
CREATE INDEX idx_divisions_year_id ON divisions(year_id);

-- Index untuk pencarian anggota berdasarkan divisi
CREATE INDEX idx_members_division_id ON members(division_id);

-- Index untuk sorting anggota
CREATE INDEX idx_members_sort_order ON members(sort_order);

-- Index untuk blog posts yang dipublikasi
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- Index untuk slug blog posts (untuk SEO-friendly URLs)
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Index untuk dokumen yang dipublikasi
CREATE INDEX idx_documents_published ON documents(published);
```

## Row Level Security (RLS) Policies

### Public Access (Read-Only)

```sql
-- Enable RLS
ALTER TABLE years ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public read access untuk semua tabel
CREATE POLICY "Public can view years" ON years FOR SELECT USING (true);
CREATE POLICY "Public can view divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public can view members" ON members FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public can view published documents" ON documents FOR SELECT USING (published = true);
```

### Admin Access (Full CRUD)

```sql
-- Admin dapat melakukan semua operasi (memerlukan autentikasi Supabase)
CREATE POLICY "Admins can do everything on years" ON years FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on divisions" ON divisions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on documents" ON documents FOR ALL USING (auth.role() = 'authenticated');
```

## Storage Bucket untuk File Upload

```sql
-- Bucket untuk foto anggota
INSERT INTO storage.buckets (id, name, public) VALUES ('member-photos', 'member-photos', true);

-- Bucket untuk gambar blog
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Bucket untuk dokumen organisasi
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Storage policies
CREATE POLICY "Public can view member photos" ON storage.objects FOR SELECT USING (bucket_id = 'member-photos');
CREATE POLICY "Authenticated users can upload member photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'member-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

## Sample Data Insert

```sql
-- Insert sample year
INSERT INTO years (year) VALUES ('2024'), ('2023'), ('2022');

-- Insert sample divisions (untuk tahun 2024)
WITH year_2024 AS (SELECT id FROM years WHERE year = '2024')
INSERT INTO divisions (year_id, name, description)
SELECT
  year_2024.id,
  name,
  description
FROM year_2024, (VALUES
  ('Ketua & Wakil', 'Pimpinan Organisasi'),
  ('Divisi Akademik', 'Mengelola kegiatan akademik'),
  ('Divisi Sosial', 'Mengelola kegiatan sosial'),
  ('Divisi Ekonomi', 'Mengelola keuangan dan kewirausahaan')
) AS divisions(name, description);

-- Insert sample members akan dilakukan melalui admin dashboard
```

## Migration: Menambah kolom group_photo_url ke tabel years

```sql
-- Jalankan jika tabel years sudah ada tanpa kolom group_photo_url
ALTER TABLE years ADD COLUMN IF NOT EXISTS group_photo_url TEXT;
```

## Cara Menjalankan Migration

1. Login ke Supabase Dashboard
2. Buka SQL Editor
3. Copy paste schema di atas secara berurutan
4. Jalankan setiap bagian (Tables → Indexes → RLS → Storage)
5. Verifikasi dengan mengecek tab Tables dan Storage

## Relasi Database

```
years (1) ──── (many) divisions
                        │
                        │
                        └──── (many) members

blog_posts (independent)
documents (independent)
```

## Notes untuk NFR-02 (Database Architecture)

Desain ini memenuhi NFR-02 dengan:

- ✅ Relasi yang jelas dan efisien (Year → Division → Members)
- ✅ Indexes untuk query performance
- ✅ Cascade delete untuk data integrity
- ✅ RLS policies untuk security
- ✅ Prepared untuk lazy loading dengan pagination
