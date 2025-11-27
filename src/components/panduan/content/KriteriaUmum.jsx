import React from 'react';

const KriteriaUmum = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100 min-h-[500px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kriteria Umum</h2>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Kualifikasi umum</h3>
        <p className="text-gray-600">
          Mahasiswa atau <span className="italic">Fresh Graduate</span> setingkat D3, D4, S1, dan S2
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Kualifikasi khusus</h3>
        <p className="text-gray-600">
          Sesuai dengan yang dipersyaratkan pada masing-masing lowongan magang perusahaan
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Dokumen persyaratan</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-1">
          <li>CV</li>
          <li>Resume</li>
          <li>Surat lamaran</li>
        </ol>
      </div>
    </div>
  );
};

export default KriteriaUmum;