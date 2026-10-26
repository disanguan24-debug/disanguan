import React from 'react';
import { 
  HeartPulse, Phone, Mail, MapPin, Clock, MessageCircle, 
  ShieldCheck, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { BusinessConfig } from '../types';
import { generateGeneralWhatsAppUrl } from '../services/storageService';

interface ContactFooterProps {
  businessConfig: BusinessConfig;
  onOpenPrivacyModal: () => void;
  onOpenGasModal: () => void;
  onScrollToBooking: () => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  businessConfig,
  onOpenPrivacyModal,
  onOpenGasModal,
  onScrollToBooking
}) => {
  const whatsappUrl = generateGeneralWhatsAppUrl(businessConfig, 'Informasi & Layanan Home Care');

  return (
    <footer id="kontak" className="bg-slate-900 text-slate-300">
      
      {/* WhatsApp Banner Callout */}
      <div className="border-b border-slate-800 bg-sky-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 block mb-1">
                Layanan Responsif & Ramah
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Perlu Diskusi Kebutuhan Pasien Terlebih Dahulu?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Tim admin dan perawat konsultan kami siap membantu memberikan rekomendasi layanan yang paling tepat untuk keluarga Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi WhatsApp Sekarang</span>
              </a>

              <button
                type="button"
                onClick={onScrollToBooking}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold text-sky-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <span>Buka Formulir Booking</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-xs">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {businessConfig.businessName}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Platform layanan informasi dan pemesanan online perawatan kesehatan profesional di rumah. Menghubungkan perawat terverifikasi dengan keluarga pasien untuk kenyamanan pemulihan terbaik.
            </p>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{businessConfig.licenseInfo}</span>
            </div>
          </div>

          {/* Quick Navigation (Col 5-7) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#beranda" className="hover:text-white transition-colors">Beranda Utama</a>
              </li>
              <li>
                <a href="#tentang-kami" className="hover:text-white transition-colors">Profil & Visi Misi</a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-white transition-colors">6 Jenis Layanan & Tarif</a>
              </li>
              <li>
                <a href="#standar-layanan" className="hover:text-white transition-colors">Standar Kualitas & Etika</a>
              </li>
              <li>
                <a href="#cara-booking" className="hover:text-white transition-colors">8 Langkah Cara Booking</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Pertanyaan Umum (FAQ)</a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGasModal}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Integrasi Google Sheets & Script</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (Col 8-12) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Kontak & Operasional
            </h4>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{businessConfig.address}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{businessConfig.operationalHours}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>WhatsApp: {businessConfig.whatsappDisplay}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Email: {businessConfig.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Ethical Medical Disclaimer */}
        <div className="mt-12 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Disclaimer Medis:</strong> Aplikasi ini berfungsi sebagai sarana informasi dan pemesanan layanan keperawatan di rumah, bukan sebagai pengganti konsultasi dokter, diagnosis medis mandiri, atau penanganan gawat darurat. Seluruh tindakan keperawatan khusus (kateter, NGT, suntikan) wajib menyertakan resep atau instruksi resmi dokter yang merawat.
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {businessConfig.businessName}. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="hover:text-slate-300 transition-colors underline"
            >
              Kebijakan Privasi
            </button>
            <span aria-hidden="true">·</span>
            <span>Single Page Healthcare Application</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
