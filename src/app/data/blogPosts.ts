// Shared data source untuk blog posts
// Nanti bisa diganti dengan fetch dari Supabase

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image_url: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Kegiatan Bakti Sosial 2024",
    excerpt:
      "PPI AIU mengadakan kegiatan bakti sosial untuk membantu masyarakat sekitar kampus dengan memberikan bantuan sembako dan perlengkapan sekolah.",
    author: "Tim Media PPI AIU",
    date: "2024-05-15",
    image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    content: `
      <p>PPI AIU dengan bangga mengumumkan keberhasilan pelaksanaan kegiatan Bakti Sosial 2024 yang diadakan pada tanggal 15 Mei 2024. Kegiatan ini merupakan wujud kepedulian anggota PPI AIU terhadap masyarakat sekitar kampus.</p>

      <h3>Latar Belakang</h3>
      <p>Kegiatan bakti sosial ini diselenggarakan sebagai bentuk kontribusi nyata PPI AIU dalam membantu masyarakat yang membutuhkan, khususnya di wilayah sekitar kampus AIU. Program ini telah menjadi agenda rutin tahunan yang dinanti-nantikan.</p>

      <h3>Pelaksanaan Kegiatan</h3>
      <p>Acara dimulai pukul 08.00 pagi dengan pembagian sembako dan perlengkapan sekolah kepada lebih dari 100 keluarga yang membutuhkan. Tim relawan yang terdiri dari 50 anggota PPI AIU bekerja dengan penuh semangat untuk memastikan distribusi berjalan lancar.</p>

      <h3>Bantuan yang Diberikan</h3>
      <ul>
        <li>Paket sembako (beras, minyak, gula, dll) untuk 100 keluarga</li>
        <li>Perlengkapan sekolah (tas, buku tulis, alat tulis) untuk 150 anak</li>
        <li>Layanan kesehatan gratis (pengecekan tekanan darah dan gula darah)</li>
        <li>Penyuluhan kesehatan dan gizi</li>
      </ul>

      <h3>Apresiasi dan Terima Kasih</h3>
      <p>Kegiatan ini tidak akan terlaksana tanpa dukungan dari berbagai pihak. Kami mengucapkan terima kasih kepada seluruh donatur, sponsor, dan relawan yang telah berkontribusi dalam kesuksesan acara ini.</p>

      <p>Kami berharap kegiatan bakti sosial ini dapat memberikan manfaat yang nyata bagi masyarakat dan menjadi inspirasi untuk terus berbagi kepada sesama.</p>
    `,
  },
  {
    id: "2",
    title: "Webinar Beasiswa Luar Negeri",
    excerpt:
      "Menghadirkan narasumber alumni yang berhasil mendapatkan beasiswa untuk melanjutkan studi S2 dan S3 di berbagai negara.",
    author: "Divisi Akademik",
    date: "2024-04-20",
    image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    content: `
      <p>Divisi Akademik PPI AIU menyelenggarakan webinar bertema "Meraih Mimpi: Panduan Beasiswa Luar Negeri" pada 20 April 2024. Acara ini menghadirkan tiga narasumber alumni PPI AIU yang telah sukses mendapatkan beasiswa untuk melanjutkan studi ke jenjang yang lebih tinggi.</p>

      <h3>Narasumber</h3>
      <ul>
        <li><strong>Dr. Ahmad Fauzi</strong> - Penerima beasiswa LPDP untuk S3 di University of Oxford</li>
        <li><strong>Siti Rahmawati, M.Sc</strong> - Penerima Chevening Scholarship untuk S2 di London School of Economics</li>
        <li><strong>Budi Santoso, Ph.D</strong> - Penerima Fulbright Scholarship untuk S3 di MIT</li>
      </ul>

      <h3>Materi yang Dibahas</h3>
      <p>Webinar ini membahas berbagai aspek penting dalam proses aplikasi beasiswa, mulai dari persiapan dokumen, tips menulis motivation letter, hingga strategi menghadapi interview.</p>

      <p>Para peserta juga mendapat kesempatan untuk bertanya langsung kepada narasumber mengenai pengalaman mereka dalam proses aplikasi beasiswa dan kehidupan selama studi di luar negeri.</p>

      <h3>Antusiasme Peserta</h3>
      <p>Lebih dari 200 peserta mengikuti webinar ini secara online. Antusiasme yang tinggi terlihat dari banyaknya pertanyaan yang masuk selama sesi tanya jawab.</p>
    `,
  },
  {
    id: "3",
    title: "Perayaan Hari Kemerdekaan Indonesia",
    excerpt:
      "Merayakan HUT RI ke-79 dengan berbagai lomba dan acara budaya yang melibatkan seluruh mahasiswa Indonesia di AIU.",
    author: "Divisi Sosial",
    date: "2024-08-17",
    image_url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800",
  },
  {
    id: "4",
    title: "Workshop Kewirausahaan",
    excerpt:
      "Pelatihan dan workshop tentang memulai bisnis bagi mahasiswa dengan menghadirkan pengusaha muda sukses sebagai pembicara.",
    author: "Divisi Ekonomi",
    date: "2024-03-10",
    image_url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
  },
  {
    id: "5",
    title: "Studi Banding ke Organisasi PPI Lain",
    excerpt:
      "Kegiatan studi banding untuk bertukar pengalaman dan best practices dalam mengelola organisasi mahasiswa Indonesia di luar negeri.",
    author: "Ketua Umum",
    date: "2024-02-28",
    image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
  },
  {
    id: "6",
    title: "Gathering Akhir Tahun 2023",
    excerpt:
      "Acara perpisahan dan silaturahmi antar anggota PPI AIU sebagai penutup kegiatan tahun 2023 sekaligus menyambut tahun baru.",
    author: "Panitia Acara",
    date: "2023-12-20",
    image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
  },
];

// Fungsi helper untuk mendapatkan post terbaru
export function getRecentPosts(limit: number = 3): BlogPost[] {
  return blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
