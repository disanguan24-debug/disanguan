import { BookingData, BusinessConfig, ServiceItem, BookingStatus } from '../types';
import { DEFAULT_BUSINESS_CONFIG, INITIAL_SERVICES } from '../data/defaultData';

const STORAGE_KEYS = {
  BOOKINGS: 'hc_bookings_v1',
  SERVICES: 'hc_services_v1',
  CONFIG: 'hc_config_v1',
  WEB_APP_URL: 'hc_web_app_url_v1',
  ADMIN_PASSWORD: 'hc_admin_pwd_v1'
};

const DEFAULT_ADMIN_PASSWORD = 'admin123';

export const getStoredAdminPassword = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASSWORD;
  } catch (e) {
    return DEFAULT_ADMIN_PASSWORD;
  }
};

export const saveStoredAdminPassword = (newPassword: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
  } catch (e) {
    console.error('Error saving admin password:', e);
  }
};

export const verifyAdminPassword = (inputPassword: string): boolean => {
  const current = getStoredAdminPassword();
  return inputPassword === current;
};

export const normalizeImagePath = (path?: string): string => {
  if (!path) return '/images/hero_home_care.jpg';
  if (path.startsWith('data:image')) return path; // User uploaded base64 image
  if (path.startsWith('http://') || path.startsWith('https://')) return path; // Remote URL
  if (path.includes('nurse_vital_check')) return '/images/nurse_vital_check.jpg';
  if (path.includes('elderly_care_home')) return '/images/elderly_care_home.jpg';
  if (path.includes('sterile_wound_care')) return '/images/sterile_wound_care.jpg';
  if (path.includes('hero_home_care')) return '/images/hero_home_care.jpg';
  if (path.startsWith('/src/assets/images/')) {
    return path.replace('/src/assets/images/', '/images/').replace(/_\d+\.jpg$/, '.jpg');
  }
  return path;
};

export const getStoredConfig = (): BusinessConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { 
        ...DEFAULT_BUSINESS_CONFIG, 
        ...parsed,
        heroImageUrl: normalizeImagePath(parsed.heroImageUrl || DEFAULT_BUSINESS_CONFIG.heroImageUrl)
      };
    }
  } catch (e) {
    console.error('Error reading config from storage:', e);
  }
  return DEFAULT_BUSINESS_CONFIG;
};

export const saveStoredConfig = (config: BusinessConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    if (config.googleWebAppUrl) {
      localStorage.setItem(STORAGE_KEYS.WEB_APP_URL, config.googleWebAppUrl);
    }
  } catch (e) {
    console.error('Error saving config to storage:', e);
  }
};

export const getStoredServices = (): ServiceItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (raw) {
      const parsed: ServiceItem[] = JSON.parse(raw);
      return parsed.map(s => ({
        ...s,
        image: normalizeImagePath(s.image)
      }));
    }
  } catch (e) {
    console.error('Error reading services from storage:', e);
  }
  return INITIAL_SERVICES;
};

export const saveStoredServices = (services: ServiceItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Error saving services to storage:', e);
  }
};

export const getStoredBookings = (): BookingData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading bookings from storage:', e);
  }
  return [];
};

export const saveBooking = async (
  booking: Omit<BookingData, 'id' | 'createdAt' | 'status'>
): Promise<{ success: boolean; booking: BookingData; syncedToSheets: boolean; message: string }> => {
  // 1. Generate unique booking ID
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `HC-${dateStr}-${randomSuffix}`;

  const newBooking: BookingData = {
    ...booking,
    id: bookingId,
    createdAt: new Date().toISOString(),
    status: 'Menunggu Konfirmasi',
    updatedAt: new Date().toISOString()
  };

  // 2. Save locally first (Guaranteed reliability)
  const existing = getStoredBookings();
  const updated = [newBooking, ...existing];
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving booking locally:', e);
  }

  // 3. Try to sync with Google Apps Script if URL configured
  const config = getStoredConfig();
  let syncedToSheets = false;
  let backendMessage = 'Booking berhasil dicatat secara lokal. Menunggu verifikasi admin.';

  if (config.googleWebAppUrl && config.googleWebAppUrl.trim().startsWith('http')) {
    try {
      const response = await fetch(config.googleWebAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newBooking)
      });
      if (response.ok) {
        const resJson = await response.json();
        if (resJson.status === 'success') {
          syncedToSheets = true;
          backendMessage = 'Booking berhasil disinkronkan langsung ke Google Sheets!';
        }
      }
    } catch (err) {
      console.warn('Google Sheets sync unavailable or CORS blocked. Kept in local store:', err);
      backendMessage = 'Tersimpan di sistem lokal (Google Apps Script belum terhubung atau offline).';
    }
  }

  return {
    success: true,
    booking: newBooking,
    syncedToSheets,
    message: backendMessage
  };
};

export const updateBookingStatusInStorage = (
  bookingId: string,
  newStatus: BookingStatus,
  adminNotes?: string
): BookingData | null => {
  const list = getStoredBookings();
  const index = list.findIndex(b => b.id.toUpperCase() === bookingId.toUpperCase());
  if (index === -1) return null;

  const item = list[index];
  item.status = newStatus;
  if (adminNotes !== undefined) {
    item.adminNotes = adminNotes;
  }
  item.updatedAt = new Date().toISOString();
  if (newStatus === 'Dikonfirmasi') {
    item.confirmedAt = new Date().toISOString();
  }

  list[index] = item;
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
  return item;
};

export const findBookingByIdAndPhone = (
  bookingId: string,
  phoneLast4: string
): { found: boolean; booking?: BookingData; error?: string } => {
  const cleanId = bookingId.trim().toUpperCase();
  const cleanLast4 = phoneLast4.replace(/\D/g, '');

  if (!cleanId) {
    return { found: false, error: 'Silakan masukkan Nomor Booking.' };
  }

  if (cleanLast4.length !== 4) {
    return { found: false, error: 'Silakan masukkan 4 digit terakhir nomor WhatsApp pemesan.' };
  }

  const list = getStoredBookings();
  const foundItem = list.find(b => b.id.toUpperCase() === cleanId);

  if (!foundItem) {
    return { found: false, error: `Nomor booking "${cleanId}" tidak ditemukan. Harap pastikan kembali kode booking Anda.` };
  }

  const cleanPhone = foundItem.customerPhone.replace(/\D/g, '');
  if (!cleanPhone.endsWith(cleanLast4)) {
    return { found: false, error: 'Verifikasi keamanan gagal: 4 digit nomor telepon tidak sesuai dengan data pemesan.' };
  }

  return { found: true, booking: foundItem };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateWhatsAppBookingUrl = (
  booking: BookingData,
  businessConfig: BusinessConfig
): string => {
  const phone = businessConfig.whatsappNumber.replace(/\D/g, '');
  const message = `Halo Admin *${businessConfig.businessName}*,%0A%0ASaya ingin konfirmasi permintaan booking Home Care:%0A%0A` +
    `*No. Booking:* ${booking.id}%0A` +
    `*Pemesan:* ${encodeURIComponent(booking.customerName)} (${encodeURIComponent(booking.relationship)})%0A` +
    `*Pasien:* ${encodeURIComponent(booking.patientName)} (${encodeURIComponent(booking.patientAgeGroup)})%0A` +
    `*Layanan:* ${encodeURIComponent(booking.serviceName)}%0A` +
    `*Paket:* ${encodeURIComponent(booking.packageType)}%0A` +
    `*Jadwal:* ${booking.visitDate} (Slot: ${encodeURIComponent(booking.timeSlot)})%0A` +
    `*Alamat:* ${encodeURIComponent(booking.address)}, ${encodeURIComponent(booking.district)}%0A` +
    `*Estimasi Tarif:* ${encodeURIComponent(formatCurrency(booking.estimatedPrice))}%0A%0A` +
    `Mohon info ketersediaan tenaga perawat untuk jadwal tersebut. Terima kasih.`;

  return `https://wa.me/${phone}?text=${message}`;
};

export const generateGeneralWhatsAppUrl = (
  businessConfig: BusinessConfig,
  topic: string = 'Konsultasi Layanan Home Care'
): string => {
  const phone = businessConfig.whatsappNumber.replace(/\D/g, '');
  const message = `Halo Admin *${businessConfig.businessName}*, saya ingin bertanya mengenai ${encodeURIComponent(topic)}. Mohon informasi ketersediaan layanan dan tarif kunjungan ke rumah. Terima kasih.`;
  return `https://wa.me/${phone}?text=${message}`;
};
