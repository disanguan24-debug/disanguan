import { BookingData, ServiceItem, BusinessConfig, BookingStatus } from '../types';
import { 
  getStoredConfig, getStoredBookings, saveStoredServices, 
  saveStoredConfig, updateBookingStatusInStorage, getStoredServices 
} from './storageService';

export interface SyncResult {
  success: boolean;
  syncedToSheets: boolean;
  message: string;
  error?: string;
  data?: any;
}

/**
 * Mendapatkan URL Google Apps Script Web App yang tersimpan
 */
export const getActiveWebAppUrl = (): string => {
  const config = getStoredConfig();
  return (config.googleWebAppUrl || '').trim();
};

/**
 * 1. SINKRONISASI UPDATE STATUS BOOKING KE GOOGLE SHEETS
 */
export const syncBookingStatusToSheets = async (
  bookingId: string,
  newStatus: BookingStatus,
  adminNotes: string = ''
): Promise<SyncResult> => {
  // Selalu perbarui di penyimpanan lokal terlebih dahulu
  updateBookingStatusInStorage(bookingId, newStatus, adminNotes);

  const webAppUrl = getActiveWebAppUrl();
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return {
      success: true,
      syncedToSheets: false,
      message: 'Perubahan tersimpan di browser lokal. (Google Sheets belum terhubung: masukkan URL Web App pada menu Google Sheets untuk sinkronisasi otomatis).'
    };
  }

  try {
    const payload = {
      action: 'updateBookingStatus',
      bookingId: bookingId,
      status: newStatus,
      adminNotes: adminNotes
    };

    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server Google Apps Script mengembalikan HTTP status ${response.status}`);
    }

    const resJson = await response.json();
    if (resJson.status === 'success') {
      return {
        success: true,
        syncedToSheets: true,
        message: resJson.message || `Status booking ${bookingId} berhasil diperbarui di spreadsheet!`
      };
    } else {
      return {
        success: false,
        syncedToSheets: false,
        message: `Google Sheets merespon: ${resJson.message || 'Gagal memperbarui status baris di spreadsheet.'}`,
        error: resJson.message
      };
    }
  } catch (err: any) {
    console.error('Error syncing booking status to sheets:', err);
    return {
      success: false,
      syncedToSheets: false,
      message: `Gagal memperbarui ke Google Sheets (${err.message || 'Koneksi error / CORS'}). Pastikan deployment Web App diset ke 'Anyone'.`,
      error: err.toString()
    };
  }
};

/**
 * 2. SINKRONISASI DAFTAR LAYANAN & TARIF KE GOOGLE SHEETS
 */
export const syncServicesToSheets = async (
  services: ServiceItem[]
): Promise<SyncResult> => {
  // Simpan ke storage lokal
  saveStoredServices(services);

  const webAppUrl = getActiveWebAppUrl();
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return {
      success: true,
      syncedToSheets: false,
      message: 'Tarif tersimpan di browser lokal. (Google Sheets belum terhubung: sambungkan URL Web App di menu atas untuk sinkronisasi live ke spreadsheet).'
    };
  }

  try {
    const payload = {
      action: 'updateServices',
      services: services.map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        isActive: s.isActive,
        duration: s.duration
      }))
    };

    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server Google Apps Script mengembalikan HTTP status ${response.status}`);
    }

    const resJson = await response.json();
    if (resJson.status === 'success') {
      return {
        success: true,
        syncedToSheets: true,
        message: resJson.message || 'Seluruh tarif & status layanan berhasil diperbarui di sheet Layanan!'
      };
    } else {
      return {
        success: false,
        syncedToSheets: false,
        message: `Google Sheets merespon: ${resJson.message || 'Gagal memperbarui sheet Layanan.'}`,
        error: resJson.message
      };
    }
  } catch (err: any) {
    console.error('Error syncing services to sheets:', err);
    return {
      success: false,
      syncedToSheets: false,
      message: `Gagal memperbarui tarif ke Google Sheets (${err.message || 'Koneksi terhambat'}). Periksa konfigurasi Web App.`,
      error: err.toString()
    };
  }
};

/**
 * 3. SINKRONISASI PENGATURAN USAHA KE GOOGLE SHEETS
 */
export const syncSettingsToSheets = async (
  config: BusinessConfig
): Promise<SyncResult> => {
  saveStoredConfig(config);

  const webAppUrl = getActiveWebAppUrl();
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return {
      success: true,
      syncedToSheets: false,
      message: 'Pengaturan tersimpan secara lokal. Masukkan URL Web App untuk sinkronisasi ke spreadsheet.'
    };
  }

  try {
    const payload = {
      action: 'updateSettings',
      settings: {
        businessName: config.businessName,
        whatsappNumber: config.whatsappNumber,
        address: config.address,
        operationalHours: config.operationalHours,
        serviceArea: config.serviceArea,
        licenseInfo: config.licenseInfo,
        email: config.email
      }
    };

    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server Google Apps Script mengembalikan HTTP status ${response.status}`);
    }

    const resJson = await response.json();
    if (resJson.status === 'success') {
      return {
        success: true,
        syncedToSheets: true,
        message: resJson.message || 'Informasi usaha berhasil diperbarui di sheet Pengaturan!'
      };
    } else {
      return {
        success: false,
        syncedToSheets: false,
        message: `Google Sheets merespon: ${resJson.message || 'Gagal memperbarui sheet Pengaturan.'}`,
        error: resJson.message
      };
    }
  } catch (err: any) {
    console.error('Error syncing settings to sheets:', err);
    return {
      success: false,
      syncedToSheets: false,
      message: `Gagal menyimpan ke Google Sheets: ${err.message || 'Network error'}`,
      error: err.toString()
    };
  }
};

/**
 * 4. TARIK SELURUH DATA TERBARU DARI GOOGLE SPREADSHEET KE FRONTEND
 */
export const fetchLiveSpreadsheetData = async (): Promise<{
  success: boolean;
  bookings?: BookingData[];
  services?: ServiceItem[];
  message: string;
}> => {
  const webAppUrl = getActiveWebAppUrl();
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return {
      success: false,
      message: 'URL Google Apps Script belum terpasang. Tidak dapat menarik data dari spreadsheet.'
    };
  }

  try {
    const response = await fetch(`${webAppUrl}?action=getAllAdminData`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Gagal menghubungi server Apps Script (HTTP ${response.status})`);
    }

    const resJson = await response.json();
    if (resJson.status === 'success') {
      // Perbarui local cache
      if (resJson.bookings && Array.isArray(resJson.bookings)) {
        localStorage.setItem('hc_bookings_v1', JSON.stringify(resJson.bookings));
      }
      return {
        success: true,
        bookings: resJson.bookings,
        services: resJson.services,
        message: `Berhasil menarik ${resJson.bookings ? resJson.bookings.length : 0} data booking dari Google Sheets!`
      };
    } else {
      return {
        success: false,
        message: resJson.message || 'Gagal mengambil data dari Google Sheets.'
      };
    }
  } catch (err: any) {
    console.error('Error fetching live data from sheets:', err);
    return {
      success: false,
      message: `Gagal menarik data dari Google Sheets: ${err.message || 'Koneksi error'}`
    };
  }
};
