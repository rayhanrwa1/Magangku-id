import React, { useState } from 'react';

export default function NavbarLogin() {
  // State untuk mengatur visibilitas dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between py-6 px-10 bg-white relative z-50">
      {/* Logo */}
      <img src="/img/logo.png" alt="Logo" className="w-40 h-auto" />
      
      {/* Menu Navigasi */}
      <ul className="flex gap-9 text-[#8E8E93]">
        <li className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F] transition-colors">Beranda</li>
        <li className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F] transition-colors">Lowongan</li>
      </ul>

      {/* Bagian Profil & Dropdown */}
      <div className="relative">
        {/* Tombol Profil (Trigger) */}
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-transparent hover:border-[#446ED7] focus:outline-none transition-all"
        >
          {/* Ganti src dengan foto profil user */}
          <img 
            src="/img/default-profile.png" 
            alt="Profil" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback jika gambar tidak ada (menampilkan placeholder warna)
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-[#446ED7]');
            }} 
          />
        </button>

        {/* Menu Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">
            {/* Menu Item: Profil */}
            <a 
              href="/profil" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#446ED7] font-poppins"
            >
              Profil
            </a>
            
            {/* Divider Tipis */}
            <div className="border-t border-gray-300 my-1"></div>
            
            {/* Menu Item: Logout */}
            <button 
              onClick={() => {
                console.log("Logout clicked");
                // Tambahkan logika logout di sini
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-poppins"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}