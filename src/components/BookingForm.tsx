import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Phone, MapPin, FileText, CheckCircle2, 
  AlertCircle, MessageCircle, RefreshCw, Send, ShieldCheck, ArrowRight, Copy, Check
} from 'lucide-react';
import { 
  ServiceItem, BusinessConfig, BookingData, RelationshipType, 
  AgeGroup, PackageType 
} from '../types';
import { DISTRICT_LIST, TIME_SLOTS } from '../data/defaultData';
import { 
  formatCurrency, saveBooking, generateWhatsAppBookingUrl 
} from '../services/storageService';

interface BookingFormProps {
  services: ServiceItem[];
  businessConfig: BusinessConfig;
  preselectedService?: ServiceItem | null;
  onClearPreselectedService: () => void;
  onOpenPrivacyModal: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  services,
  businessConfig,
  preselectedService,
  onClearPreselectedService,
  onOpenPrivacyModal
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Diri Sendiri');
  
  const [patientName, setPatientName] = useState('');
  const [patientAgeGroup, setPatientAgeGroup] = useState<AgeGroup>('Lansia (≥ 60 tahun)');
  const [patientConditionNotes, setPatientConditionNotes] = useState('');

  const [serviceId, setServiceId] = useState<string>(services[0]?.id || 'SRV-01');
  const [packageType, setPackageType] = useState<PackageType>('1x Kunjungan Standar');
  const [visitDate, setVisitDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0].timeRange);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState(DISTRICT_LIST[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Consent
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingData | null>(null);
  const [syncStatusNotice, setSyncStatusNotice] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);

  // Sync preselected service
  useEffect(() => {
    if (preselectedService) {
      setServiceId(preselectedService.id);
      // Auto-scroll to form smoothly
      const formEl = document.getElementById('formulir-booking');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [preselectedService]);

  // Minimum date = today (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Selected service object
  const currentService = services.find(s => s.id === serviceId) || services[0];

  // Dynamic price calculation
  const calculateTotal = (): number => {
    if (!currentService) return 0;
    const base = currentService.price;
    switch (packageType) {
      case '1x Kunjungan Standar':
        return base;
      case 'Paket 3 Hari (Hemat 5%)':
        return Math.round(base * 3 * 0.95);
      case 'Paket Mingguan (7 Kunjungan - Hemat 10%)':
        return Math.round(base * 7 * 0.90);
      case 'Paket Pendampingan Bulanan':
        return Math.round(base * 20 * 0.85);
      default:
        return base;
    }
  };

  const estimatedTotal = calculateTotal();

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Nama lengkap pemesan wajib diisi.';
    }

    // Indonesian phone format validation (08xx or 628xx, min 10 digits)
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.customerPhone = 'Nomor WhatsApp wajib diisi.';
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      newErrors.customerPhone = 'Nomor WhatsApp tidak valid (minimal 10 digit).';
    } else if (!cleanPhone.startsWith('08') && !cleanPhone.startsWith('628')) {
      newErrors.customerPhone = 'Gunakan format Indonesia (diawali 08... atau 628...).';
    }

    if (!patientName.trim()) {
      newErrors.patientName = 'Nama atau inisial pasien wajib diisi.';
    }

    if (!visitDate) {
      newErrors.visitDate = 'Tanggal kunjungan wajib dipilih.';
    } else if (visitDate < todayStr) {
      newErrors.visitDate = 'Tanggal kunjungan tidak boleh di masa lalu.';
    }

    if (!timeSlot) {
      newErrors.timeSlot = 'Pilihan jam kunjungan wajib dipilih.';
    }

    if (!address.trim()) {
      newErrors.address = 'Alamat lengkap lokasi kunjungan wajib diisi.';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Harap tulis alamat lebih jelas beserta nomor rumah / patokan jalan.';
    }

    if (!consentAccepted) {
      newErrors.consent = 'Anda harus menyetujui pernyataan kebenaran data dan kebijakan privasi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double click

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const el = document.getElementById(firstError);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await saveBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        relationship,
        patientName: patientName.trim(),
        patientAgeGroup,
        patientConditionNotes: patientConditionNotes.trim() || 'Tidak ada catatan khusus',
        serviceId: currentService.id,
        serviceName: currentService.name,
        packageType,
        visitDate,
        timeSlot,
        address: address.trim(),
        district,
        additionalNotes: additionalNotes.trim(),
        estimatedPrice: estimatedTotal
      });

      if (result.success) {
        setCompletedBooking(result.booking);
        setSyncStatusNotice(result.message);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: 'Terjadi kesalahan sistem saat mengirim booking. Silakan coba kembali.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCompletedBooking(null);
    setCustomerName('');
    setCustomerPhone('');
    setPatientName('');
    setPatientConditionNotes('');
    setVisitDate('');
    setAddress('');
    setAdditionalNotes('');
    setConsentAccepted(false);
    onClearPreselectedService();
  };

  const copyBookingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <section id="formulir-booking" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 tracking-wide uppercase mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Pemesanan Mudah & Cepat</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Formulir Booking Online
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Isi formulir di bawah ini dengan lengkap. Data Anda tersimpan aman dan admin kami akan mengonfirmasi jadwal via WhatsApp.
          </p>
        </div>

        {/* CONDITION 1: SUCCESS CONFIRMATION VIEW */}
        {completedBooking ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block mb-1">
                Permohonan Booking Berhasil Terkirim
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Terima Kasih, {completedBooking.customerName}!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Permintaan kunjungan Anda telah kami terima dan tercatat di sistem database kami.
              </p>
            </div>

            {/* Booking Details Ticket */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-2xs max-w-2xl mx-auto">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Nomor Booking Unik</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-bold text-sky-700 font-mono tracking-wide">
                      {completedBooking.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyBookingId(completedBooking.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                      title="Salin Nomor Booking"
                    >
                      {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Status Awal</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{completedBooking.status}</span>
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block">Jenis Layanan</span>
                  <span className="font-semibold text-slate-900">{completedBooking.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Paket Kunjungan</span>
                  <span className="font-semibold text-slate-900">{completedBooking.packageType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Jadwal Tanggal & Jam</span>
                  <span className="font-semibold text-slate-900">
                    {completedBooking.visitDate} · {completedBooking.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pasien</span>
                  <span className="font-semibold text-slate-900">
                    {completedBooking.patientName} ({completedBooking.patientAgeGroup})
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block">Alamat Kunjungan</span>
                  <span className="font-medium text-slate-800">
                    {completedBooking.address}, {completedBooking.district}
                  </span>
                </div>
              </div>

              {/* Price Row */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Estimasi Total Tarif</span>
                <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(completedBooking.estimatedPrice)}
                </span>
              </div>
            </div>

            {/* Sync Notice */}
            {syncStatusNotice && (
              <div className="max-w-2xl mx-auto mb-6 p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{syncStatusNotice}</span>
              </div>
            )}

            {/* Next Steps Call to Action */}
            <div className="max-w-2xl mx-auto space-y-3">
              <a
                href={generateWhatsAppBookingUrl(completedBooking, businessConfig)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Kirim Ringkasan Booking ke WhatsApp Admin</span>
              </a>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Buat Booking Baru Lainnya
                </button>
                <a
                  href="#beranda"
                  className="flex-1 py-2.5 px-4 text-center rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Kembali ke Beranda
                </a>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-400 mt-6 max-w-md mx-auto">
              Simpan Nomor Booking Anda <strong>{completedBooking.id}</strong>. Anda dapat menggunakannya di tombol "Cek Status" di bagian atas halaman untuk memantau proses verifikasi perawat.
            </p>
          </div>
        ) : (
          /* CONDITION 2: ACTIVE BOOKING FORM */
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. DATA PEMESAN */}
            <div className="bg-slate-50/70 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-sky-600" />
                <span>1. Data Pemesan (Kontak Penanggung Jawab)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pemesan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${
                      errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${
                        errors.customerPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {errors.customerPhone ? (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.customerPhone}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">Admin akan mengirim konfirmasi jadwal ke nomor ini.</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="relationship" className="block text-xs font-semibold text-slate-700 mb-1">
                    Hubungan Anda dengan Pasien
                  </label>
                  <select
                    id="relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  >
                    <option value="Diri Sendiri">Diri Sendiri (Saya Pasiennya)</option>
                    <option value="Anak">Anak Pasien</option>
                    <option value="Orang Tua">Orang Tua Pasien</option>
                    <option value="Pasangan">Pasangan (Suami/Istri)</option>
                    <option value="Kerabat">Kerabat / Saudara</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. DATA PASIEN (MINIMALIS & AMAN TANPA NIK/REKAM MEDIS SENSITIF) */}
            <div className="bg-slate-50/70 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>2. Data Pasien yang Akan Dirawat</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pasien / Inisial <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Contoh: Ibu Maryam atau Ny. M"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${
                      errors.patientName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.patientName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.patientName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="patientAgeGroup" className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelompok Usia Pasien
                  </label>
                  <select
                    id="patientAgeGroup"
                    value={patientAgeGroup}
                    onChange={(e) => setPatientAgeGroup(e.target.value as AgeGroup)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  >
                    <option value="Lansia (≥ 60 tahun)">Lansia (≥ 60 tahun)</option>
                    <option value="Remaja/Dewasa (12 - 59 tahun)">Remaja/Dewasa (12 - 59 tahun)</option>
                    <option value="Anak-anak (< 12 tahun)">Anak-anak (&lt; 12 tahun)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="patientConditionNotes" className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Kebutuhan Pasien Seperlunya (Opsional)
                  </label>
                  <input
                    id="patientConditionNotes"
                    type="text"
                    value={patientConditionNotes}
                    onChange={(e) => setPatientConditionNotes(e.target.value)}
                    placeholder="Contoh: Pasien tirah baring pasca stroke, butuh bantuan mandi dan ganti balutan luka"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Demi keamanan privasi, jangan mencantumkan nomor KTP/NIK atau rekam medis sensitif pada formulir pemesanan awal.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. LAYANAN & ESTIMASI BIAYA */}
            <div className="bg-slate-50/70 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>3. Pilihan Layanan & Paket Kunjungan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="serviceId" className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Jenis Layanan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="serviceId"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-800"
                  >
                    {services.filter(s => s.isActive).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({formatCurrency(s.price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="packageType" className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilihan Paket Frekuensi Kunjungan
                  </label>
                  <select
                    id="packageType"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value as PackageType)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-slate-800"
                  >
                    <option value="1x Kunjungan Standar">1x Kunjungan Standar</option>
                    <option value="Paket 3 Hari (Hemat 5%)">Paket 3 Hari (Hemat 5%)</option>
                    <option value="Paket Mingguan (7 Kunjungan - Hemat 10%)">Paket Mingguan (7 Hari - Hemat 10%)</option>
                    <option value="Paket Pendampingan Bulanan">Paket Pendampingan Bulanan (20 Kunjungan)</option>
                  </select>
                </div>

                {/* Service Details Snippet */}
                {currentService && (
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-white border border-slate-200/90 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-slate-900">{currentService.name}</span>
                      <span className="text-slate-500">Estimasi durasi: {currentService.duration}</span>
                    </div>
                    <p className="text-slate-600 mb-2">{currentService.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-semibold">
                      <span className="text-slate-600">Perkiraan Biaya ({packageType}):</span>
                      <span className="text-base font-bold text-sky-700 font-mono tabular-nums">
                        {formatCurrency(estimatedTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. JADWAL & LOKASI KUNJUNGAN */}
            <div className="bg-slate-50/70 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>4. Jadwal & Alamat Kunjungan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="visitDate" className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Kunjungan yang Diharapkan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="visitDate"
                    type="date"
                    min={todayStr}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${
                      errors.visitDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.visitDate && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.visitDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="timeSlot" className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilihan Slot Jam Kunjungan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="timeSlot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot.id} value={slot.timeRange}>
                        [{slot.period}] {slot.timeRange}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="district" className="block text-xs font-semibold text-slate-700 mb-1">
                    Wilayah / Kecamatan Layanan
                  </label>
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  >
                    {DISTRICT_LIST.map((dist, idx) => (
                      <option key={idx} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Kunjungan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kelurahan, dan patokan agar perawat tidak tersesat"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${
                      errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="additionalNotes" className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Tambahan untuk Petugas (Opsional)
                  </label>
                  <input
                    id="additionalNotes"
                    type="text"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Contoh: Bel rumah rusak, mohon WhatsApp saat sampai di depan gerbang"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 5. PERSETUJUAN & KEBIJAKAN PRIVASI */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-sky-600 focus:ring-sky-500 shrink-0"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Saya menyatakan bahwa data yang dikirimkan adalah benar. Saya memahami bahwa pengiriman formulir ini adalah <strong>pengajuan booking</strong> yang memerlukan konfirmasi admin, dan saya menyetujui pemrosesan data kontak untuk keperluan koordinasi kunjungan sesuai{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacyModal}
                    className="text-sky-600 hover:text-sky-800 underline font-semibold inline"
                  >
                    Kebijakan Privasi & Ketentuan Pelayanan
                  </button>.
                </span>
              </label>
              {errors.consent && (
                <p className="text-[11px] text-rose-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.consent}</span>
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON WITH ANTI-DOUBLE CLICK PROTECTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                <span>Total Estimasi: </span>
                <span className="font-bold text-slate-900 font-mono text-base tabular-nums">
                  {formatCurrency(estimatedTotal)}
                </span>
                <span className="block text-[11px] text-slate-400">Belum termasuk biaya transportasi bila di luar radius 10 km.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-xl shadow-xs transition-all ${
                  isSubmitting
                    ? 'bg-sky-400 cursor-not-allowed opacity-80'
                    : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Menyimpan Booking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Permohonan Booking</span>
                  </>
                )}
              </button>
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errors.submit}
              </div>
            )}
          </form>
        )}

      </div>
    </section>
  );
};
