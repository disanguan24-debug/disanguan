import React from 'react';
import { Award, Compass, Heart, MapPin, Clock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { BusinessConfig } from '../types';

interface AboutUsProps {
  businessConfig: BusinessConfig;
}

export const AboutUs: React.FC<AboutUsProps> = ({ businessConfig }) => {
  return (
    <section id="tentang-kami" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 tracking-wide uppercase mb-2">
            <Heart className="w-3.5 h-3.5" />
            <span>Mengenal Layanan Kami</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Tentang {businessConfig.businessName}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Mitra terpercaya keluarga Anda dalam menghadirkan pendampingan medis dan perawatan keperawatan berkualitas tinggi langsung di kenyamanan rumah.
          </p>
        </div>

        {/* 2-Column: Profil & Visi Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-6 p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-600" />
                <span>Profil & Nilai Pelayanan</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {businessConfig.businessName} didirikan untuk menjawab kebutuhan masyarakat akan perawatan keperawatan lanjutan yang hangat, personal, dan tetap berpegang teguh pada standar keselamatan medis. Kami memahami bahwa proses pemulihan sering kali paling efektif dan menenangkan ketika dijalani di tengah keluarga.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Setiap tindakan berpedoman pada prinsip etika keperawatan: menghormati otonomi pasien, mencegah bahaya (non-maleficence), mengutamakan manfaat (beneficence), dan menjaga kerahasiaan informasi medis pribadi.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs text-slate-700">
                <span className="font-semibold block text-slate-900">Perizinan & Legalitas Resmi</span>
                <span>{businessConfig.licenseInfo}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 rounded-2xl bg-sky-900 text-white flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-xl font-bold text-sky-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-400" />
                <span>Visi & Misi Pelayanan</span>
              </h3>
              
              <div className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-300 mb-1">Visi Kami</h4>
                <p className="text-sm text-sky-100 leading-relaxed">
                  Menjadi penyedia layanan Home Care keperawatan pilihan keluarga yang unggul dalam keselamatan, kehangatan interaksi, dan integritas klinis.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-300 mb-2">Misi Utama</h4>
                <ul className="text-xs text-sky-100 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <span>Memberikan tindakan perawatan sesuai kewenangan klinis dan prosedur operasional baku.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <span>Mendampingi pasien lansia dan pasien tirah baring untuk memelihara martabat dan kenyamanan hidup.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <span>Memberdayakan keluarga melalui edukasi perawatan dasar yang benar dan berkelanjutan.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-sky-800 text-[11px] text-sky-200">
              Menghormati hak privasi dan kerahasiaan setiap kondisi pasien adalah prioritas mutlak kami.
            </div>
          </div>

        </div>

        {/* 3 Operational Fact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Kualifikasi Tenaga Medis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tenaga kesehatan terdiri dari perawat berpendidikan D3/Ners Keperawatan dengan STR & SIP aktif resmi, serta pelatihan Bantuan Hidup Dasar (BHD).
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Wilayah Jangkauan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Melayani kunjungan di Jakarta Selatan, Jakarta Timur, Depok, dan Tangerang Selatan (radius operasional 20-25 km dari pos layanan).
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Jam Operasional Layanan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Senin - Minggu: 07.00 - 21.00 WIB. Pelaksanaan kunjungan disesuaikan dengan jadwal janji temu yang telah disepakati bersama admin.
            </p>
          </div>

        </div>

        {/* Medical Caution Notice */}
        <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">Catatan Batasan Layanan Medis:</span> Layanan Home Care berfokus pada tindakan suportif, pemantauan kondisi, dan perawatan keperawatan. Kami tidak memberikan konsultasi diagnosis awal, resep obat keras tanpa petunjuk dokter, atau tindakan gawat darurat.
          </div>
        </div>

      </div>
    </section>
  );
};
