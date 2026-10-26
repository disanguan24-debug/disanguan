import React, { useState } from 'react';
import { 
  Database, Copy, Check, ExternalLink, CheckCircle2, 
  AlertCircle, RefreshCw, Table, BookOpen, Key, Globe, Rocket
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../services/gasCode';
import { BusinessConfig } from '../types';

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessConfig: BusinessConfig;
  onSaveWebAppUrl: (url: string) => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({
  isOpen,
  onClose,
  businessConfig,
  onSaveWebAppUrl
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'structure' | 'guide' | 'connect' | 'hosting'>('connect');
  const [copiedCode, setCopiedCode] = useState(false);
  const [webAppUrlInput, setWebAppUrlInput] = useState(businessConfig.googleWebAppUrl || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestConnection = async () => {
    const url = webAppUrlInput.trim();
    if (!url || !url.startsWith('https://script.google.com/')) {
      setTestStatus('error');
      setTestMessage('URL harus berupa URL Google Apps Script Web App yang valid (diawali https://script.google.com/macros/s/...)');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Mengirim uji koneksi ke Web App Google Sheets...');

    try {
      // Test ping endpoint
      const response = await fetch(`${url}?action=ping`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success') {
          setTestStatus('success');
          setTestMessage('Koneksi berhasil! Database Google Apps Script terhubung aktif dan siap menerima booking.');
          onSaveWebAppUrl(url);
        } else {
          setTestStatus('error');
          setTestMessage(`Respons diterima namun ada catatan: ${json.message || 'Status tidak sukses'}`);
        }
      } else {
        setTestStatus('error');
        setTestMessage(`Gagal menghubungi server (HTTP ${response.status}). Pastikan deployment Web App diset ke "Anyone" (Siapa saja).`);
      }
    } catch (err) {
      // Often CORS on plain fetch or invalid URL
      setTestStatus('error');
      setTestMessage('Koneksi terhambat CORS atau URL salah. Pastikan Web App dideploy dengan hak akses "Who has access: Anyone". URL tetap dapat disimpan jika deployment sudah benar.');
      onSaveWebAppUrl(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Integrasi Database Google Sheets & Apps Script
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan formulir booking langsung ke Google Spreadsheet tanpa database berbayar
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-5 sm:px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'connect'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>1. Hubungkan Web App URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>2. Kode Google Apps Script (Code.gs)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('structure')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'structure'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>3. Struktur 4 Worksheet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>4. Panduan Google Sheets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hosting')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hosting'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>5. Deploy Vercel / Netlify</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: CONNECT WEB APP URL */}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="text-sm font-bold text-emerald-950 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Koneksi Real-time ke Google Spreadsheet</span>
                </h4>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  Setelah Anda menyalin kode script ke Google Sheets dan mempublikasikannya sebagai Web App, masukkan URL Web App yang dihasilkan di bawah ini. Aplikasi akan otomatis menyinkronkan data pesanan ke Google Sheets setiap kali ada pemesanan baru.
                </p>
              </div>

              <div className="space-y-3">
                <label htmlFor="webAppUrl" className="block text-xs font-bold text-slate-700">
                  Google Apps Script Web App URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="webAppUrl"
                    type="url"
                    value={webAppUrlInput}
                    onChange={(e) => setWebAppUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shadow-xs"
                  >
                    {testStatus === 'testing' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menguji...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        <span>Simpan & Uji</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = webAppUrlInput.trim();
                      if (trimmed) {
                        onSaveWebAppUrl(trimmed);
                        setTestStatus('success');
                        setTestMessage('URL Google Apps Script berhasil disimpan!');
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Simpan URL</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Format URL harus berakhiran <code>/exec</code> bukan <code>/dev</code>. Sinkronisasi real-time mencakup: Booking baru, Ubah Status Booking, Update Tarif Layanan, dan Pengaturan Usaha.
                </p>
              </div>

              {/* Status Feedback */}
              {testMessage && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testStatus === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : testStatus === 'error'
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {testStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{testMessage}</span>
                </div>
              )}

              {/* Offline-First Guarantee */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Jaminan Keandalan Tanpa Hambatan:</span>
                <p>
                  Jika Anda belum sempat men-deploy Google Apps Script, jangan khawatir! Seluruh booking dan pengelolaan di aplikasi ini tetap berjalan 100% normal dan disimpan di memori browser lokal (LocalStorage). Begitu Web App URL diaktifkan, integrasi Sheets langsung aktif.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SCRIPT CODE */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Source Code Google Apps Script (Code.gs)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Termasuk fungsi <code>setupDatabase()</code> untuk membuat otomatis 4 sheet dan header.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Kode'}</span>
                </button>
              </div>

              <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto text-slate-200 font-mono text-[11px] max-h-96 leading-relaxed">
                <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: SHEET STRUCTURE */}
          {activeTab === 'structure' && (
            <div className="space-y-6 text-xs text-slate-700">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Struktur 1 File Spreadsheet dengan 4 Worksheet:
                </h4>
                <p className="text-slate-500 mb-4">
                  Dibuat otomatis oleh fungsi <code>setupDatabase()</code> di Apps Script.
                </p>
              </div>

              {/* Sheet 1: Booking */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Sheet 1: Booking (19 Kolom)</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">Data Pesanan</span>
                </div>
                <p className="text-slate-600 mb-3 text-[11px]">
                  Menampung setiap permohonan booking yang masuk dari formulir website.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono text-slate-600">
                  <span>1. ID Booking</span>
                  <span>2. Tanggal Dibuat</span>
                  <span>3. Nama Pemesan</span>
                  <span>4. Nomor WhatsApp</span>
                  <span>5. Hubungan Pasien</span>
                  <span>6. Nama Pasien</span>
                  <span>7. Kelompok Usia</span>
                  <span>8. Jenis Layanan</span>
                  <span>9. Paket Layanan</span>
                  <span>10. Tanggal Kunjungan</span>
                  <span>11. Jam Kunjungan</span>
                  <span>12. Alamat</span>
                  <span>13. Wilayah</span>
                  <span>14. Catatan Kebutuhan</span>
                  <span>15. Estimasi Tarif</span>
                  <span>16. Status Booking</span>
                  <span>17. Catatan Admin</span>
                  <span>18. Waktu Konfirmasi</span>
                  <span>19. Waktu Pembaruan</span>
                </div>
              </div>

              {/* Sheet 2: Layanan */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Sheet 2: Layanan (10 Kolom)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">Master Layanan</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono text-slate-600">
                  <span>1. ID Layanan</span>
                  <span>2. Nama Layanan</span>
                  <span>3. Kategori</span>
                  <span>4. Deskripsi</span>
                  <span>5. Cakupan Layanan</span>
                  <span>6. Durasi Estimasi</span>
                  <span>7. Tarif</span>
                  <span>8. Persyaratan</span>
                  <span>9. Wilayah Layanan</span>
                  <span>10. Status Aktif</span>
                </div>
              </div>

              {/* Sheet 3: Pengaturan */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Sheet 3: Pengaturan (Key-Value)</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-mono">Konfigurasi</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Kolom: <code>Kunci</code>, <code>Nilai</code>, <code>Keterangan</code>. Berisi nama usaha, nomor WhatsApp admin, jam operasional, wilayah, dan pesan konfirmasi.
                </p>
              </div>

              {/* Sheet 4: Jadwal */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Sheet 4: Jadwal (8 Kolom)</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">Kapasitas Slot</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono text-slate-600">
                  <span>1. ID Jadwal</span>
                  <span>2. Tanggal</span>
                  <span>3. Jam Mulai</span>
                  <span>4. Jam Selesai</span>
                  <span>5. Jenis Layanan</span>
                  <span>6. Kapasitas</span>
                  <span>7. Booking Aktif</span>
                  <span>8. Ketersediaan</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STEP-BY-STEP DEPLOYMENT GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
                <span className="font-bold text-sky-900 block mb-1">Ikuti 5 Langkah Mudah:</span>
                <p className="text-sky-800">
                  Anda hanya perlu waktu sekitar 3 menit untuk menyiapkan spreadsheet ini.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">Buat File Spreadsheet Baru</h5>
                    <p className="text-slate-600">
                      Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-sky-600 underline font-medium">sheets.new</a> di browser dan beri nama: <strong>Database Home Care Online</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">Buka Menu Apps Script</h5>
                    <p className="text-slate-600">
                      Di Google Sheets, klik menu <strong>Extensions (Ekstensi)</strong> &gt; <strong>Apps Script</strong>. Hapus isi file bawaan dan tempel kode dari tab <em>Kode Script (Code.gs)</em>. Tekan Simpan (Ctrl+S).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">Jalankan Fungsi Inisialisasi Database</h5>
                    <p className="text-slate-600">
                      Pilih fungsi <code>setupDatabase</code> di dropdown atas, lalu klik tombol <strong>Run (Jalankan)</strong>. Berikan izin otorisasi Google. Dalam sekejap, 4 sheet lengkap beserta data awal telah otomatis dibuat di spreadsheet Anda!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    4
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">Deploy sebagai Web App</h5>
                    <p className="text-slate-600">
                      Klik <strong>Deploy</strong> &gt; <strong>New deployment</strong> &gt; Pilih jenis <strong>Web app</strong>. Konfigurasikan:
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
                      <li><strong>Execute as:</strong> Me (email Anda)</li>
                      <li><strong>Who has access:</strong> <span className="font-bold text-slate-900">Anyone (Siapa saja)</span> <em>(Wajib agar pengunjung website dapat memesan tanpa login)</em></li>
                    </ul>
                    <p className="mt-1 text-slate-600">
                      Klik <strong>Deploy</strong> dan salin Web App URL yang berakhiran <code>/exec</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    5
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">Hubungkan ke Aplikasi Home Care</h5>
                    <p className="text-slate-600">
                      Kembali ke tab <em>1. Hubungkan Web App URL</em> di modal ini, tempelkan URL tersebut, dan klik <strong>Simpan & Uji Koneksi</strong>. Selesai!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VERCEL & NETLIFY DEPLOYMENT GUIDE */}
          {activeTab === 'hosting' && (
            <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                <span className="font-bold text-sky-950 text-sm block mb-1 flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-sky-600" />
                  <span>Panduan Publikasi Website (Hosting Gratis & Cepat)</span>
                </span>
                <p className="text-sky-900/90 text-xs">
                  Aplikasi ini dibangun dengan React (Vite) dan telah dikonfigurasi dengan file <code>vercel.json</code>, <code>netlify.toml</code>, dan <code>public/_redirects</code> sehingga 100% siap di-deploy secara instan ke Vercel maupun Netlify tanpa error 404 pada URL!
                </p>
              </div>

              {/* OPSI 1: VERCEL */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-black text-white font-bold flex items-center justify-center text-xs">
                      ▲
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">Opsi 1: Deploy ke Vercel (Rekomendasi)</h5>
                  </div>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded">
                    Sangat Cepat
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <strong className="text-slate-900 block">Langkah 1: Unggah Proyek ke GitHub</strong>
                    <p className="text-slate-600">
                      Buat repository baru di <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">GitHub</a>, lalu push seluruh folder proyek ini ke repository Anda.
                    </p>
                  </div>

                  <div>
                    <strong className="text-slate-900 block">Langkah 2: Hubungkan Repository ke Vercel</strong>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                      <li>Buka <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-sky-600 underline font-semibold">vercel.com</a> dan login menggunakan akun GitHub Anda.</li>
                      <li>Klik tombol <strong>Add New...</strong> &gt; <strong>Project</strong>.</li>
                      <li>Pilih repository GitHub proyek Home Care Anda lalu klik <strong>Import</strong>.</li>
                    </ol>
                  </div>

                  <div>
                    <strong className="text-slate-900 block">Langkah 3: Konfigurasi Build & Deploy</strong>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                      <div><strong>Framework Preset:</strong> <code>Vite</code></div>
                      <div><strong>Build Command:</strong> <code>npm run build</code></div>
                      <div><strong>Output Directory:</strong> <code>dist</code></div>
                      <div><strong>Install Command:</strong> <code>npm install</code></div>
                    </div>
                  </div>

                  <div>
                    <strong className="text-slate-900 block">Langkah 4: Klik Deploy</strong>
                    <p className="text-slate-600">
                      Klik tombol <strong>Deploy</strong>. Dalam waktu ±1 menit, website Anda sudah live di URL resmi Anda (misal: <code>https://homecare-online.vercel.app</code>) dengan sertifikat SSL HTTPS gratis!
                    </p>
                  </div>
                </div>
              </div>

              {/* OPSI 2: NETLIFY */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                      ◆
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">Opsi 2: Deploy ke Netlify</h5>
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded">
                    Drag & Drop / Git
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <strong className="text-slate-900 block">Metode A: Melalui GitHub (Continuous Deployment)</strong>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                      <li>Buka <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-teal-700 underline font-semibold">netlify.com</a> &gt; klik <strong>Add new site</strong> &gt; <strong>Import an existing project</strong>.</li>
                      <li>Pilih GitHub dan pilih repository proyek Anda.</li>
                      <li>File <code>netlify.toml</code> yang sudah kami sediakan akan otomatis mendeteksi:
                        <ul className="list-disc pl-4 mt-1">
                          <li>Build command: <code>npm run build</code></li>
                          <li>Publish directory: <code>dist</code></li>
                        </ul>
                      </li>
                      <li>Klik <strong>Deploy site</strong>.</li>
                    </ol>
                  </div>

                  <div>
                    <strong className="text-slate-900 block">Metode B: Manual Drag & Drop Folder 'dist'</strong>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                      <li>Jalankan perintah <code>npm run build</code> di terminal komputer Anda untuk menghasilkan folder <code>dist</code>.</li>
                      <li>Buka <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-teal-700 underline font-semibold">app.netlify.com/drop</a>.</li>
                      <li>Tarik dan lepas (*drag and drop*) folder <code>dist</code> tersebut langsung ke browser. Website langsung online seketika!</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* TIPS DOMAIN KUSTOM */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
                <strong className="text-slate-900 block mb-1">Tips Domain Kustom (.com / .id / .co.id):</strong>
                Baik Vercel maupun Netlify memungkinkan Anda memasang domain sendiri (misal: <code>www.homecaresehat.id</code>) secara gratis melalui menu <strong>Domain Management</strong> dengan mengarahkan CNAME / DNS.
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Aman & terenkripsi melalui infrastruktur resmi Google Apps Script.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
