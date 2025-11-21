import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../../../src/database/firebase";
import { ref, get } from "firebase/database";
import { db } from "../../../../src/database/firebase";
import { showToastTopRight } from "../../../../src/utils/alertUtils";

// ============================
// Error Parser
// ============================
const parseFirebaseError = (err) => {
  const errorMessages = {
    "auth/user-not-found": "Email tidak terdaftar",
    "auth/wrong-password": "Password salah",
    "auth/invalid-email": "Format email tidak valid",
    "auth/user-disabled": "Akun telah dinonaktifkan",
    "auth/invalid-credential": "Email atau password salah",
    "auth/too-many-requests":
      "Terlalu banyak percobaan login, silakan coba beberapa saat lagi",
    "auth/account-exists-with-different-credential":
      "Akun sudah terdaftar dengan metode login berbeda",
    "auth/operation-not-allowed": "Operasi login tidak tersedia",
    "auth/network-request-failed":
      "Gagal terhubung ke server, periksa koneksi Anda",
  };

  return errorMessages[err.code] || "Terjadi kesalahan saat login";
};

// ============================
// Verifikasi User
// ============================
const verifyUserStatus = (user) => {
  if (!user) {
    return { ok: false, type: "error", msg: "Data pengguna tidak ditemukan" };
  }

  if (user.verified === false) {
    return {
      ok: false,
      type: "warning",
      msg: "Akun Anda masih menunggu verifikasi admin. Mohon tunggu persetujuan.",
    };
  }

  if (user.userable_type !== "mitra") {
    return {
      ok: false,
      type: "warning",
      msg: "Tipe akun tidak sesuai. Hubungi admin.",
    };
  }

  return { ok: true, type: "success", msg: "Login berhasil" };
};

const Login = () => {
  const navigate = useNavigate();

  // ============================
  // STATE
  // ============================
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false); // <— INGAT SAYA
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const lottieRef = useRef(null);

  // ============================
  // CEK JIKA USER MASIH LOGIN
  // ============================
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) navigate("/home");
      setCheckingAuth(false);
    });
    return () => unsub();
  }, [navigate]);

  // ============================
  // LOAD LOTTIE
  // ============================
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  // ============================
  // LOAD FONT
  // ============================
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // ============================
  // VALIDASI
  // ============================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email harus diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format email tidak valid";

    if (!formData.password) newErrors.password = "Password harus diisi";
    else if (formData.password.length < 6)
      newErrors.password = "Password minimal 6 karakter";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================
  // HANDLE INPUT
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ============================
  // SUBMIT LOGIN + REMEMBER ME
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // ========================================================
      // SET PERSISTENCE SESUAI CENTANG "INGAT SAYA"
      // ========================================================
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      // LOGIN FIREBASE
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;
      const snapshot = await get(ref(db, `users/${uid}`));
      const result = verifyUserStatus(snapshot.val());

      showToastTopRight(result.type, result.msg);

      if (!result.ok) {
        await auth.signOut();
        setIsLoading(false);
        return;
      }

      setTimeout(() => navigate("/home"), 300);
    } catch (err) {
      const msg = parseFirebaseError(err);
      showToastTopRight("error", msg);
    }

    setIsLoading(false);
  };

  // ============================
  // RETURN UI
  // ============================
  return checkingAuth ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-7 h-7 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-xl">
            <dotlottie-player
              ref={lottieRef}
              src="/lottie/Login.lottie"
              background="transparent"
              speed="1"
              style={{ width: "100%", height: "550px" }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold text-gray-900">Masuk</h1>
                <p className="text-gray-500 text-lg">
                  Silakan login ke akun Anda
                </p>
              </div>

              <div className="space-y-6">
                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full pl-12 pr-4 py-3 text-base rounded-lg border ${
                        errors.email
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-300 focus:border-gray-400 focus:ring-gray-100"
                      } focus:outline-none focus:ring-4 transition-all`}
                      placeholder="nama@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm flex gap-1 items-center mt-1">
                      <AlertCircle className="w-4 h-4" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full pl-12 pr-14 py-3 text-base rounded-lg border ${
                        errors.password
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-300 focus:border-gray-400 focus:ring-gray-100"
                      } focus:outline-none focus:ring-4 transition-all`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-red-600 text-sm flex gap-1 items-center mt-1">
                      <AlertCircle className="w-4 h-4" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* INGAT SAYA */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                      disabled={isLoading}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Ingat saya
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/lupapassword")}
                    disabled={isLoading}
                    className="text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Lupa password?
                  </button>
                </div>

                {/* BUTTON */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-gray-900 text-white text-base font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Memproses...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-center text-base text-gray-600">
                  Belum punya akun?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    disabled={isLoading}
                    className="text-gray-900 font-semibold hover:underline transition-colors"
                  >
                    Daftar Mitra Sekarang
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
