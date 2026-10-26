import React, { useState } from 'react';
import { Menu, X, HeartPulse, Search, Database, Settings } from 'lucide-react';
import { BusinessConfig } from '../types';

interface HeaderProps {
  businessConfig: BusinessConfig;
  onOpenStatusModal: () => void;
  onOpenGasModal: () => void;
  onOpenAdminDrawer: () => void;
  onScrollToBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  businessConfig,
  onOpenStatusModal,
  onOpenGasModal,
  onOpenAdminDrawer,
  onScrollToBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification Bar for Emergency Medical Disclaimer */}
      <div className="bg-sky-900 text-sky-100 text-xs py-1.5 px-4 text-center font-medium">
        <span>Layanan Home Care bukan pengganti UGD/IGD gawat darurat. Untuk kondisi darurat medis segera hubungi 119 atau RS terdekat.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-6">
          {/* Zone 1: Single element brand wordmark */}
          <a
            href="#beranda"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('beranda');
            }}
            className="flex items-center gap-2.5 text-slate-900 hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-xs group-hover:bg-sky-700 transition-colors">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                {businessConfig.businessName}
              </span>
              <span className="text-xs text-slate-500 font-medium block leading-tight">
                Layanan Kesehatan di Rumah
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('beranda')}
              className="hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('tentang-kami')}
              className="hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => scrollToSection('layanan')}
              className="hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              Jenis Layanan
            </button>
            <button
              onClick={() => scrollToSection('standar-layanan')}
              className="hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              Standar Layanan
            </button>
            <button
              onClick={() => scrollToSection('cara-booking')}
              className="hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              Cara Booking
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('kontak')}
              className="hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              Kontak
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenStatusModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Cek Status Booking Anda"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cek Status</span>
            </button>

            <button
              type="button"
              onClick={onOpenGasModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
              title="Setup Google Sheets & Apps Script"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Google Sheets</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdminDrawer}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Panel Kelola & Pengaturan"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onScrollToBooking}
              className="inline-flex items-center justify-center px-4.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              Booking Sekarang
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenStatusModal}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg text-xs flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-700">
            <button
              onClick={() => scrollToSection('beranda')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('tentang-kami')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => scrollToSection('layanan')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Jenis Layanan
            </button>
            <button
              onClick={() => scrollToSection('standar-layanan')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Standar Layanan
            </button>
            <button
              onClick={() => scrollToSection('cara-booking')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Cara Booking
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('kontak')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Kontak
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToBooking();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-sky-600 rounded-lg shadow-xs"
            >
              Formulir Booking Online
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStatusModal();
                }}
                className="flex-1 py-2 text-center text-xs font-medium text-slate-700 bg-slate-100 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Cek Status
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGasModal();
                }}
                className="flex-1 py-2 text-center text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                Google Sheets
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminDrawer();
                }}
                className="px-3 py-2 text-slate-700 bg-slate-100 rounded-lg"
                title="Kelola Data"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
