/**
 * Google Apps Script Backend Code & Database Generator
 * Sesuai arsitektur Google Sheets 4 Worksheet & Web App Deployment
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ============================================================================
 * GOOGLE APPS SCRIPT — SISTEM BACKEND HOME CARE ONLINE LENGKAP
 * ============================================================================
 * File ini ditempelkan ke Google Apps Script (Extensions > Apps Script)
 * pada Google Spreadsheet yang dituju.
 *
 * FITUR LENGKAP:
 * 1. setupDatabase(): Membuat otomatis 4 sheet & header kolom dengan format rapi.
 * 2. doGet(): Membaca layanan aktif, cek status booking pelanggan, atau tarik seluruh data admin.
 * 3. doPost(): 
 *    - action: 'createBooking'       -> Simpan booking baru dari pengunjung
 *    - action: 'updateBookingStatus' -> Perbarui status booking & catatan admin di baris sheet
 *    - action: 'updateServices'      -> Perbarui tarif & status aktif di sheet Layanan
 *    - action: 'updateSettings'      -> Perbarui info kontak/wilayah di sheet Pengaturan
 *    - action: 'getAllAdminData'     -> Mengambil seluruh data real-time untuk panel admin
 * 4. Proteksi keamanan: Validasi input, LockService anti-race condition, sanitasi HTML.
 */

// Konfigurasi ID Spreadsheet (Kosongkan jika script terikat langsung / bound ke Spreadsheet)
var SPREADSHEET_ID = ""; 

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * 1. FUNGSI INISIALISASI DATABASE OTOMATIS
 * Jalankan fungsi ini SATU KALI dari editor Apps Script untuk membuat semua sheet dan header.
 */
function setupDatabase() {
  var ss = getSpreadsheet();
  
  // -------------------------------------------------------------
  // Sheet 1: Booking
  // -------------------------------------------------------------
  var sheetBooking = ss.getSheetByName("Booking");
  if (!sheetBooking) {
    sheetBooking = ss.insertSheet("Booking");
  }
  var bookingHeaders = [
    "ID Booking",
    "Tanggal Dibuat",
    "Nama Pemesan",
    "Nomor WhatsApp",
    "Hubungan dengan Pasien",
    "Nama atau Inisial Pasien",
    "Kelompok Usia",
    "Jenis Layanan",
    "Paket Layanan",
    "Tanggal Kunjungan",
    "Jam Kunjungan",
    "Alamat",
    "Wilayah",
    "Catatan Kebutuhan",
    "Estimasi Tarif",
    "Status Booking",
    "Catatan Admin",
    "Waktu Konfirmasi",
    "Waktu Pembaruan"
  ];
  sheetBooking.getRange(1, 1, 1, bookingHeaders.length).setValues([bookingHeaders]);
  sheetBooking.getRange(1, 1, 1, bookingHeaders.length)
    .setBackground("#0284c7")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  sheetBooking.setFrozenRows(1);

  // -------------------------------------------------------------
  // Sheet 2: Layanan
  // -------------------------------------------------------------
  var sheetLayanan = ss.getSheetByName("Layanan");
  if (!sheetLayanan) {
    sheetLayanan = ss.insertSheet("Layanan");
  }
  var layananHeaders = [
    "ID Layanan",
    "Nama Layanan",
    "Kategori",
    "Deskripsi",
    "Cakupan Layanan",
    "Durasi Estimasi",
    "Tarif",
    "Persyaratan",
    "Wilayah Layanan",
    "Status Aktif"
  ];
  sheetLayanan.getRange(1, 1, 1, layananHeaders.length).setValues([layananHeaders]);
  sheetLayanan.getRange(1, 1, 1, layananHeaders.length)
    .setBackground("#0369a1")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  sheetLayanan.setFrozenRows(1);

  // Seed Layanan Awal jika kosong
  if (sheetLayanan.getLastRow() === 1) {
    var defaultLayanan = [
      ["SRV-01", "Kunjungan Perawat (Nurse Visit)", "Pelayanan Dasar", "Kunjungan perawat berizin untuk pemantauan kondisi umum dan tanda vital.", "Pemeriksaan TTV, keluhan umum, edukasi dasar", "45-60 Menit", 150000, "Ada pendamping keluarga", "Jabodetabek", "Aktif"],
      ["SRV-02", "Perawatan Lansia (Elderly Care)", "Pendampingan Geriatri", "Bantuan perawatan harian untuk orang tua menjaga kenyamanan dan keselamatan.", "Mandi di bed, oral hygiene, alih baring cegah dekubitus", "90-120 Menit", 225000, "Siapkan alat mandi pribadi", "Jabodetabek", "Aktif"],
      ["SRV-03", "Perawatan Luka (Wound Care)", "Tindakan Keperawatan", "Perawatan luka secara steril dengan teknik balutan modern.", "Asesmen luka, pencucian steril, modern dressing", "60 Menit", 275000, "Sudah ada resep/anjuran dokter", "Jabodetabek", "Aktif"],
      ["SRV-04", "Pemeriksaan Kesehatan di Rumah", "Skrining & Cek", "Skrining kesehatan berkala mencakup tensi dan biomarker POCT cepat.", "Tensi, GDS, Asam Urat, Kolesterol", "45 Menit", 185000, "Puasa 8-10 jam bila cek gula darah", "Jabodetabek", "Aktif"],
      ["SRV-05", "Pendampingan Pasca Rawat Inap", "Transisi RS ke Rumah", "Bantuan pemulihan setelah keluar dari RS agar terapi optimal.", "Review resume RS, pantau tanda komplikasi, edukasi keluarga", "75-90 Menit", 250000, "Sediakan resume medis RS", "Jabodetabek", "Aktif"],
      ["SRV-06", "Layanan Khusus", "Prosedur Tertentu", "Prosedur kateter urin, pipa sonde NGT, atau injeksi resep dokter.", "Pasang/ganti kateter, pasang NGT, injeksi dokter", "60 Menit", 300000, "Wajib resep resmi dokter", "Jabodetabek", "Aktif"]
    ];
    sheetLayanan.getRange(2, 1, defaultLayanan.length, layananHeaders.length).setValues(defaultLayanan);
  }

  // -------------------------------------------------------------
  // Sheet 3: Pengaturan
  // -------------------------------------------------------------
  var sheetPengaturan = ss.getSheetByName("Pengaturan");
  if (!sheetPengaturan) {
    sheetPengaturan = ss.insertSheet("Pengaturan");
  }
  var pengaturanHeaders = ["Kunci", "Nilai", "Keterangan"];
  sheetPengaturan.getRange(1, 1, 1, 3).setValues([pengaturanHeaders]);
  sheetPengaturan.getRange(1, 1, 1, 3)
    .setBackground("#0f766e")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  sheetPengaturan.setFrozenRows(1);

  if (sheetPengaturan.getLastRow() === 1) {
    var defaultSettings = [
      ["Nama_Usaha", "Home Care Sehat Utama", "Nama resmi layanan"],
      ["Deskripsi_Usaha", "Layanan Home Care Perawatan Kesehatan di Rumah", "Ringkasan profil"],
      ["Nomor_WhatsApp", "6281234567890", "Nomor WA admin penerima booking"],
      ["Email", "layanan@homecaresehat.id", "Email resmi kontak"],
      ["Alamat", "Jl. Kesehatan Raya No. 42, Jakarta Selatan", "Alamat operasional"],
      ["Jam_Operasional", "07.00 - 21.00 WIB", "Jam kerja konfirmasi"],
      ["Wilayah_Layanan", "Jakarta Selatan, Depok, Tangerang Selatan", "Jangkauan kunjungan"],
      ["Keterangan_Legalitas", "Layanan beroperasi berkolaborasi dengan Fasilitas Pelayanan Kesehatan / Klinik Pratama Terdaftar", "Info izin"],
      ["Pesan_Konfirmasi", "Permintaan booking diterima. Admin akan menghubungi maksimal 30 menit.", "Pesan status"],
      ["Kebijakan_Pembatalan", "Maksimal 3 jam sebelum waktu kunjungan tanpa biaya.", "Ketentuan reschedule"],
      ["Informasi_Privasi", "Data dilindungi sesuai UU Perlindungan Data Pribadi.", "Kepatuhan privasi"]
    ];
    sheetPengaturan.getRange(2, 1, defaultSettings.length, 3).setValues(defaultSettings);
  }

  // -------------------------------------------------------------
  // Sheet 4: Jadwal
  // -------------------------------------------------------------
  var sheetJadwal = ss.getSheetByName("Jadwal");
  if (!sheetJadwal) {
    sheetJadwal = ss.insertSheet("Jadwal");
  }
  var jadwalHeaders = [
    "ID Jadwal",
    "Tanggal",
    "Jam Mulai",
    "Jam Selesai",
    "Jenis Layanan",
    "Kapasitas Maksimal",
    "Jumlah Booking Aktif",
    "Status Ketersediaan"
  ];
  sheetJadwal.getRange(1, 1, 1, jadwalHeaders.length).setValues([jadwalHeaders]);
  sheetJadwal.getRange(1, 1, 1, jadwalHeaders.length)
    .setBackground("#334155")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  sheetJadwal.setFrozenRows(1);

  Logger.log("Inisialisasi Database Home Care Sukses!");
}

/**
 * 2. ENDPOINT GET
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "getServices";

    if (action === "ping") {
      return createJsonResponse({ status: "success", message: "Koneksi Google Apps Script Aktif!" });
    }

    if (action === "getServices") {
      return handleGetServices();
    }

    if (action === "checkStatus") {
      return handleCheckStatus(params.bookingId, params.phoneLast4);
    }

    if (action === "getAllAdminData") {
      return handleGetAllAdminData();
    }

    return createJsonResponse({ status: "error", message: "Aksi GET '" + action + "' tidak dikenali." });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * 3. ENDPOINT POST: Routing Aksi Pemesanan & Pembaruan Data Admin
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci proses maksimal 20 detik agar aman dari race condition
    if (!lock.tryLock(20000)) {
      return createJsonResponse({
        status: "error",
        message: "Server sedang sibuk memproses pesanan lain. Silakan coba 5 detik lagi."
      });
    }

    var payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }

    var action = payload.action || "createBooking";

    // Routing berdasarkan aksi yang diminta
    if (action === "updateBookingStatus") {
      return handleUpdateBookingStatus(payload);
    }

    if (action === "updateServices") {
      return handleUpdateServices(payload);
    }

    if (action === "updateSettings") {
      return handleUpdateSettings(payload);
    }

    if (action === "getAllAdminData") {
      return handleGetAllAdminData();
    }

    // Default: Membuat Booking Baru
    return handleCreateBooking(payload);

  } catch (err) {
    return createJsonResponse({ status: "error", message: "Gagal memproses request: " + err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handler: Membuat Booking Baru
 */
function handleCreateBooking(payload) {
  if (!payload.customerName || !payload.customerPhone || !payload.serviceName || !payload.visitDate || !payload.address) {
    return createJsonResponse({
      status: "error",
      message: "Data wajib belum lengkap (Nama, WhatsApp, Layanan, Tanggal, dan Alamat harus diisi)."
    });
  }

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var visitDateObj = new Date(payload.visitDate);
  visitDateObj.setHours(0, 0, 0, 0);
  if (visitDateObj < today) {
    return createJsonResponse({
      status: "error",
      message: "Tanggal kunjungan tidak boleh di masa lalu."
    });
  }

  var ss = getSpreadsheet();
  var sheetBooking = ss.getSheetByName("Booking");
  if (!sheetBooking) {
    setupDatabase();
    sheetBooking = ss.getSheetByName("Booking");
  }

  var datePrefix = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMdd");
  var randomSuffix = Math.floor(1000 + Math.random() * 9000);
  var bookingId = payload.id || ("HC-" + datePrefix + "-" + randomSuffix);
  var nowFormatted = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

  var newRow = [
    bookingId,
    nowFormatted,
    escapeHtml(payload.customerName),
    escapeHtml(payload.customerPhone),
    escapeHtml(payload.relationship || "Diri Sendiri"),
    escapeHtml(payload.patientName || payload.customerName),
    escapeHtml(payload.patientAgeGroup || "-"),
    escapeHtml(payload.serviceName),
    escapeHtml(payload.packageType || "1x Kunjungan Standar"),
    escapeHtml(payload.visitDate),
    escapeHtml(payload.timeSlot || "-"),
    escapeHtml(payload.address),
    escapeHtml(payload.district || "-"),
    escapeHtml(payload.patientConditionNotes || "-"),
    Number(payload.estimatedPrice || 0),
    "Menunggu Konfirmasi",
    "", // Catatan Admin
    "", // Waktu Konfirmasi
    nowFormatted // Waktu Pembaruan
  ];

  sheetBooking.appendRow(newRow);

  return createJsonResponse({
    status: "success",
    bookingId: bookingId,
    message: "Permintaan booking berhasil disimpan ke spreadsheet. Menunggu konfirmasi admin.",
    data: {
      id: bookingId,
      customerName: payload.customerName,
      serviceName: payload.serviceName,
      visitDate: payload.visitDate,
      timeSlot: payload.timeSlot,
      estimatedPrice: payload.estimatedPrice,
      status: "Menunggu Konfirmasi"
    }
  });
}

/**
 * Handler: Update Status Booking di Google Sheets
 */
function handleUpdateBookingStatus(payload) {
  var bookingId = payload.bookingId;
  var newStatus = payload.status;
  var adminNotes = payload.adminNotes || "";

  if (!bookingId || !newStatus) {
    return createJsonResponse({ status: "error", message: "Parameter bookingId dan status wajib diisi." });
  }

  var ss = getSpreadsheet();
  var sheetBooking = ss.getSheetByName("Booking");
  if (!sheetBooking) {
    return createJsonResponse({ status: "error", message: "Sheet 'Booking' tidak ditemukan." });
  }

  var data = sheetBooking.getDataRange().getValues();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === String(bookingId).trim().toUpperCase()) {
      rowIndex = i + 1; // 1-based index di Google Sheets
      break;
    }
  }

  if (rowIndex === -1) {
    return createJsonResponse({ status: "error", message: "Booking dengan ID '" + bookingId + "' tidak ditemukan di spreadsheet." });
  }

  var nowFormatted = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

  // Kolom 16: Status Booking
  sheetBooking.getRange(rowIndex, 16).setValue(newStatus);
  // Kolom 17: Catatan Admin
  sheetBooking.getRange(rowIndex, 17).setValue(adminNotes);
  // Kolom 19: Waktu Pembaruan
  sheetBooking.getRange(rowIndex, 19).setValue(nowFormatted);

  // Jika dikonfirmasi, catat waktu konfirmasi di Kolom 18
  if (newStatus === "Dikonfirmasi") {
    sheetBooking.getRange(rowIndex, 18).setValue(nowFormatted);
  }

  return createJsonResponse({
    status: "success",
    message: "Status booking " + bookingId + " berhasil diperbarui menjadi '" + newStatus + "' di Google Sheets!",
    bookingId: bookingId,
    statusValue: newStatus,
    updatedAt: nowFormatted
  });
}

/**
 * Handler: Update Tarif & Status Aktif Layanan di Sheet 'Layanan'
 */
function handleUpdateServices(payload) {
  var servicesToUpdate = payload.services;
  if (!servicesToUpdate || !servicesToUpdate.length) {
    return createJsonResponse({ status: "error", message: "Data daftar layanan (services) kosong." });
  }

  var ss = getSpreadsheet();
  var sheetLayanan = ss.getSheetByName("Layanan");
  if (!sheetLayanan) {
    setupDatabase();
    sheetLayanan = ss.getSheetByName("Layanan");
  }

  var data = sheetLayanan.getDataRange().getValues();
  var updatedCount = 0;

  for (var s = 0; s < servicesToUpdate.length; s++) {
    var item = servicesToUpdate[s];
    var srvId = String(item.id).trim().toUpperCase();

    for (var r = 1; r < data.length; r++) {
      if (String(data[r][0]).trim().toUpperCase() === srvId) {
        var rowNum = r + 1;
        // Kolom 7: Tarif
        if (item.price !== undefined) {
          sheetLayanan.getRange(rowNum, 7).setValue(Number(item.price));
        }
        // Kolom 10: Status Aktif ("Aktif" / "Nonaktif")
        if (item.isActive !== undefined) {
          sheetLayanan.getRange(rowNum, 10).setValue(item.isActive ? "Aktif" : "Nonaktif");
        }
        // Kolom 6: Durasi Estimasi (jika diubah)
        if (item.duration) {
          sheetLayanan.getRange(rowNum, 6).setValue(item.duration);
        }
        updatedCount++;
        break;
      }
    }
  }

  return createJsonResponse({
    status: "success",
    message: "Sebanyak " + updatedCount + " layanan berhasil diperbarui tarif & statusnya di Google Sheets!",
    updatedCount: updatedCount
  });
}

/**
 * Handler: Update Pengaturan Usaha di Sheet 'Pengaturan'
 */
function handleUpdateSettings(payload) {
  var settingsObj = payload.settings || payload;

  var ss = getSpreadsheet();
  var sheetPengaturan = ss.getSheetByName("Pengaturan");
  if (!sheetPengaturan) {
    setupDatabase();
    sheetPengaturan = ss.getSheetByName("Pengaturan");
  }

  var data = sheetPengaturan.getDataRange().getValues();
  var keyMap = {
    "businessName": "Nama_Usaha",
    "whatsappNumber": "Nomor_WhatsApp",
    "address": "Alamat",
    "operationalHours": "Jam_Operasional",
    "serviceArea": "Wilayah_Layanan",
    "licenseInfo": "Keterangan_Legalitas",
    "email": "Email"
  };

  var updatedCount = 0;

  for (var prop in keyMap) {
    if (settingsObj[prop] !== undefined) {
      var sheetKey = keyMap[prop];
      var foundRow = -1;

      for (var r = 1; r < data.length; r++) {
        if (String(data[r][0]).trim() === sheetKey) {
          foundRow = r + 1;
          break;
        }
      }

      if (foundRow !== -1) {
        sheetPengaturan.getRange(foundRow, 2).setValue(String(settingsObj[prop]));
        updatedCount++;
      } else {
        // Tambahkan baris baru jika kunci belum ada
        sheetPengaturan.appendRow([sheetKey, String(settingsObj[prop]), "Diperbarui dari panel admin"]);
        updatedCount++;
      }
    }
  }

  return createJsonResponse({
    status: "success",
    message: "Pengaturan profil usaha berhasil disimpan ke sheet 'Pengaturan' di Google Spreadsheet!",
    updatedCount: updatedCount
  });
}

/**
 * Handler: Mengambil Seluruh Data Real-Time untuk Panel Admin
 */
function handleGetAllAdminData() {
  var ss = getSpreadsheet();
  
  // 1. Ambil Bookings
  var sheetBooking = ss.getSheetByName("Booking");
  var bookings = [];
  if (sheetBooking) {
    var bData = sheetBooking.getDataRange().getValues();
    for (var i = 1; i < bData.length; i++) {
      var row = bData[i];
      if (row[0]) {
        bookings.push({
          id: String(row[0]),
          createdAt: String(row[1]),
          customerName: String(row[2]),
          customerPhone: String(row[3]),
          relationship: String(row[4]),
          patientName: String(row[5]),
          patientAgeGroup: String(row[6]),
          serviceName: String(row[7]),
          packageType: String(row[8]),
          visitDate: String(row[9]),
          timeSlot: String(row[10]),
          address: String(row[11]),
          district: String(row[12]),
          patientConditionNotes: String(row[13]),
          estimatedPrice: Number(row[14]) || 0,
          status: String(row[15]) || "Menunggu Konfirmasi",
          adminNotes: String(row[16] || ""),
          confirmedAt: String(row[17] || ""),
          updatedAt: String(row[18] || "")
        });
      }
    }
  }

  // 2. Ambil Layanan
  var servicesRes = handleGetServices();
  var services = JSON.parse(servicesRes.getContent()).services || [];

  return createJsonResponse({
    status: "success",
    bookings: bookings,
    services: services
  });
}

/**
 * Handler Mengambil Daftar Layanan Aktif
 */
function handleGetServices() {
  var ss = getSpreadsheet();
  var sheetLayanan = ss.getSheetByName("Layanan");
  if (!sheetLayanan) {
    setupDatabase();
    sheetLayanan = ss.getSheetByName("Layanan");
  }

  var data = sheetLayanan.getDataRange().getValues();
  var services = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      var isActive = (String(row[9]).toLowerCase() === "aktif");
      services.push({
        id: String(row[0]),
        name: String(row[1]),
        category: String(row[2]),
        description: String(row[3]),
        scope: String(row[4]).split(",").map(function(s){ return s.trim(); }),
        duration: String(row[5]),
        price: Number(row[6]) || 0,
        requirements: String(row[7]).split(",").map(function(s){ return s.trim(); }),
        serviceArea: String(row[8]),
        isActive: isActive
      });
    }
  }

  return createJsonResponse({ status: "success", services: services });
}

/**
 * Handler Cek Status Booking Pelanggan
 */
function handleCheckStatus(bookingId, phoneLast4) {
  if (!bookingId) {
    return createJsonResponse({ status: "error", message: "Nomor Booking wajib diisi." });
  }

  var ss = getSpreadsheet();
  var sheetBooking = ss.getSheetByName("Booking");
  if (!sheetBooking) {
    return createJsonResponse({ status: "error", message: "Database booking belum ditemukan." });
  }

  var data = sheetBooking.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var idInSheet = String(row[0]).trim();
    if (idInSheet.toUpperCase() === bookingId.trim().toUpperCase()) {
      var phoneInSheet = String(row[3]).replace(/\\D/g, "");
      
      if (phoneLast4) {
        var cleanInputLast4 = String(phoneLast4).replace(/\\D/g, "");
        if (cleanInputLast4.length === 4 && !phoneInSheet.endsWith(cleanInputLast4)) {
          return createJsonResponse({
            status: "error",
            message: "Verifikasi gagal: 4 digit terakhir nomor WhatsApp tidak sesuai."
          });
        }
      }

      return createJsonResponse({
        status: "success",
        booking: {
          id: row[0],
          createdAt: row[1],
          customerName: maskName(String(row[2])),
          patientName: maskName(String(row[5])),
          serviceName: row[7],
          packageType: row[8],
          visitDate: row[9],
          timeSlot: row[10],
          status: row[15],
          adminNotes: row[16] || "Pesanan sedang dalam proses peninjauan ketersediaan perawat.",
          updatedAt: row[18]
        }
      });
    }
  }

  return createJsonResponse({
    status: "error",
    message: "Nomor booking '" + bookingId + "' tidak ditemukan dalam sistem."
  });
}

/**
 * Helper JSON Response dengan Header CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Sanitasi HTML
 */
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sensor nama untuk privasi
 */
function maskName(str) {
  if (!str) return "-";
  var parts = str.trim().split(" ");
  if (parts.length === 1) return parts[0];
  var last = parts[parts.length - 1];
  parts[parts.length - 1] = last.charAt(0) + "***";
  return parts.join(" ");
}
`;

export const SETUP_INSTRUCTIONS_MARKDOWN = `
# Panduan Integrasi Google Sheets & Google Apps Script (Versi 2 - Full Real-time Sync)

Aplikasi **Home Care** ini mendukung sinkronisasi dua arah secara real-time dengan Google Spreadsheet Anda.

---

### Cara Memperbarui Kode Google Apps Script Anda:
1. Buka Google Spreadsheet Anda.
2. Klik menu **Extensions (Ekstensi)** > **Apps Script**.
3. Ganti seluruh isi file \`Code.gs\` dengan kode terbaru dari tab **2. Kode Google Apps Script (Code.gs)**.
4. Klik tombol **Save (Simpan)**.
5. Klik tombol biru **Deploy** di pojok kanan atas > **Manage deployments**.
6. Klik ikon pensil **Edit**, pilih versi **New version** (Versi baru).
7. Pastikan **Who has access** tetap **\`Anyone\`** (Siapa saja).
8. Klik **Deploy** dan salin URL Web App yang dihasilkan.
9. Tempelkan URL tersebut ke tab **1. Hubungkan Web App URL** di aplikasi ini dan klik **Simpan & Uji Koneksi**.

---

### Aksi yang Otomatis Disinkronkan ke Spreadsheet:
1. **Pemesanan Baru**: Tersimpan di baris baru sheet \`Booking\`.
2. **Ubah Status Booking**: Langsung memperbarui Kolom 16 (\`Status Booking\`), Kolom 17 (\`Catatan Admin\`), Kolom 18 (\`Waktu Konfirmasi\`), dan Kolom 19 (\`Waktu Pembaruan\`) di baris booking yang bersangkutan di sheet \`Booking\`.
3. **Ubah Tarif & Status Layanan**: Langsung memperbarui Kolom 7 (\`Tarif\`) dan Kolom 10 (\`Status Aktif\`) pada sheet \`Layanan\`.
4. **Ubah Info Usaha & Kontak**: Langsung memperbarui baris-baris terkait pada sheet \`Pengaturan\`.
`;
