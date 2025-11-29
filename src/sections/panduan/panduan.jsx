import React, { useState } from 'react';

// Import komponen internal
import Sidebar from './Sidebar';
import CaraMendaftar from './content/CaraMendaftar';
import KriteriaUmum from './content/KriteriaUmum';
import MembuatCVMenarik from './content/MembuatCvMenarik';
import EtikaMagang from './content/EtikaMagang';

const Panduan = () => {
  // State untuk mengatur tab/halaman aktif di sidebar
  const [activeTab, setActiveTab] = useState('cara-mendaftar');

  // Fungsi untuk merender konten berdasarkan tab yang dipilih
  const renderContent = () => {
    switch (activeTab) {
      case 'cara-mendaftar':
        return <CaraMendaftar />;
      case 'kriteria-umum':
        return <KriteriaUmum />;
      case 'membuat-cv':
        return <MembuatCVMenarik />;
      case 'etika-magang':
        return <EtikaMagang />;
      default:
        return <CaraMendaftar />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Hero/Header Section */}
      <div className="relative w-full h-64 bg-gray-800 overflow-hidden">
        {/* Ganti src gambar background header sesuai aset asli */}
        <img
            src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
            className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 flex items-center px-4 md:px-20">
          <h1 className="text-5xl font-bold text-white">Panduan</h1>
        </div>
      </div>

      {/* Main Content Section */}
      <main className="flex-grow container mx-auto px-4 md:px-16 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Section (Lebar sekitar 3/12) */}
          <div className="w-full md:w-1/4">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Content Section (Lebar sekitar 9/12) */}
          <div className="w-full md:w-3/4">
            {renderContent()}
          </div>
          
        </div>
      </main>

    </div>
  );
};

export default Panduan;