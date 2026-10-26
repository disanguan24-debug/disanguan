export type BookingStatus =
  | 'Menunggu Konfirmasi'
  | 'Dikonfirmasi'
  | 'Dijadwalkan Ulang'
  | 'Sedang Diproses'
  | 'Selesai'
  | 'Dibatalkan';

export type AgeGroup =
  | 'Anak-anak (< 12 tahun)'
  | 'Remaja/Dewasa (12 - 59 tahun)'
  | 'Lansia (≥ 60 tahun)';

export type RelationshipType =
  | 'Diri Sendiri'
  | 'Anak'
  | 'Orang Tua'
  | 'Pasangan'
  | 'Kerabat'
  | 'Lainnya';

export type PackageType =
  | '1x Kunjungan Standar'
  | 'Paket 3 Hari (Hemat 5%)'
  | 'Paket Mingguan (7 Kunjungan - Hemat 10%)'
  | 'Paket Pendampingan Bulanan';

export interface BookingData {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  relationship: RelationshipType;
  patientName: string;
  patientAgeGroup: AgeGroup;
  patientConditionNotes: string;
  serviceId: string;
  serviceName: string;
  packageType: PackageType;
  visitDate: string;
  timeSlot: string;
  address: string;
  district: string;
  additionalNotes: string;
  estimatedPrice: number;
  status: BookingStatus;
  adminNotes?: string;
  confirmedAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  scope: string[];
  duration: string;
  price: number;
  priceFormatted: string;
  requirements: string[];
  serviceArea: string;
  isActive: boolean;
  image: string;
}

export interface BusinessConfig {
  businessName: string;
  tagline: string;
  logoUrl: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  operationalHours: string;
  serviceArea: string;
  googleWebAppUrl: string;
  confirmationNotice: string;
  cancellationPolicy: string;
  privacyInfo: string;
  licenseInfo: string;
}

export interface TimeSlotOption {
  id: string;
  timeRange: string;
  period: 'Pagi' | 'Siang' | 'Sore' | 'Petang';
  isAvailable: boolean;
}
