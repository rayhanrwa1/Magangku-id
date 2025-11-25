import React, { useState } from 'react';
// Import FormPendidikan yang sudah dibuat
import FormPendidikan from './FormPendidikan';

export default function FormDataAkademik({ onBack }) {
  // State untuk menentukan view mana yang aktif
  // null = Tampilan list utama
  // 'pendidikan' = Tampilan form input pendidikan
  const [activeForm, setActiveForm] = useState(null);

  // Logic: Jika activeForm ada isinya, tampilkan Form yang sesuai
  if (activeForm === 'pendidikan') {
    return (
      <FormPendidikan 
        onCancel={() => setActiveForm(null)} // Kembali ke list saat Batal
        onSave={() => {
          setActiveForm(null);
          // Tambahkan logic refresh data disini jika sudah ada API
          alert("Data Pendidikan berhasil disimpan!"); 
        }} 
      />
    );
  }

  // Default View: List Data Akademik
  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto mt-10 px-6 py-10 bg-white shadow-sm rounded-3xl border">
        <h2 className="text-lg font-semibold">Data Akademik</h2>
        <p className="text-gray-600 mt-1">
          Pastikan informasi akademik terisi dengan benar untuk mempermudah proses pendaftaran
        </p>

        {/* Section Pendidikan */}
        <div className="mt-8">
          <h3 className="font-medium">Pendidikan</h3>
          <button 
            onClick={() => setActiveForm('pendidikan')} // Trigger ubah state
            className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">+</span> Tambahkan Data
          </button>
        </div>

        {/* Section Lisensi & Sertifikat */}
        <div className="mt-8">
          <h3 className="font-medium">Lisensi & Sertifikat</h3>
          <button 
            // onClick={() => setActiveForm('sertifikat')} // Nanti bisa ditambahkan
            className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">+</span> Tambahkan Data
          </button>
        </div>

        {/* Section Penghargaan */}
        <div className="mt-8">
          <h3 className="font-medium">Penghargaan</h3>
          <button 
            // onClick={() => setActiveForm('penghargaan')} // Nanti bisa ditambahkan
            className="flex items-center gap-2 mt-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">+</span> Tambahkan Data
          </button>
        </div>

        {/* Buttons Global (Keluar dari Data Akademik) */}
        <div className="flex justify-end gap-4 mt-12">
          <button
            onClick={onBack}
            className="px-6 py-1.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
          >
            Batal
          </button>

          <button className="px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}