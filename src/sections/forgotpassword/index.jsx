import React, { useState } from "react";
import { Alert } from "../../utils/usealert_utils.jsx";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordSection({ navigate }) {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      Alert.warning("Email harus diisi!", { title: "Form Belum Lengkap" });
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      Alert.success("Link reset password dikirim! Silakan cek email kamu.", {
        title: "Berhasil!",
        duration: 3000,
      });

      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      Alert.error(error.message, {
        title: "Gagal Mengirim Email",
      });
    }
  }

  return (
    <>
      {/* Gambar */}
      <div className="w-full md:w-1/2 flex justify-center max-w-md">
        <img
          src="/img/HalamanLogin.png"
          alt="Forgot Password"
          className="rounded-2xl object-cover w-full h-[220px] md:h-[450px] shadow-xl"
        />
      </div>

      {/* Card Form */}
      <div className="w-full md:w-1/2 max-w-lg bg-white rounded-2xl shadow-2xl px-6 md:px-12 py-8 md:py-12">
        {/* Back Button */}
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
          Lupa Password?
        </h2>
        <p className="text-gray-500 mb-6">
          Masukkan email kamu untuk reset password
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 font-semibold text-sm">
            Email
          </label>

          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-8
            focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />

          <button
            type="submit"
            disabled={!email}
            className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
              email
                ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Kirim Link Reset
          </button>
        </form>

        {/* Link Login */}
        <div className="text-center mt-6 text-base">
          <span className="text-gray-600">Ingat password?</span>{" "}
          <button
            type="button"
            className="text-[#446ED7] font-semibold hover:underline hover:text-[#1EC6FF] transition-colors"
            onClick={() => navigate("/login")}
          >
            Login di sini
          </button>
        </div>
      </div>
    </>
  );
}
