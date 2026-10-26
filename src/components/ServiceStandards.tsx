import React from 'react';
import { Shield, UserCheck, CalendarCheck, Activity, CheckSquare, AlertTriangle } from 'lucide-react';

export const ServiceStandards: React.FC = () => {
  const standards = [
    {
      icon: <UserCheck className="w-5 h-5 text-sky-600" />,
      title: '1. Standar Tenaga Pelayanan',
      points: [
        'Petugas wajib memiliki kualifikasi pendidikan keperawatan resmi serta Surat Tanda Registrasi (STR) aktif.',
        'Verifikasi identitas dan tanda pengenal resmi petugas ditunjukkan sebelum memasuki kediaman pasien.',
        'Penugasan tenaga disesuaikan dengan tingkat kompleksitas dan kompetensi klinis yang dibutuhkan.'
      ]
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-sky-600" />,
      title: '2. Standar Sebelum Kunjungan',
      points: [
        'Setiap permohonan booking dikonfirmasi terlebih dahulu oleh admin demi kepastian jadwal.',
        'Pelanggan menerima transparansi rincian estimasi tarif dan cakupan tindakan sebelum perawat berangkat.',
        'Kondisi khusus atau riwayat alergi pasien dikomunikasikan di awal untuk persiapan alat yang tepat.'
      ]
    },
    {
      icon: <Activity className="w-5 h-5 text-sky-600" />,
      title: '3. Standar Selama Tindakan',
      points: [
        'Wajib meminta persetujuan lisan maupun tertulis (Informed Consent) dari pasien atau penanggung jawab keluarga.',
        'Penerapan protokol pencegahan infeksi: cuci tangan 6 langkah, sarung tangan steril, dan pembuangan limbah medis aman.',
        'Menjaga kehormatan, privasi tubuh, serta kerahasiaan seluruh informasi medis pasien.'
      ]
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-sky-600" />,
      title: '4. Standar Pasca Kunjungan',
      points: [
        'Perawat memberikan edukasi langkah perawatan mandiri dan pola pengingat obat bagi keluarga.',
        'Menyampaikan ringkasan hasil pemantauan tanda vital dan perkembangan kondisi kepada keluarga.',
        'Memberikan saran rujukan segera ke dokter spesialis atau fasilitas kesehatan rujukan jika ada indikasi perburukan.'
      ]
    }
  ];

  return (
    <section id="standar-layanan" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 tracking-wide uppercase mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Kualitas & Keselamatan Terjaga</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Standar Mutu & Etika Pelayanan
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Pedoman ketat yang kami terapkan di setiap kunjungan untuk menjamin kenyamanan, privasi, dan keselamatan medis keluarga Anda.
          </p>
        </div>

        {/* 4 Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {standards.map((std, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {std.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {std.title}
                </h3>
              </div>

              <ul className="space-y-3">
                {std.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Essential Medical Limitation Warning Box */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-rose-950">
                5. Batasan Layanan Medis & Kondisi Gawat Darurat (Emergency Limitation)
              </h4>
              <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                Layanan Home Care adalah layanan kunjungan terencana dan <strong>BUKAN</strong> merupakan pengganti Instalasi Gawat Darurat (IGD/UGD).
              </p>
              <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                Apabila pasien mengalami penurunan kesadaran tiba-tiba, nyeri dada sebelah kiri menjalar, sesak nafas akut berat, kejang terus-menerus, pendarahan masif, atau trauma cedera kepala, segera hubungi <strong>Ambulans Gawat Darurat (119 / 112)</strong> atau bawa pasien ke UGD Rumah Sakit terdekat tanpa menunggu perawat Home Care.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
