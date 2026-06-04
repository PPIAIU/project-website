# Cara Kompres Video untuk Web

Video Anda saat ini: **37MB** - Terlalu besar!  
Target ideal: **5-10MB** (maksimal 15MB)

## Opsi 1: Kompres Online (Paling Mudah)

### A. CloudConvert (Gratis)
1. Buka: https://cloudconvert.com/mp4-converter
2. Upload `hero_background.mp4`
3. Settings:
   - Codec: H.264
   - Resolution: 1920x1080 atau 1280x720
   - Bitrate: 1000-2000 kbps
   - Quality: Medium
4. Convert & Download

### B. Clideo (Gratis)
1. Buka: https://clideo.com/compress-video
2. Upload video
3. Pilih compression level: Medium atau High
4. Download hasil

## Opsi 2: Software Desktop (Lebih Kontrol)

### HandBrake (Gratis, Windows/Mac/Linux)
1. Download: https://handbrake.fr/
2. Settings untuk web:
   ```
   - Format: MP4
   - Video Codec: H.264
   - Framerate: 24 atau 30 fps
   - Quality: RF 23-28 (lebih tinggi = lebih kecil file)
   - Resolution: 1920x1080 atau 1280x720
   - Audio: AAC, 128kbps atau hapus audio
   ```

### FFmpeg (Command Line)
```bash
# Kompres dengan kualitas bagus (target 5-10MB)
ffmpeg -i hero_background.mp4 -vcodec h264 -acodec aac -b:v 1000k -b:a 128k hero_background_compressed.mp4

# Kompres lebih agresif (target 3-5MB)
ffmpeg -i hero_background.mp4 -vcodec h264 -b:v 500k hero_background_compressed.mp4

# Resize + kompres (jika resolusi terlalu besar)
ffmpeg -i hero_background.mp4 -vf scale=1280:720 -vcodec h264 -b:v 1000k hero_background_compressed.mp4
```

## Opsi 3: Tips Tambahan

### Potong Durasi
Video background ideal hanya 10-20 detik (akan loop otomatis):
```bash
# Potong 15 detik pertama
ffmpeg -i hero_background.mp4 -t 15 -c copy hero_background_short.mp4
```

### Hapus Audio
Video background tidak butuh audio:
```bash
ffmpeg -i hero_background.mp4 -an -vcodec copy hero_background_noaudio.mp4
```

## Target Ukuran File

| Ukuran File | Kualitas | Waktu Loading (4G) |
|------------|----------|-------------------|
| 3-5 MB     | Good     | 1-2 detik         |
| 5-10 MB    | Better   | 2-4 detik         |
| 10-15 MB   | Best     | 4-6 detik         |
| 37 MB      | ❌ Too Big | 15-20 detik      |

## Setelah Kompres

1. Ganti file lama dengan file baru (nama tetap sama: `hero_background.mp4`)
2. Letakkan di folder: `src/imports/`
3. Refresh browser - video akan loading jauh lebih cepat!

## Alternatif: Gunakan Gambar + Pattern

Jika video tetap lambat, pertimbangkan menggunakan:
- Gambar background berkualitas tinggi (500KB-1MB)
- Animated gradient
- Parallax effect dengan gambar

Mari tahu jika butuh bantuan implementasi alternatif ini!
