import React, { useState } from "react";
import { Alert } from "../../../utils/usealert_utils.jsx";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import { getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const isFormValid =
    form.nama && form.email && form.password && form.konfirmasi;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nama || !form.email || !form.password || !form.konfirmasi) {
      Alert.warning("Semua field harus diisi!", {
        title: "Form Belum Lengkap",
      });
      return;
    }

    if (form.password !== form.konfirmasi) {
      Alert.error("Password tidak sama!", {
        title: "Validasi Gagal",
      });
      return;
    }

    try {
      const auth = getAuth();
      const db = getDatabase(getApp());

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;
      const uid = user.uid;

      await sendEmailVerification(user);

      await set(ref(db, `users/${uid}`), {
        id: uid,
        email: form.email,
        userable_type: "user",
        created_at: new Date().toISOString(),
        verified: false,
      });

      await set(ref(db, `users_profile/${uid}`), {
        users_id: uid,
        nama: form.nama,
      });

      Alert.success("Silakan cek email untuk verifikasi.", {
        title: "Registrasi Berhasil!",
        duration: 3500,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      Alert.error(error.message, {
        title: "Register Gagal!",
      });
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-1 flex-col md:flex-row items-center px-4 md:px-8 justify-center gap-6 md:gap-12 w-full py-8">
          {/* Gambar kiri */}
          <div className="w-full md:w-1/2 flex justify-center max-w-md">
            <img
              src="/img/HalamanLogin.png"
              alt="Register Illustration"
              className="rounded-2xl object-cover w-full h-[220px] md:h-[450px] shadow-xl"
            />
          </div>

          <div className="w-full md:w-1/2 max-w-lg bg-white rounded-2xl shadow-2xl px-6 md:px-12 py-8 md:py-12">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#2563EB] transition-colors mb-6 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Kembali ke Beranda</span>
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Daftar Akun
            </h2>
            <p className="text-gray-500 mb-6">Buat akun baru untuk memulai</p>

            <form onSubmit={handleSubmit}>
              {/* Nama */}
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Nama Lengkap (sesuai KTP)
                </label>
                <input
                  name="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-11 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M6.228 6.228C7.623 5.445 9.297 5 11 5c4.5 0 8.307 2.943 9.75 7-.42 1.22-1.06 2.34-1.87 3.3"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.94 7.523 5 12 5c4.48 0 8.27 2.94 9.54 7-1.27 4.06-5.06 7-9.54 7-4.48 0-8.27-2.94-9.54-7z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="mb-8">
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    name="konfirmasi"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={form.konfirmasi}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-11 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M6.228 6.228C7.623 5.445 9.297 5 11 5c4.5 0 8.307 2.943 9.75 7-.42 1.22-1.06 2.34-1.87 3.3"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.94 7.523 5 12 5c4.48 0 8.27 2.94 9.54 7-1.27 4.06-5.06 7-9.54 7-4.48 0-8.27-2.94-9.54-7z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
                  isFormValid
                    ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Daftar Sekarang
              </button>
            </form>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="px-4 text-gray-400 text-sm font-medium">
                Atau
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="text-center text-base">
              <span className="text-gray-600">Sudah punya akun?</span>{" "}
              <button
                type="button"
                className="text-[#446ED7] font-semibold hover:underline hover:text-[#1EC6FF] transition-colors"
                onClick={() => navigate("/login")}
              >
                Login di sini
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
