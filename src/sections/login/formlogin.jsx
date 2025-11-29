import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Alert } from "../../utils/usealert_utils.jsx";

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = form.email && form.password;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const auth = getAuth();

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      if (!result.user.emailVerified) {
        Alert.warning("Silakan verifikasi email terlebih dahulu!", {
          title: "Email Belum Diverifikasi",
          duration: 3500,
        });
        await signOut(auth);
        return;
      }

      Alert.success("Berhasil login", {
        title: "Selamat Datang!",
        duration: 2000,
      });

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      Alert.error(error.message.replace("Firebase:", "").trim(), {
        title: "Login Gagal",
      });
    }
  }

  return (
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
        Selamat Datang
      </h2>
      <p className="text-gray-500 mb-6">Masuk ke akun Anda</p>

      <form onSubmit={handleSubmit}>
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

        {/* Password + eye icon */}
        <div className="mb-2">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-11 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                // Icon eye-off
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.5 0-8.307-2.943-9.75-7 0-1.05.228-2.052.64-2.964M6.228 6.228A9.956 9.956 0 0112 5c4.5 0 8.307 2.943 9.75 7-.42 1.218-1.057 2.332-1.868 3.287M3 3l18 18"
                  />
                </svg>
              ) : (
                // Icon eye
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-end mt-2">
            <a
              href="/lupapassword"
              className="text-sm text-[#2563EB] hover:underline font-medium"
            >
              Lupa password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full mt-6 rounded-xl py-3 font-semibold transition-all duration-300 ${
            isFormValid
              ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Masuk
        </button>
      </form>

      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="px-4 text-gray-400 text-sm font-medium">Atau</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <div className="text-center text-base">
        <span className="text-gray-600">Baru di Magangku?</span>{" "}
        <button
          type="button"
          className="text-[#2563EB] font-semibold hover:underline hover:text-[#1D4ED8] transition-colors"
          onClick={() => navigate("../register")}
        >
          Daftar disini
        </button>
      </div>
    </div>
  );
}
