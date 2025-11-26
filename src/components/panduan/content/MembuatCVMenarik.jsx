import React from 'react';

const MembuatCVMenarik = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100 min-h-[500px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">3 Pilar CV Sukses </h2>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Struktur & Format CV ATS</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-1">
          <li>Gunakan desain sederhana dan bersih.</li>
          <li>Maks. 2 halaman. Prioritaskan informasi terbaru dan paling penting.</li>
          <li>Hindari grafis berlebihan. Pastikan CV dapat dibaca oleh sistem screening otomatis (ATS).</li>
        </ol>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Relevansi & Kata kunci</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-1">
          <li>Selalu sesuaikan ringkasan dan keahlian anda agar cocok dengan posisi yang dilamar.</li>
          <li>Masukkan istilah teknis dari deskripsi lowongan.</li>
          <li>Cantumkan Lini ke LinkedIn/GitHub yang aktif dan relevan.</li>
        </ol>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Tunjukkan Dampak (Bukan sekedar tugas)</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-1">
          <li>Gunakan angka untuk mengukur pencapaian Anda. Contoh: "Mengurangi bug sebesar 20% di modul checkout."</li>
          <li>Mulai deskripsi pengalaman Anda dengan kata kerja kuat.</li>
          <li>Kelompokkan Hardskill (Teknis) dan Softskill (Komunikasi, Detail) dengan jelas.</li>
        </ol>
      </div>
    </div>
  );
};

export default MembuatCVMenarik;