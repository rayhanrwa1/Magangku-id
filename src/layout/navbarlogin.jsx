import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../database/firebase";

export default function NavbarLogin({ user, userData }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    const confirmLogout = window.confirm("Yakin ingin logout?");
    if (!confirmLogout) return;

    try {
      await signOut(auth);       
      navigate("/");              
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Logout gagal. Coba lagi.");
    }
  }

  return (
    <nav className="w-full flex items-center justify-between py-6 px-10 bg-white relative z-50">
      <img src="/img/logo.png" alt="Logo" className="w-40 h-auto" />

      <ul className="flex gap-9 text-[#8E8E93]">
        <li className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F] transition-colors">
          Beranda
        </li>
        <li className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F] transition-colors">
          Lowongan
        </li>
      </ul>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent hover:border-[#446ED7] focus:outline-none transition-all p-0 bg-transparent flex items-center justify-center"
        >
          <img
            src="/img/avataricon.svg"
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">
            {userData?.nama && (
              <p className="px-4 pb-2 text-xs text-gray-500">
                {userData.nama}
              </p>
            )}

            <a
              href="/profil"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#446ED7] font-poppins"
            >
              Profil
            </a>

            <div className="border-t border-gray-300 my-1" />

            <button
              onClick={handleLogout}
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
