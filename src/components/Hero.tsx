import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Clock, CalendarCheck, FileCheck } from 'lucide-react';
import { BusinessConfig } from '../types';
import { generateGeneralWhatsAppUrl } from '../services/storageService';

interface HeroProps {
  businessConfig: BusinessConfig;
  onScrollToBooking: () => void;
  onScrollToServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  businessConfig,
  onScrollToBooking,
  onScrollToServices
}) => {
  const whatsappUrl = generateGeneralWhatsAppUrl(businessConfig, 'Konsultasi Layanan Home Care');

  return (
    <section id="beranda" className="relative bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>Standar Pelayanan Kesehatan Terverifikasi di Rumah</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Perawatan Kesehatan Profesional, Nyaman di Rumah Anda
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Layanan Home Care yang membantu Anda dan keluarga mendapatkan perawatan yang tepat di rumah, dengan tenaga profesional sesuai jenis layanan yang tersedia.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onScrollToBooking}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap"
              >
                <span>Booking Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onScrollToServices}
                className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors whitespace-nowrap"
              >
                Lihat Jenis Layanan
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Admin</span>
              </a>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <FileCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Perawat Berkompeten</h4>
                  <p className="text-[11px] text-slate-500">Memiliki STR & SIP aktif resmi</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Jadwal Fleksibel</h4>
                  <p className="text-[11px] text-slate-500">Pagi, siang, sore hingga malam</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <CalendarCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tarif Transparan</h4>
                  <p className="text-[11px] text-slate-500">Sesuai paket tanpa biaya tersembunyi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image Container */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 aspect-16/11 sm:aspect-4/3 lg:aspect-auto lg:h-[460px]">
              <img
                src="/src/assets/images/hero_home_care_1792992399585.jpg"
                alt="Perawat profesional Home Care sedang merawat lansia dengan ramah di rumah"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Pendampingan Terpercaya</span>
                  <span className="text-emerald-700 font-semibold">Resmi & Berizin</span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  Kenyamanan pemulihan kesehatan di lingkungan rumah yang tenang bersama keluarga tercinta.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
