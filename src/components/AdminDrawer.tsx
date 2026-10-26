import React, { useState, useEffect } from 'react';
import { 
  X, Settings, ListFilter, Sliders, Building2, 
  CheckCircle2, Clock, Edit3, Save, PhoneCall, RefreshCw,
  Lock, Unlock, Eye, EyeOff, LogOut, KeyRound, AlertCircle, 
  Database, Check, AlertTriangle, ArrowUpRight, Upload, 
  Image as ImageIcon, RotateCcw
} from 'lucide-react';
import { BookingData, ServiceItem, BusinessConfig, BookingStatus } from '../types';
import { 
  formatCurrency, verifyAdminPassword, 
  saveStoredAdminPassword 
} from '../services/storageService';
import { 
  syncBookingStatusToSheets, syncServicesToSheets, 
  syncSettingsToSheets, fetchLiveSpreadsheetData, 
  getActiveWebAppUrl, SyncResult 
} from '../services/backendSyncService';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingData[];
  services: ServiceItem[];
  businessConfig: BusinessConfig;
  onUpdateServices: (updated: ServiceItem[]) => void;
  onUpdateBusinessConfig: (updated: BusinessConfig) => void;
  onRefreshBookings: () => void;
  onOpenGasModal: () => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  services,
  businessConfig,
  onUpdateServices,
  onUpdateBusinessConfig,
  onRefreshBookings,
  onOpenGasModal
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hc_admin_session') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'business'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Status edit modal state
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<BookingData | null>(null);
  const [editStatus, setEditStatus] = useState<BookingStatus>('Menunggu Konfirmasi');
  const [editNotes, setEditNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Local draft state for Services & Tariffs
  const [editableServices, setEditableServices] = useState<ServiceItem[]>(services);
  const [hasServiceChanges, setHasServiceChanges] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);

  // Sync services when props change
  useEffect(() => {
    setEditableServices(services);
    setHasServiceChanges(false);
  }, [services]);

  // Business config edit state
  const [cfgName, setCfgName] = useState(businessConfig.businessName);
  const [cfgPhone, setCfgPhone] = useState(businessConfig.whatsappNumber);
  const [cfgAddress, setCfgAddress] = useState(businessConfig.address);
  const [cfgHours, setCfgHours] = useState(businessConfig.operationalHours);
  const [cfgArea, setCfgArea] = useState(businessConfig.serviceArea);
  const [cfgLicense, setCfgLicense] = useState(businessConfig.licenseInfo);
  const [cfgHeroImage, setCfgHeroImage] = useState(businessConfig.heroImageUrl || '/images/hero_home_care.jpg');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Real-time backend feedback alerts
  const [serverFeedback, setServerFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Live pull state
  const [isPullingData, setIsPullingData] = useState(false);

  // Change Admin Password state
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangedToast, setPasswordChangedToast] = useState(false);

  // Check if Web App URL is connected
  const webAppUrl = getActiveWebAppUrl();
  const isSheetsConnected = Boolean(webAppUrl && webAppUrl.startsWith('https://script.google.com/'));

  if (!isOpen) return null;

  // Auto-dismiss feedback alert
  const showFeedback = (type: 'success' | 'warning' | 'error', message: string, duration: number = 5000) => {
    setServerFeedback({ type, message });
    setTimeout(() => {
      setServerFeedback(null);
    }, duration);
  };

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!passwordInput.trim()) {
      setAuthError('Silakan masukkan kata sandi admin.');
      return;
    }

    if (verifyAdminPassword(passwordInput.trim())) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('hc_admin_session', 'true');
      } catch (e) {
        console.error(e);
      }
      setPasswordInput('');
      setAuthError(null);
    } else {
      setAuthError('Kata sandi salah. Silakan coba kembali (default: admin123).');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('hc_admin_session');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  const handleOpenEditBooking = (b: BookingData) => {
    setSelectedBookingForEdit(b);
    setEditStatus(b.status);
    setEditNotes(b.adminNotes || '');
  };

  // 1. SAVE BOOKING STATUS (REAL SYNC TO SPREADSHEET)
  const handleSaveBookingStatus = async () => {
    if (!selectedBookingForEdit) return;

    setIsUpdatingStatus(true);
    try {
      const result: SyncResult = await syncBookingStatusToSheets(
        selectedBookingForEdit.id,
        editStatus,
        editNotes
      );

      setSelectedBookingForEdit(null);
      onRefreshBookings();

      if (result.syncedToSheets) {
        showFeedback('success', `[SUKSES GOOGLE SHEETS] ${result.message}`);
      } else if (result.success) {
        showFeedback('warning', `[TERSINKRON LOKAL] ${result.message}`);
      } else {
        showFeedback('error', `[GAGAL KE SHEETS] ${result.message}`);
      }
    } catch (err: any) {
      showFeedback('error', `Terjadi error saat update ke Google Sheets: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 2. TOGGLE SERVICE & PRICE CHANGE
  const handleToggleService = (srvId: string) => {
    const updated = editableServices.map(s => {
      if (s.id === srvId) {
        return { ...s, isActive: !s.isActive };
      }
      return s;
    });
    setEditableServices(updated);
    setHasServiceChanges(true);
  };

  const handlePriceChange = (srvId: string, newPriceStr: string) => {
    const num = parseInt(newPriceStr.replace(/\D/g, ''), 10) || 0;
    const updated = editableServices.map(s => {
      if (s.id === srvId) {
        return { 
          ...s, 
          price: num, 
          priceFormatted: formatCurrency(num) 
        };
      }
      return s;
    });
    setEditableServices(updated);
    setHasServiceChanges(true);
  };

  // Upload Foto untuk Layanan
  const handleServiceImageUpload = (srvId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated = editableServices.map(s => {
        if (s.id === srvId) {
          return { ...s, image: base64 };
        }
        return s;
      });
      setEditableServices(updated);
      setHasServiceChanges(true);
      showFeedback('success', `Foto layanan berhasil diunggah! Klik tombol 'Simpan Semua Perubahan Tarif ke Sheets' di bawah untuk menyimpan.`);
    };
    reader.readAsDataURL(file);
  };

  // Ubah Gambar Layanan via URL
  const handleServiceImageUrlChange = (srvId: string, newUrl: string) => {
    const updated = editableServices.map(s => {
      if (s.id === srvId) {
        return { ...s, image: newUrl };
      }
      return s;
    });
    setEditableServices(updated);
    setHasServiceChanges(true);
  };

  // Upload Foto Banner Hero
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCfgHeroImage(base64);
      showFeedback('success', `Foto banner beranda berhasil dimuat! Klik 'Simpan Perubahan Info Usaha ke Sheets'.`);
    };
    reader.readAsDataURL(file);
  };

  // 3. SAVE SERVICES & TARIFFS (REAL SYNC TO SPREADSHEET)
  const handleSaveServices = async () => {
    setIsSavingServices(true);
    try {
      const result = await syncServicesToSheets(editableServices);
      onUpdateServices(editableServices);
      setHasServiceChanges(false);

      if (result.syncedToSheets) {
        showFeedback('success', `[SUKSES GOOGLE SHEETS] ${result.message}`);
      } else if (result.success) {
        showFeedback('warning', `[TERSINKRON LOKAL] ${result.message}`);
      } else {
        showFeedback('error', `[GAGAL KE SHEETS] ${result.message}`);
      }
    } catch (err: any) {
      showFeedback('error', `Gagal menyimpan tarif ke Google Sheets: ${err.message}`);
    } finally {
      setIsSavingServices(false);
    }
  };

  // 4. SAVE BUSINESS CONFIG (REAL SYNC TO SPREADSHEET)
  const handleSaveBusinessConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);

    const updated: BusinessConfig = {
      ...businessConfig,
      businessName: cfgName.trim(),
      whatsappNumber: cfgPhone.trim(),
      whatsappDisplay: cfgPhone.trim(),
      address: cfgAddress.trim(),
      operationalHours: cfgHours.trim(),
      serviceArea: cfgArea.trim(),
      licenseInfo: cfgLicense.trim(),
      heroImageUrl: cfgHeroImage
    };

    try {
      const result = await syncSettingsToSheets(updated);
      onUpdateBusinessConfig(updated);

      if (result.syncedToSheets) {
        showFeedback('success', `[SUKSES GOOGLE SHEETS] ${result.message}`);
      } else if (result.success) {
        showFeedback('warning', `[TERSINKRON LOKAL] ${result.message}`);
      } else {
        showFeedback('error', `[GAGAL KE SHEETS] ${result.message}`);
      }
    } catch (err: any) {
      showFeedback('error', `Gagal menyimpan info usaha ke Google Sheets: ${err.message}`);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // 5. PULL LATEST LIVE DATA FROM SPREADSHEET
  const handlePullFromSheets = async () => {
    setIsPullingData(true);
    try {
      const result = await fetchLiveSpreadsheetData();
      if (result.success) {
        onRefreshBookings();
        showFeedback('success', result.message);
      } else {
        showFeedback('error', result.message);
      }
    } catch (err: any) {
      showFeedback('error', `Gagal menarik data dari Google Sheets: ${err.message}`);
    } finally {
      setIsPullingData(false);
    }
  };

  // Save New Password
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.trim().length < 5) {
      alert('Kata sandi baru minimal harus 5 karakter.');
      return;
    }
    saveStoredAdminPassword(newPassword.trim());
    setNewPassword('');
    setPasswordChangedToast(true);
    setTimeout(() => setPasswordChangedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">
                Panel Pengelolaan Admin
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAuthenticated ? 'Monitoring booking, master layanan, & konfigurasi' : 'Keamanan & Akses Terbatas'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                title="Kunci / Keluar Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
              aria-label="Tutup Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCREEN 1: LOGIN / PASSWORD AUTHENTICATION SCREEN */}
        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center bg-slate-50">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md max-w-md w-full text-center">
              
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100 shadow-2xs">
                <Lock className="w-7 h-7" />
              </div>

              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Autentikasi Administrator
              </h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Panel ini dilindungi untuk keamanan data pemesanan pasien dan kendali tarif layanan. Silakan masukkan kata sandi admin Anda.
              </p>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label htmlFor="adminPassword" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kata Sandi Admin
                  </label>
                  <div className="relative">
                    <input
                      id="adminPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan kata sandi admin..."
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50/50"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                      title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-sky-600" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Buka Akses Panel Admin</span>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">
                  Petunjuk Penggunaan Pertama Kali:
                </span>
                <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                  Default: admin123
                </span>
                <p className="text-[10px] text-slate-400 mt-2">
                  (Kata sandi dapat Anda ubah kapan saja melalui tab <em>Info Usaha & Kontak</em>)
                </p>
              </div>

            </div>
          </div>
        ) : (
          /* SCREEN 2: AUTHENTICATED ADMIN DASHBOARD */
          <>
            {/* Real-time Google Sheets Connection Status Bar */}
            <div className={`px-4 py-2 border-b text-xs flex items-center justify-between gap-3 shrink-0 ${
              isSheetsConnected 
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50/90 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <Database className={`w-4 h-4 shrink-0 ${isSheetsConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span className="truncate">
                  {isSheetsConnected ? (
                    <>
                      <strong>Google Sheets: Terhubung</strong> — Perubahan status & tarif langsung tersinkron ke backend.
                    </>
                  ) : (
                    <>
                      <strong>Google Sheets: Belum Terhubung</strong> — Perubahan tersimpan lokal di browser.
                    </>
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenGasModal}
                className="inline-flex items-center gap-1 text-[11px] font-bold underline shrink-0 hover:opacity-80"
              >
                <span>{isSheetsConnected ? 'Pengaturan Sheets' : 'Sambungkan Sheets'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Server Feedback Banner Alert */}
            {serverFeedback && (
              <div className={`px-4 py-2.5 text-xs font-medium border-b flex items-start gap-2 animate-in fade-in ${
                serverFeedback.type === 'success'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : serverFeedback.type === 'warning'
                  ? 'bg-amber-500 text-slate-900 border-amber-600'
                  : 'bg-rose-600 text-white border-rose-700'
              }`}>
                {serverFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{serverFeedback.message}</span>
              </div>
            )}

            {/* Tab Navigation Switcher */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListFilter className="w-4 h-4" />
                <span>Data Booking ({bookings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Kelola Layanan & Tarif</span>
                {hasServiceChanges && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Ada perubahan belum disimpan" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeTab === 'business'
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Info Usaha & Kontak</span>
              </button>
            </div>

            {/* Scrollable Container with Guaranteed Safe Bottom Padding */}
            <div className="p-4 sm:p-6 overflow-y-auto min-h-0 flex-1 pb-32">
              
              {/* TAB 1: BOOKINGS LIST */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Filter & Live Pull Bar */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium"
                      >
                        <option value="all">Semua Status ({bookings.length})</option>
                        <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                        <option value="Dikonfirmasi">Dikonfirmasi</option>
                        <option value="Dijadwalkan Ulang">Dijadwalkan Ulang</option>
                        <option value="Sedang Diproses">Sedang Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSheetsConnected && (
                        <button
                          type="button"
                          onClick={handlePullFromSheets}
                          disabled={isPullingData}
                          className="text-xs px-2.5 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 font-semibold transition-colors"
                          title="Tarik seluruh data booking langsung dari baris Google Sheets"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isPullingData ? 'animate-spin' : ''}`} />
                          <span>{isPullingData ? 'Menarik...' : 'Tarik dari Sheets'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={onRefreshBookings}
                        className="text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Segarkan</span>
                      </button>
                    </div>
                  </div>

                  {/* Bookings cards */}
                  {filteredBookings.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                      Belum ada permohonan booking dalam kategori status ini.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all text-xs shadow-2xs"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2">
                            <span className="font-mono font-bold text-sky-700">{b.id}</span>
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-white border border-slate-200 text-slate-800">
                              {b.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-slate-600 mb-2">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Pemesan & WA:</span>
                              <span className="font-semibold text-slate-900">{b.customerName}</span> ({b.customerPhone})
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Pasien:</span>
                              <span className="font-semibold text-slate-900">{b.patientName}</span> ({b.patientAgeGroup})
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Layanan:</span>
                              <span className="text-slate-900 font-medium">{b.serviceName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Jadwal Kunjungan:</span>
                              <span className="text-slate-900 font-medium">{b.visitDate} ({b.timeSlot})</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-400 block text-[10px]">Alamat:</span>
                              <span className="text-slate-700">{b.address}, {b.district}</span>
                            </div>
                          </div>

                          {b.adminNotes && (
                            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 text-[11px] mb-2 border border-amber-200">
                              <strong>Catatan Tim:</strong> {b.adminNotes}
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {formatCurrency(b.estimatedPrice)}
                            </span>
                            <div className="flex gap-2">
                              <a
                                href={`https://wa.me/${b.customerPhone.replace(/\D/g, '')}?text=Halo%20Bpk/Ibu%20${encodeURIComponent(b.customerName)},%20kami%20dari%20Home%20Care%20ingin%20mengonfirmasi%20jadwal%20booking%20${b.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Chat WA</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleOpenEditBooking(b)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Ubah Status</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: KELOLA LAYANAN & TARIF (DENGAN REAL SINKRONISASI KE GOOGLE SHEETS) */}
              {activeTab === 'services' && (
                <div className="space-y-5">
                  
                  {/* Top Notice & Quick Save Banner */}
                  <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold block">Kelola Tarif & Ketersediaan Layanan:</span>
                      <span className="text-sky-800">
                        {isSheetsConnected 
                          ? 'Perubahan tarif akan langsung ditulis ke Sheet \'Layanan\' di Google Spreadsheet Anda.' 
                          : 'Perubahan tarif disimpan lokal. Hubungkan Web App URL agar terupdate ke spreadsheet.'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveServices}
                      disabled={isSavingServices}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-75"
                    >
                      {isSavingServices ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan ke Sheets...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Tarif ke Sheets</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Service Cards List */}
                  <div className="space-y-3.5">
                    {editableServices.map((srv) => (
                      <div
                        key={srv.id}
                        className={`p-4 rounded-xl border transition-all text-xs shadow-2xs ${
                          srv.isActive
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-100 border-slate-300 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                          <div>
                            <span className="font-mono text-[10px] text-slate-400 block">{srv.id}</span>
                            <span className="font-bold text-slate-900 text-sm">{srv.name}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleToggleService(srv.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              srv.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {srv.isActive ? 'Status: Aktif' : 'Status: Nonaktif'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label htmlFor={`price-${srv.id}`} className="block text-xs text-slate-600 font-bold mb-1">
                              Tarif Layanan Dasar (Rp)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                              <input
                                id={`price-${srv.id}`}
                                type="text"
                                value={srv.price.toLocaleString('id-ID')}
                                onChange={(e) => handlePriceChange(srv.id, e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-600 font-bold mb-1">
                              Estimasi Durasi
                            </label>
                            <input
                              type="text"
                              value={srv.duration}
                              readOnly
                              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-600 font-medium cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Photo Preview & Custom Upload Control */}
                        <div className="my-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0 relative">
                              <img
                                src={srv.image}
                                alt={srv.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/images/nurse_vital_check.jpg';
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 block text-[11px]">Foto Layanan</span>
                              <span className="text-[10px] text-slate-500">
                                {srv.image.startsWith('data:image') 
                                  ? 'Foto kustom diupload dari perangkat' 
                                  : 'Foto bawaan sistem'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition-colors shadow-2xs">
                              <Upload className="w-3.5 h-3.5 text-sky-600" />
                              <span>Upload Foto dari HP / Komputer</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleServiceImageUpload(srv.id, e)}
                              />
                            </label>

                            {srv.image.startsWith('data:image') && (
                              <button
                                type="button"
                                onClick={() => handleServiceImageUrlChange(srv.id, '/images/nurse_vital_check.jpg')}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 bg-white"
                                title="Kembalikan foto bawaan"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                          Cakupan: {srv.scope.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM ACTION BAR DEDICATED BUTTON */}
                  <div className="pt-6 pb-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 text-center sm:text-left">
                      {hasServiceChanges ? (
                        <span className="text-amber-700 font-semibold">Ada perubahan tarif yang belum disimpan ke backend.</span>
                      ) : (
                        <span>Semua tarif telah tersinkronkan.</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveServices}
                      disabled={isSavingServices}
                      className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                      {isSavingServices ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Menyimpan ke Google Sheets...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Simpan Semua Perubahan Tarif ke Sheets</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 3: BUSINESS CONFIG & CHANGE ADMIN PASSWORD */}
              {activeTab === 'business' && (
                <div className="space-y-6 text-xs">
                  
                  {/* Business info form */}
                  <form onSubmit={handleSaveBusinessConfig} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900">
                        Informasi Profil Usaha & Kontak Operasional
                      </h4>
                      {isSheetsConnected && (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Sinkron Sheet Pengaturan
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Usaha Layanan</label>
                      <input
                        type="text"
                        value={cfgName}
                        onChange={(e) => setCfgName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Admin (diawali 62...)</label>
                      <input
                        type="text"
                        value={cfgPhone}
                        onChange={(e) => setCfgPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Wilayah Layanan Kunjungan</label>
                      <input
                        type="text"
                        value={cfgArea}
                        onChange={(e) => setCfgArea(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jam Operasional</label>
                      <input
                        type="text"
                        value={cfgHours}
                        onChange={(e) => setCfgHours(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Alamat Kantor Operasional</label>
                      <input
                        type="text"
                        value={cfgAddress}
                        onChange={(e) => setCfgAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Keterangan Izin Operasional / Legalitas</label>
                      <input
                        type="text"
                        value={cfgLicense}
                        onChange={(e) => setCfgLicense(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    {/* Foto Banner Beranda (Hero Banner) Upload */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block font-bold text-slate-800 text-xs">
                            Foto Banner Beranda Utama (Hero Image)
                          </label>
                          <span className="text-[11px] text-slate-500">
                            Foto besar yang tampil di sisi kanan bagian atas website
                          </span>
                        </div>
                        {cfgHeroImage !== '/images/hero_home_care.jpg' && (
                          <button
                            type="button"
                            onClick={() => setCfgHeroImage('/images/hero_home_care.jpg')}
                            className="text-[11px] text-sky-600 hover:text-sky-800 underline flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Bawaan</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-20 h-14 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                          <img
                            src={cfgHeroImage}
                            alt="Preview Banner Hero"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/hero_home_care.jpg';
                            }}
                          />
                        </div>

                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-sky-600" />
                          <span>Ganti / Upload Foto Banner</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleHeroImageUpload}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSavingConfig}
                        className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-75"
                      >
                        {isSavingConfig ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Menyimpan ke Google Sheets...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Simpan Perubahan Info Usaha ke Sheets</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Section: Change Admin Password */}
                  <form onSubmit={handleSaveNewPassword} className="space-y-4 pt-6 border-t border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 pb-1 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-sky-600" />
                      <span>Ubah Kata Sandi Panel Admin</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ganti kata sandi bawaan (<code>admin123</code>) dengan kata sandi baru untuk mencegah akses pihak lain.
                    </p>

                    {passwordChangedToast && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Kata sandi admin berhasil diperbarui!</span>
                      </div>
                    )}

                    <div>
                      <label htmlFor="newAdminPassword" className="block font-semibold text-slate-700 mb-1">
                        Kata Sandi Baru (Min. 5 Karakter)
                      </label>
                      <div className="relative">
                        <input
                          id="newAdminPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Masukkan kata sandi baru..."
                          className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg bg-white"
                          required
                          minLength={5}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          title={showNewPassword ? 'Sembunyikan' : 'Tampilkan'}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4 text-sky-600" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-2 text-xs"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Perbarui Kata Sandi</span>
                    </button>
                  </form>

                </div>
              )}

            </div>
          </>
        )}

        {/* Modal Sub-drawer to Edit Booking Status */}
        {selectedBookingForEdit && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs animate-in zoom-in-95">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Ubah Status Booking: {selectedBookingForEdit.id}
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                {isSheetsConnected 
                  ? 'Status akan langsung diperbarui di baris Google Spreadsheet.' 
                  : 'Perubahan akan disimpan di browser lokal.'}
              </p>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Booking</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Dijadwalkan Ulang">Dijadwalkan Ulang</option>
                    <option value="Sedang Diproses">Sedang Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan untuk Pelanggan</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Contoh: Perawat Ners Rina ditugaskan, tiba pukul 09.00 WIB."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => setSelectedBookingForEdit(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={handleSaveBookingStatus}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  {isUpdatingStatus ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Sheets...</span>
                    </>
                  ) : (
                    <span>Simpan Status ke Sheets</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
