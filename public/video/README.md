# Video Background

## Cara Menambahkan Video Background

1. **Upload video Anda** ke folder ini dengan nama: `hero-background.mp4`

2. **Format yang disarankan:**
   - Format: MP4 (H.264 codec)
   - Resolusi: 1920x1080 atau lebih tinggi
   - Durasi: 10-30 detik (akan loop otomatis)
   - Ukuran file: Maksimal 5-10MB untuk loading cepat

3. **Tips Optimasi Video:**
   - Kompres video untuk web (gunakan tools seperti HandBrake atau online compressor)
   - Gunakan bitrate rendah untuk ukuran file lebih kecil
   - Video akan otomatis autoplay, loop, dan muted

4. **Alternatif Format:**
   Jika ingin menambahkan format video lain sebagai fallback:
   ```html
   <video autoPlay loop muted playsInline>
     <source src="/video/hero-background.mp4" type="video/mp4" />
     <source src="/video/hero-background.webm" type="video/webm" />
   </video>
   ```

## Fallback

Jika video tidak tersedia, background akan tetap menggunakan warna maroon solid (#800020).

## Contoh Video yang Cocok

- Video kampus atau gedung universitas
- Video kegiatan organisasi PPI
- Video bendera Indonesia berkibar
- Video mahasiswa belajar atau berinteraksi
- Video abstract/motion graphics dengan tema merah maroon
