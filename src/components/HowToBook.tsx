import React from 'react';
import { ListOrdered, CheckCircle2, Info } from 'lucide-react';

interface HowToBookProps {
  onScrollToBooking: () => void;
}

export const HowToBook: React.FC<HowToBookProps> = ({ onScrollToBooking }) => {
  const steps = [
    {
      num: '01',
      title: 'Pilih Layanan',
      desc: 'Tentukan jenis layanan perawatan yang sesuai dengan kondisi pasien.'
    },
    {
      num: '02',
      title: 'Isi Data Diri & Pasien',
      desc: 'Masukkan nama, nomor WhatsApp aktif, dan profil dasar pasien secara ringkas.'
    },
    {
      num: '03',
      title: 'Tentukan Alamat Kunjungan',
      desc: 'Lengkapi alamat domisili dan patokan jalan agar perawat mudah menjangkau lokasi.'
    },
    {
      num: '04',
      title: 'Pilih Tanggal & Jam',
      desc: 'Tentukan hari dan slot waktu (pagi, siang, sore, atau petang) yang paling nyaman.'
    },
    {
      num: '05',
      title: 'Cek Estimasi Tarif',
      desc: 'Lihat ringkasan pesanan dan perkiraan tarif transparan tanpa biaya tersembunyi.'
    },
    {
      num: '06',
      title: 'Kirim Permohonan Booking',
      desc: 'Klik tombol kirim dan dapatkan Nomor Booking unik untuk pelacakan.'
    },
    {
      num: '07',
      title: 'Konfirmasi Admin',
      desc: 'Admin memverifikasi ketersediaan perawat dan menghubungi via WhatsApp (±30 mnt).'
    },
    {
      num: '08',
      title: 'Pelaksanaan Kunjungan',
      desc: 'Perawat hadir tepat waktu dengan tanda pengenal resmi dan perlengkapan steril.'
    }
  ];

  return (
    <section id="cara-booking" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 tracking-wide uppercase mb-2">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Alur Praktis & Mudah</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Cara Booking Kunjungan Online
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Hanya 8 langkah sederhana untuk menghadirkan perawatan kesehatan terpercaya di kediaman Anda.
          </p>
        </div>

        {/* 8-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-sky-300 transition-colors shadow-2xs relative flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-2xl font-black text-sky-600 block mb-2">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Langkah {idx + 1} dari 8</span>
              </div>
            </div>
          ))}
        </div>

        {/* Clarification Box */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3 max-w-3xl mx-auto mb-8">
          <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
          <div className="text-xs text-sky-900 leading-relaxed">
            <strong>Penting untuk Diketahui:</strong> Pengiriman formulir di bawah ini merupakan <em>permohonan pemesanan layanan</em>. Booking belum berstatus terkonfirmasi sampai tim admin kami memeriksa ketersediaan jadwal tenaga perawat dan mengirimkan konfirmasi resmi via WhatsApp.
          </div>
        </div>

        {/* Action to Jump to Booking Form */}
        <div className="text-center">
          <button
            type="button"
            onClick={onScrollToBooking}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
          >
            Mulai Isi Formulir Booking Sekarang
          </button>
        </div>

      </div>
    </section>
  );
};
