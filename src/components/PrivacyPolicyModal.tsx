import React from 'react';
import { Shield, X } from 'lucide-react';
import { BusinessConfig } from '../types';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessConfig: BusinessConfig;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  businessConfig
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs text-slate-700">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Shield className="w-5 h-5 text-sky-600" />
            <span>Kebijakan Privasi & Perlindungan Data Pasien</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 leading-relaxed">
          <p>
            {businessConfig.businessName} berkomitmen penuh untuk melindungi privasi serta keamanan data pribadi pemesan dan pasien sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022) serta standar kerahasiaan informasi medis tenaga kesehatan.
          </p>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">1. Data yang Dikumpulkan</h4>
            <p>
              Kami hanya mengumpulkan data yang mutlak diperlukan untuk pemesanan dan koordinasi kunjungan ke rumah:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
              <li>Nama lengkap pemesan dan nomor WhatsApp aktif.</li>
              <li>Nama atau inisial pasien serta kelompok usia.</li>
              <li>Alamat lengkap lokasi kunjungan dan catatan kebutuhan perawatan seperlunya.</li>
            </ul>
            <p className="mt-1 font-semibold text-slate-800">
              Kami secara ketat TIDAK meminta nomor KTP (NIK), foto dokumen identitas, atau riwayat rekam medis sensitif pada formulir pemesanan online awal.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">2. Tujuan Penggunaan Data</h4>
            <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
              <li>Memverifikasi ketersediaan jadwal dan mengirimkan konfirmasi via WhatsApp.</li>
              <li>Mengarahkan perawat berwenang ke alamat kediaman pasien secara akurat.</li>
              <li>Mempersiapkan peralatan medis dan balutan yang sesuai dengan jenis tindakan yang dipesan.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">3. Kerahasiaan & Keamanan Akses</h4>
            <p>
              Data pemesanan disimpan dalam basis data terenkripsi dan hanya dapat diakses oleh admin pengelola dan tenaga perawat yang ditugaskan. Kami tidak pernah menjual, menyewakan, atau membagikan data Anda kepada pihak ketiga manapun untuk keperluan pemasaran.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">4. Hak Pasien & Pemesan</h4>
            <p>
              Anda berhak memperbarui, memverifikasi status, atau mengajukan permohonan penghapusan data kontak Anda dari sistem kami setelah rangkaian kunjungan selesai dengan menghubungi customer care kami.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">5. Kontak Petugas Perlindungan Data</h4>
            <p>
              Untuk pertanyaan terkait privasi data, silakan hubungi kami melalui email: <span className="font-semibold text-sky-700">{businessConfig.email}</span> atau WhatsApp: <span className="font-semibold text-sky-700">{businessConfig.whatsappDisplay}</span>.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors"
          >
            Saya Memahami & Menutup
          </button>
        </div>

      </div>
    </div>
  );
};
