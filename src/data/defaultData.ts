import { ServiceItem, BusinessConfig, TimeSlotOption } from '../types';

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  businessName: 'Home Care Sehat Utama',
  tagline: 'Perawatan Kesehatan Profesional, Nyaman di Rumah Anda',
  logoUrl: '',
  whatsappNumber: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  email: 'layanan@homecaresehat.id',
  address: 'Jl. Kesehatan Raya No. 42, Jakarta Selatan, DKI Jakarta 12430',
  operationalHours: 'Senin - Minggu: 07.00 - 21.00 WIB (Kunjungan Sesuai Jadwal Perjanjian)',
  serviceArea: 'Wilayah Layanan: Jakarta Selatan, Jakarta Timur, Depok, dan Tangerang Selatan (Radius hingga 25 km)',
  googleWebAppUrl: '', // Dapat diisi URL deployment Google Apps Script Web App
  confirmationNotice: 'Permintaan booking Anda sedang diverifikasi oleh admin. Kami akan menghubungi Anda via WhatsApp maksimal dalam 30 menit pada jam operasional untuk konfirmasi ketersediaan perawat.',
  cancellationPolicy: 'Perubahan atau pembatalan jadwal dapat dilakukan tanpa biaya maksimal 3 jam sebelum waktu kunjungan yang telah disepakati.',
  privacyInfo: 'Data pribadi dan ringkasan kondisi kesehatan pasien dilindungi secara ketat dan hanya digunakan untuk keperluan koordinasi kunjungan tenaga kesehatan berwenang.',
  licenseInfo: 'Layanan beroperasi berkolaborasi dengan Fasilitas Pelayanan Kesehatan / Klinik Pratama Terdaftar (Izin Operasional No: KLN-503/440/DINKES/2024)'
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'SRV-01',
    name: 'Kunjungan Perawat (Nurse Visit)',
    category: 'Pelayanan Dasar',
    description: 'Kunjungan perawat berizin untuk pemantauan kondisi umum, pemeriksaan tanda-tanda vital, serta edukasi kesehatan dasar keluarga.',
    scope: [
      'Pemeriksaan tanda vital (Tekanan darah, nadi, laju nafas, suhu, saturasi O2 SpO2)',
      'Pemeriksaan fisik umum dan wawancara keluhan pasien',
      'Pemberian obat oral/topikal sesuai petunjuk dokter yang merawat',
      'Edukasi perawatan dasar dan pola nutrisi kepada keluarga'
    ],
    duration: '± 45 - 60 Menit',
    price: 150000,
    priceFormatted: 'Rp 150.000',
    requirements: [
      'Ada pendamping keluarga di rumah saat kunjungan',
      'Tersedia riwayat resep obat bila ada terapi berjalan'
    ],
    serviceArea: 'Jabodetabek (Radius 20 km)',
    isActive: true,
    image: '/src/assets/images/nurse_vital_check_1792992400055.jpg'
  },
  {
    id: 'SRV-02',
    name: 'Perawatan Lansia (Elderly Care)',
    category: 'Pendampingan Geriatri',
    description: 'Bantuan perawatan harian penuh kasih bagi orang tua atau pasien lansia untuk menjaga kenyamanan, kebersihan, dan keselamatan di rumah.',
    scope: [
      'Bantuan kebersihan diri (mandi di tempat tidur/kamar mandi, oral hygiene, ganti pakaian)',
      'Pemantauan kenyamanan dan mobilitas posisi (cegah luka tekan/dekubitus)',
      'Pendampingan latihan gerak ringan (ROM pasif/aktif)',
      'Pengingat dan pendampingan minum obat tepat waktu'
    ],
    duration: '± 90 - 120 Menit / sesi',
    price: 225000,
    priceFormatted: 'Rp 225.000',
    requirements: [
      'Informasikan riwayat mobilitas (tirah baring, kursi roda, atau jalan sendiri)',
      'Keluarga menyiapkan perlengkapan mandi/pribadi lansia'
    ],
    serviceArea: 'Jabodetabek (Radius 25 km)',
    isActive: true,
    image: '/src/assets/images/elderly_care_home_1792992399992.jpg'
  },
  {
    id: 'SRV-03',
    name: 'Perawatan Luka (Wound Care)',
    category: 'Tindakan Keperawatan',
    description: 'Perawatan dan penggantian balutan luka secara steril dengan teknik modern dressing oleh perawat tersertifikasi kompetensi luka.',
    scope: [
      'Asesmen luka (pengukuran dimensi, jenis dasar luka, eksudat, tepi luka)',
      'Pembersihan luka secara aseptik dengan cairan fisiologis steril',
      'Aplikasi balutan luka modern sesuai kondisi luka (hidrogel/foam/alginat)',
      'Edukasi cara menjaga kebersihan balutan di sela kunjungan'
    ],
    duration: '± 60 Menit',
    price: 275000,
    priceFormatted: 'Rp 275.000',
    requirements: [
      'Telah dilakukan pemeriksaan awal oleh dokter/spesialis',
      'Harga belum termasuk material balutan modern khusus jika diperlukan'
    ],
    serviceArea: 'Jabodetabek (Radius 20 km)',
    isActive: true,
    image: '/src/assets/images/sterile_wound_care_1792992400683.jpg'
  },
  {
    id: 'SRV-04',
    name: 'Pemeriksaan Kesehatan di Rumah',
    category: 'Skrining & Cek Kesehatan',
    description: 'Skrining kesehatan berkala langsung di rumah mencakup pemeriksaan tanda vital dan cek biomarker cepat (Point of Care Testing).',
    scope: [
      'Pemeriksaan tekanan darah, nadi, dan saturasi oksigen',
      'Pemeriksaan Gula Darah Sewaktu (GDS)',
      'Pemeriksaan Kolesterol Total & Asam Urat (strip POCT)',
      'Konsultasi edukasi gaya hidup sehat berdasarkan hasil tes'
    ],
    duration: '± 45 Menit',
    price: 185000,
    priceFormatted: 'Rp 185.000',
    requirements: [
      'Pasien dianjurkan puasa 8-10 jam bila menghendaki pemeriksaan gula darah puasa',
      'Alat tes steril dan jarum sekali pakai disediakan perawat'
    ],
    serviceArea: 'Jabodetabek (Radius 20 km)',
    isActive: true,
    image: '/src/assets/images/nurse_vital_check_1792992400055.jpg'
  },
  {
    id: 'SRV-05',
    name: 'Pendampingan Pasca Rawat Inap',
    category: 'Transisi RS ke Rumah',
    description: 'Bantuan pemulihan terarah setelah pasien keluar dari rumah sakit (discharge care) agar terapi tetap berjalan optimal dan teratur.',
    scope: [
      'Review resume medis kepulangan dan instruksi dokter spesialis',
      'Pemantauan status hidrasi, nutrisi, dan tanda komplikasi pasca rawat',
      'Edukasi tanda bahaya (red flags) yang mengharuskan kembali ke RS',
      'Koordinasi jadwal kontrol dokter dan kepatuhan minum obat'
    ],
    duration: '± 75 - 90 Menit',
    price: 250000,
    priceFormatted: 'Rp 250.000',
    requirements: [
      'Menyiapkan salinan Resume Medis / Surat Kontrol dari Rumah Sakit',
      'Obat-obatan pulang dari RS sudah tersedia di rumah'
    ],
    serviceArea: 'Jabodetabek (Radius 25 km)',
    isActive: true,
    image: '/src/assets/images/hero_home_care_1792992399585.jpg'
  },
  {
    id: 'SRV-06',
    name: 'Layanan Khusus (Special Procedure)',
    category: 'Prosedur Medis Tertentu',
    description: 'Prosedur keperawatan khusus seperti penggantian selang kateter urin, selang NGT/sonde makan, atau injeksi atas instruksi resmi dokter.',
    scope: [
      'Pemasangan atau penggantian kateter urin foley steril (sesuai indikasi)',
      'Pemasangan atau penggantian pipa NGT (nasogastric tube) sonde',
      'Penyuntikan intramuskular/subkutan (misal: vitamin/insulin) berdasar resep dokter',
      'Pemberian nebulizer untuk keluhan sesak asma ringan'
    ],
    duration: '± 60 - 75 Menit',
    price: 300000,
    priceFormatted: 'Rp 300.000',
    requirements: [
      'Wajib memiliki resep dokter atau surat pengantar tindakan medis',
      'Persetujuan tindakan medis tertulis (Informed Consent) oleh keluarga pasien'
    ],
    serviceArea: 'Jabodetabek (Radius 20 km)',
    isActive: true,
    image: '/src/assets/images/sterile_wound_care_1792992400683.jpg'
  }
];

export const TIME_SLOTS: TimeSlotOption[] = [
  { id: 'slot-1', timeRange: '08:00 - 10:00 WIB', period: 'Pagi', isAvailable: true },
  { id: 'slot-2', timeRange: '10:30 - 12:30 WIB', period: 'Pagi', isAvailable: true },
  { id: 'slot-3', timeRange: '13:00 - 15:00 WIB', period: 'Siang', isAvailable: true },
  { id: 'slot-4', timeRange: '15:30 - 17:30 WIB', period: 'Sore', isAvailable: true },
  { id: 'slot-5', timeRange: '18:00 - 20:00 WIB', period: 'Petang', isAvailable: true }
];

export const DISTRICT_LIST = [
  'Jakarta Selatan - Cilandak',
  'Jakarta Selatan - Kebayoran Baru',
  'Jakarta Selatan - Kebayoran Lama',
  'Jakarta Selatan - Pasar Minggu',
  'Jakarta Selatan - Jagakarsa',
  'Jakarta Selatan - Tebet',
  'Jakarta Timur - Ciracas / Cibubur',
  'Jakarta Timur - Pasar Rebo',
  'Depok - Cinere / Sawangan',
  'Depok - Beji / Pancoran Mas',
  'Tangerang Selatan - Ciputat / Pamulang',
  'Tangerang Selatan - BSD / Serpong',
  'Wilayah Lain (Konfirmasi Admin via WhatsApp)'
];

export const FAQS = [
  {
    question: 'Apakah Home Care melayani kunjungan ke rumah langsung?',
    answer: 'Ya, seluruh layanan kami dirancang khusus untuk dilakukan langsung di kediaman pasien. Tenaga kesehatan kami akan datang membawa perlengkapan medis yang sesuai dengan jenis layanan yang Anda pilih.'
  },
  {
    question: 'Wilayah mana saja yang saat ini dilayani?',
    answer: 'Saat ini kami melayani wilayah Jakarta Selatan, Jakarta Timur, Depok, dan Tangerang Selatan (radius 20-25 km dari pos layanan kami). Untuk lokasi di luar area tersebut, Anda dapat berdiskusi terlebih dahulu dengan admin kami.'
  },
  {
    question: 'Bagaimana cara melakukan booking kunjungan?',
    answer: 'Sangat mudah: pilih jenis layanan yang dibutuhkan, isi data pemesan dan pasien pada formulir online di halaman ini, pilih tanggal dan jam kunjungan, lalu klik kirim. Tim admin kami akan segera mengonfirmasi ketersediaan perawat.'
  },
  {
    question: 'Apakah booking otomatis langsung terkonfirmasi?',
    answer: 'Pengiriman formulir adalah pengajuan pemesanan resmi. Untuk menjaga keselamatan dan kepastian mutu, admin kami akan memverifikasi ketersediaan perawat yang tepat dan mengonfirmasikan jadwal kepada Anda via WhatsApp maksimal dalam 30 menit pada jam kerja.'
  },
  {
    question: 'Bagaimana tarif layanan ditentukan dan sistem pembayarannya?',
    answer: 'Tarif kami transparan dan tercantum jelas di setiap layanan tanpa biaya tersembunyi. Untuk paket kunjungan berkelanjutan (3 hari atau mingguan) tersedia diskon khusus. Pembayaran dapat dilakukan via transfer bank resmi setelah jadwal dikonfirmasi atau setelah tindakan selesai sesuai instruksi admin.'
  },
  {
    question: 'Apakah pelanggan dapat mengubah jadwal atau membatalkan booking?',
    answer: 'Bisa. Perubahan jadwal (reschedule) atau pembatalan dapat disampaikan kepada admin via WhatsApp maksimal 3 jam sebelum jadwal kunjungan tanpa dikenakan biaya administrasi.'
  },
  {
    question: 'Apa yang harus dipersiapkan keluarga sebelum perawat datang?',
    answer: 'Siapkan ruangan yang cukup terang dan berventilasi baik, riwayat obat-obatan yang sedang dikonsumsi atau resep dokter (bila ada), dan pastikan ada perwakilan anggota keluarga yang mendampingi saat tindakan berlangsung.'
  },
  {
    question: 'Bagaimana jika pasien mengalami kondisi darurat medis mendadak?',
    answer: 'Home Care BUKAN layanan gawat darurat (UGD/IGD). Jika pasien mengalami penurunan kesadaran, henti nafas, nyeri dada hebat, pendarahan hebat, atau kejang, segera hubungi ambulans darurat (119/112) atau bawa pasien ke Instalasi Gawat Darurat rumah sakit terdekat!'
  }
];
