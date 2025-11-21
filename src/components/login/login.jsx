import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const lottieRef = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    // Load dotLottie player dynamically
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      console.log("Login data:", formData);
      alert("Login berhasil! (Demo)");
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Load Poppins font
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
              src="/lottie/init.lottie"
              background="transparent"
              speed="1"
              style={{ width: "100%", height: "550px" }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold text-gray-900">Masuk</h1>
                <p className="text-gray-500 text-lg">
                  Silakan login ke akun Anda
                </p>
              </div>

              <div className="space-y-6">
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

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200 focus:ring-2"
                    />
                    Ingat saya
                  </label>
                  <button className="text-base text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Lupa password?
                  </button>
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
                      Memproses...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </div>

              {/* Sign Up */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-center text-base text-gray-600">
                  Belum punya akun?{" "}
                  <button className="text-gray-900 font-semibold hover:underline">
                    Daftar
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
