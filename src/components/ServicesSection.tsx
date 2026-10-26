import React, { useState } from 'react';
import { Clock, CheckCircle2, ChevronRight, AlertCircle, Stethoscope, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';
import { formatCurrency } from '../services/storageService';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Layanan' },
    { id: 'Pelayanan Dasar', label: 'Pelayanan Dasar' },
    { id: 'Pendampingan Geriatri', label: 'Perawatan Lansia' },
    { id: 'Tindakan Keperawatan', label: 'Perawatan Luka' },
    { id: 'Skrining & Cek Kesehatan', label: 'Cek Kesehatan' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? services.filter(s => s.isActive)
    : services.filter(s => s.isActive && (s.category === selectedCategory || s.name.includes(selectedCategory)));

  return (
    <section id="layanan" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 tracking-wide uppercase mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Pilihan Layanan Terpercaya</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Jenis Layanan Home Care
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Daftar layanan terstruktur dengan standar keperawatan resmi, transparansi estimasi tarif, dan waktu tindakan yang jelas.
          </p>

          {/* Filter Bar (Interactive Buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid (6 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                {/* Image Slot with Fallback */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback visual if asset cannot load
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {/* Category unboxed tag on image bottom */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                    <span className="font-semibold drop-shadow-xs">{service.category}</span>
                    <span className="text-sky-200 font-mono text-[11px] drop-shadow-xs">{service.id}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                  {/* Metadata strip (No pill boxes, clean typographic separators) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.duration}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{service.serviceArea}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-sky-700 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Scope checklist preview */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Cakupan Tindakan:
                    </span>
                    {service.scope.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalService(service)}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Lihat Rincian Lengkap & Syarat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Footer: Pricing and Primary Action */}
              <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block leading-tight">Estimasi Tarif</span>
                  <span className="text-lg font-bold text-slate-900 font-mono tabular-nums leading-tight block">
                    {formatCurrency(service.price)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectServiceForBooking(service)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  Pesan Layanan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note on Custom/Dynamic Services */}
        <div className="mt-12 p-4 rounded-xl bg-white border border-slate-200 text-center max-w-2xl mx-auto text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Butuh tindakan medis khusus yang belum tertera? </span>
          Semua jenis layanan, durasi, dan ketentuan dapat disesuaikan dengan kebutuhan klinis Anda. Hubungi kami via WhatsApp untuk konsultasi khusus.
        </div>

      </div>

      {/* Modal Detail Layanan */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wide">
                  {activeModalService.category} · {activeModalService.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {activeModalService.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeModalService.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Cakupan Tindakan Komprehensif:
                </h4>
                <div className="space-y-2">
                  {activeModalService.scope.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Persyaratan & Persiapan Pasien:
                </h4>
                <div className="space-y-2">
                  {activeModalService.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Estimasi Durasi</span>
                  <span className="font-bold text-slate-900">{activeModalService.duration}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Tarif Layanan Dasar</span>
                  <span className="text-base font-bold text-sky-800 font-mono tabular-nums">
                    {formatCurrency(activeModalService.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const srv = activeModalService;
                  setActiveModalService(null);
                  onSelectServiceForBooking(srv);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
              >
                Pilih & Lanjut Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
