import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../../../../src/database/firebase";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    userable_type: "mitra",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const lottieRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userId = userCredential.user.uid;

      await set(ref(db, `users/${userId}`), {
        id: userId,
        email: formData.email,
        password: formData.password,
        userable_id: userId,
        userable_type: formData.userable_type,
        verified: false,
        created_at: new Date().toISOString(),
      });

      setSuccessMessage("Registrasi berhasil! Silakan login.");
      setFormData({
        email: "",
        password: "",
        confirm_password: "",
        userable_type: "mitra",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      let errorMessage = "Terjadi kesalahan saat registrasi";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email sudah terdaftar!";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid!";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah!";
      }

      setErrors({ submit: errorMessage });
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
        {/* Left Side - Lottie Animation */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-xl">
            <dotlottie-player
              ref={lottieRef}
              src="/lottie/LaptopWorking.lottie"
              background="transparent"
              speed="1"
              style={{ width: "100%", height: "550px" }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold text-gray-900">
                  Daftar Mitra
                </h1>
                <p className="text-gray-500 text-lg">
                  Bergabunglah dengan ribuan mitra kami
                </p>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
              )}

              <div className="space-y-5">
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
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 text-base rounded-lg border ${
                        errors.email
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-300 focus:border-gray-400 focus:ring-gray-100"
                      } focus:outline-none focus:ring-4 transition-all bg-white text-gray-900 placeholder-gray-400`}
                      placeholder="nama@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm flex gap-1 items-center mt-1">
                      <AlertCircle className="w-4 h-4" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                      className={`w-full pl-12 pr-14 py-3 text-base rounded-lg border ${
                        errors.password
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-300 focus:border-gray-400 focus:ring-gray-100"
                      } focus:outline-none focus:ring-4 transition-all bg-white text-gray-900 placeholder-gray-400`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-14 py-3 text-base rounded-lg border ${
                        errors.confirm_password
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-300 focus:border-gray-400 focus:ring-gray-100"
                      } focus:outline-none focus:ring-4 transition-all bg-white text-gray-900 placeholder-gray-400`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-600 text-sm flex gap-1 items-center mt-1">
                      <AlertCircle className="w-4 h-4" />{" "}
                      {errors.confirm_password}
                    </p>
                  )}
                </div>

                {/* Tipe Pengguna */}
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">
                    Tipe Pengguna
                  </label>

                  {/* Value yang dikirim ke backend */}
                  <input type="hidden" name="userable_type" value="mitra" />

                  {/* Field tampilan saja */}
                  <input
                    type="text"
                    value="Mitra"
                    disabled
                    className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 
               focus:border-gray-400 focus:ring-4 focus:ring-gray-100 
               focus:outline-none transition-all bg-white text-gray-900"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-gray-900 text-white text-base font-semibold hover:bg-gray-800 active:bg-gray-950 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Mendaftar...
                    </span>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>
              </div>

              {/* Sign In */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-center text-base text-gray-600">
                  Sudah punya akun?{" "}
                  <button
                    onClick={() => navigate("/")}
                    className="text-gray-900 font-semibold hover:underline transition-colors"
                  >
                    Masuk di sini
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

export default Register;
