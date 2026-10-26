/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { 
  getStoredConfig, saveStoredConfig, getStoredServices, 
  saveStoredServices, getStoredBookings, generateGeneralWhatsAppUrl 
} from './services/storageService';
import { ServiceItem, BusinessConfig, BookingData } from './types';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { ServicesSection } from './components/ServicesSection';
import { ServiceStandards } from './components/ServiceStandards';
import { HowToBook } from './components/HowToBook';
import { BookingForm } from './components/BookingForm';
import { FAQSection } from './components/FAQSection';
import { ContactFooter } from './components/ContactFooter';

import { BookingStatusModal } from './components/BookingStatusModal';
import { GoogleAppsScriptModal } from './components/GoogleAppsScriptModal';
import { AdminDrawer } from './components/AdminDrawer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';

export default function App() {
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => getStoredConfig());
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [bookings, setBookings] = useState<BookingData[]>(() => getStoredBookings());

  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);

  // Modals state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [gasModalOpen, setGasModalOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Refresh bookings list
  const refreshBookings = () => {
    setBookings(getStoredBookings());
  };

  // Update Services
  const handleUpdateServices = (updated: ServiceItem[]) => {
    setServices(updated);
    saveStoredServices(updated);
  };

  // Update Business Config
  const handleUpdateBusinessConfig = (updated: BusinessConfig) => {
    setBusinessConfig(updated);
    saveStoredConfig(updated);
  };

  // Save Web App URL
  const handleSaveWebAppUrl = (url: string) => {
    const updated = { ...businessConfig, googleWebAppUrl: url };
    setBusinessConfig(updated);
    saveStoredConfig(updated);
  };

  // Smooth scroll helpers
  const scrollToBooking = () => {
    const el = document.getElementById('formulir-booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('layanan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForBooking = (service: ServiceItem) => {
    setPreselectedService(service);
    scrollToBooking();
  };

  const floatingWhatsAppUrl = generateGeneralWhatsAppUrl(businessConfig, 'Tanya Layanan Home Care');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* 1. HEADER & NAVIGATION */}
      <Header
        businessConfig={businessConfig}
        onOpenStatusModal={() => setStatusModalOpen(true)}
        onOpenGasModal={() => setGasModalOpen(true)}
        onOpenAdminDrawer={() => setAdminDrawerOpen(true)}
        onScrollToBooking={scrollToBooking}
      />

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <Hero
          businessConfig={businessConfig}
          onScrollToBooking={scrollToBooking}
          onScrollToServices={scrollToServices}
        />

        {/* 3. TENTANG KAMI */}
        <AboutUs businessConfig={businessConfig} />

        {/* 4. JENIS LAYANAN HOME CARE */}
        <ServicesSection
          services={services}
          onSelectServiceForBooking={handleSelectServiceForBooking}
        />

        {/* 5. STANDAR LAYANAN */}
        <ServiceStandards />

        {/* 6. CARA BOOKING */}
        <HowToBook onScrollToBooking={scrollToBooking} />

        {/* 7. FORMULIR BOOKING ONLINE */}
        <BookingForm
          services={services}
          businessConfig={businessConfig}
          preselectedService={preselectedService}
          onClearPreselectedService={() => setPreselectedService(null)}
          onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        />

        {/* 8. FAQ */}
        <FAQSection />
      </main>

      {/* 9. KONTAK & FOOTER */}
      <ContactFooter
        businessConfig={businessConfig}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenGasModal={() => setGasModalOpen(true)}
        onScrollToBooking={scrollToBooking}
      />

      {/* FLOATING WHATSAPP CHAT BUTTON */}
      <a
        href={floatingWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xs font-semibold group"
        aria-label="Hubungi Admin melalui WhatsApp"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">Chat WhatsApp</span>
      </a>

      {/* MODALS & DRAWERS */}
      <BookingStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        businessConfig={businessConfig}
      />

      <GoogleAppsScriptModal
        isOpen={gasModalOpen}
        onClose={() => setGasModalOpen(false)}
        businessConfig={businessConfig}
        onSaveWebAppUrl={handleSaveWebAppUrl}
      />

      <AdminDrawer
        isOpen={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        bookings={bookings}
        services={services}
        businessConfig={businessConfig}
        onUpdateServices={handleUpdateServices}
        onUpdateBusinessConfig={handleUpdateBusinessConfig}
        onRefreshBookings={refreshBookings}
        onOpenGasModal={() => {
          setAdminDrawerOpen(false);
          setGasModalOpen(true);
        }}
      />

      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        businessConfig={businessConfig}
      />

    </div>
  );
}
