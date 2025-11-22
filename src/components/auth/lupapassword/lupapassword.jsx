import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../src/database/firebase";
import { showToastTopRight } from "../../../../src/utils/alertUtils";
import { ref, get } from "firebase/database";
import { db } from "../../../../src/database/firebase";

const LupaPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => document.head.removeChild(link);
  }, []);

  const validateForm = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToastTopRight("error", "Format email tidak valid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const cleanedEmail = email.trim().toLowerCase();

      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: false,
      };

      // Kirim email reset password
      await sendPasswordResetEmail(auth, cleanedEmail, actionCodeSettings);

      showToastTopRight(
        "success",
        `Link reset password sudah dikirim ke ${cleanedEmail}.`
      );
    } catch (err) {
      console.error("RESET ERROR:", err);

      let errorMessage = "Gagal mengirim link reset password.";

      if (err.code === "auth/user-not-found") {
        errorMessage = "Email tidak terdaftar.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      } else if (err.code === "auth/missing-email") {
        errorMessage = "Email wajib diisi.";
      } else if (
        err.code === "auth/missing-continue-uri" ||
        err.code === "auth/invalid-continue-uri"
      ) {
        errorMessage =
          "Konfigurasi Auth belum benar. Tambahkan domain ke Authorized Domains.";
      }

      showToastTopRight("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left - Lottie */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-xl">
            <dotlottie-player
              ref={lottieRef}
              src="/lottie/DATASECURITY.lottie"
              background="transparent"
              speed="1"
              style={{ width: "100%", height: "550px" }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>

        {/* Right - Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold text-gray-900">
                  Lupa Password
                </h1>
                <p className="text-gray-500 text-lg">
                  Masukkan email akun kamu untuk menerima link reset password.
                </p>
              </div>

              {/* FORM */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
                        w-full pl-12 pr-4 py-3 text-base rounded-lg border 
                        border-gray-300 focus:border-gray-400 
                        focus:ring-gray-100 focus:ring-4 transition-all
                        bg-white text-gray-900 placeholder-gray-400
                      "
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full py-3 rounded-lg bg-gray-900 text-white text-base 
                    font-semibold hover:bg-gray-800 active:bg-gray-950 
                    transition-colors shadow-sm 
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Mengirim...
                    </span>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </button>
              </form>

              {/* Back */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="
                    flex items-center justify-center gap-2 
                    text-base text-gray-600 hover:text-gray-900 
                    font-medium transition-colors w-full
                  "
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke halaman login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;
