import React, { useState } from 'react';
import { Search, X, CheckCircle2, Clock, Calendar, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { BookingData, BusinessConfig } from '../types';
import { findBookingByIdAndPhone, formatCurrency } from '../services/storageService';

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessConfig: BusinessConfig;
}

export const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  isOpen,
  onClose,
  businessConfig
}) => {
  const [bookingId, setBookingId] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundBooking, setFoundBooking] = useState<BookingData | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setFoundBooking(null);
    setIsSearching(true);

    setTimeout(() => {
      const result = findBookingByIdAndPhone(bookingId, phoneLast4);
      if (result.found && result.booking) {
        setFoundBooking(result.booking);
      } else {
        setSearchError(result.error || 'Data booking tidak ditemukan.');
      }
      setIsSearching(false);
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu Konfirmasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Menunggu Konfirmasi Admin</span>
          </span>
        );
      case 'Dikonfirmasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Telah Dikonfirmasi (Jadwal Siap)</span>
          </span>
        );
      case 'Sedang Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Perawat Menuju Lokasi / Sedang Bertugas</span>
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Kunjungan Selesai</span>
          </span>
        );
      case 'Dijadwalkan Ulang':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Dijadwalkan Ulang (Rescheduled)</span>
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Booking Dibatalkan</span>
          </span>
        );
      default:
        return <span className="text-xs text-slate-600">{status}</span>;
    }
  };

  const getTimelineSteps = (status: string) => {
    const steps = [
      { label: 'Booking Dibuat', completed: true },
      { 
        label: 'Verifikasi Admin', 
        completed: status !== 'Menunggu Konfirmasi' && status !== 'Dibatalkan',
        active: status === 'Menunggu Konfirmasi'
      },
      { 
        label: 'Terkonfirmasi & Siap', 
        completed: ['Dikonfirmasi', 'Sedang Diproses', 'Selesai'].includes(status),
        active: status === 'Dikonfirmasi'
      },
      { 
        label: 'Selesai Dilayani', 
        completed: status === 'Selesai',
        active: status === 'Sedang Diproses'
      }
    ];
    return steps;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Cek Status Pemesanan
              </h3>
              <p className="text-xs text-slate-500">
                Lacak status verifikasi perawat dan jadwal kunjungan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="searchBookingId" className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Booking
              </label>
              <input
                id="searchBookingId"
                type="text"
                placeholder="Contoh: HC-20261025-1234"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                required
              />
            </div>

            <div>
              <label htmlFor="searchPhoneLast4" className="block text-xs font-semibold text-slate-700 mb-1">
                4 Digit Terakhir No. WhatsApp
              </label>
              <input
                id="searchPhoneLast4"
                type="text"
                maxLength={4}
                placeholder="Contoh: 7890"
                value={phoneLast4}
                onChange={(e) => setPhoneLast4(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                required
              />
              <span className="text-[10px] text-slate-400">Verifikasi privasi pemesan</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{isSearching ? 'Mencari Data...' : 'Cari Status Booking'}</span>
          </button>
        </form>

        {/* Error message */}
        {searchError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Result Card */}
        {foundBooking && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Nomor Booking</span>
                <span className="text-base font-bold text-sky-700 font-mono">
                  {foundBooking.id}
                </span>
              </div>
              <div>{getStatusBadge(foundBooking.status)}</div>
            </div>

            {/* Visual Timeline */}
            <div className="py-2">
              <span className="text-[11px] font-bold text-slate-700 block mb-3 uppercase tracking-wider">
                Perkembangan Proses:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                {getTimelineSteps(foundBooking.status).map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : step.active
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <span className="text-[10px] text-slate-600 leading-tight">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Information Grid */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Layanan:</span>
                <span className="font-semibold text-slate-800 text-right">{foundBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paket:</span>
                <span className="font-medium text-slate-800">{foundBooking.packageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jadwal:</span>
                <span className="font-semibold text-slate-800">{foundBooking.visitDate} ({foundBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pasien:</span>
                <span className="font-medium text-slate-800">{foundBooking.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Wilayah:</span>
                <span className="font-medium text-slate-800">{foundBooking.district}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Estimasi Biaya:</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(foundBooking.estimatedPrice)}
                </span>
              </div>
            </div>

            {/* Admin Note if any */}
            {foundBooking.adminNotes && (
              <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-900">
                <span className="font-semibold block mb-0.5">Catatan Tim Admin:</span>
                <span>{foundBooking.adminNotes}</span>
              </div>
            )}

            {/* Quick Contact Admin Button */}
            <a
              href={`https://wa.me/${businessConfig.whatsappNumber.replace(/\D/g, '')}?text=Halo%20Admin,%20saya%20ingin%20menanyakan%20status%20booking%20${foundBooking.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Hubungi Admin terkait Booking Ini</span>
            </a>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-400">
            Jika Anda kehilangan nomor booking, silakan hubungi tim customer care kami via WhatsApp dengan menyebutkan nama pemesan.
          </p>
        </div>

      </div>
    </div>
  );
};
