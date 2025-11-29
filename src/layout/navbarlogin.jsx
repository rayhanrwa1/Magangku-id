import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../database/firebase";
import { Alert } from "../utils/usealert_utils.jsx";

export default function NavbarLogin({ user, userData }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  async function handleConfirmLogout() {
    try {
      await signOut(auth);
      navigate("/");
      await signOut(auth);

      Alert.success("Kamu berhasil logout.", {
        title: "Logout",
        duration: 4000,
      });

      setShowLogoutDialog(false);
      navigate("/"); // beranda
    } catch (error) {
      console.error("Gagal logout:", error);
      Alert.error("Logout gagal. Coba lagi.", {
        title: "Error",
      });
    }
  }

  return (
    <>
      <nav className="w-full flex items-center justify-between py-6 px-10 bg-white relative z-50">
        {/* Logo klik ke beranda tanpa reload */}
        <img
          src="/img/logo.png"
          alt="Logo"
          className="w-40 h-auto cursor-pointer"
          onClick={() => navigate("/")}
        />

        <ul className="flex gap-9 text-[#8E8E93]">
          <li
            onClick={() => navigate("/")}
            className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F] transition-colors"
          >
            Beranda
          </li>
          <li
            onClick={() => navigate("/lowongan")}
            className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F] transition-colors"
          >
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

              {/* Profil pakai navigate, bukan href */}
              <button
                onClick={() => {
                  navigate("/profil");
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#446ED7] font-poppins"
              >
                Profil
              </button>

              <div className="border-t border-gray-300 my-1" />

              <button
                onClick={() => {
                  setShowLogoutDialog(true);
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-poppins"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {showLogoutDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Konfirmasi Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Apakah anda ingin Logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
