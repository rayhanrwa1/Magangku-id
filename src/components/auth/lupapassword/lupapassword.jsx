import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../src/database/firebase';

const LupaPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
    script.type = 'module';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setStatus('');

    try {
      const cleanedEmail = email.trim();

      const actionCodeSettings = {
        // setelah user sukses ganti password di halaman Firebase,
        // dia diarahkan ke halaman ini
        url: `${window.location.origin}/`,
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, cleanedEmail, actionCodeSettings);

      setStatus(
        `Jika ${cleanedEmail} terdaftar, link reset password sudah dikirim ke email.`
      );
    } catch (err) {
      console.error('Error reset password:', err);

      let errorMessage = 'Gagal mengirim link reset password';

      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Email tidak terdaftar';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid';
      } else if (
        err.code === 'auth/missing-continue-uri' ||
        err.code === 'auth/invalid-continue-uri'
      ) {
        errorMessage =
          'Konfigurasi reset password di Firebase belum benar. Cek authDomain dan authorized domains.';
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
              src="/lottie/DATASECURITY.lottie"
              background="transparent"
              speed="1"
              style={{ width: '100%', height: '550px' }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold text-gray-900">
                  Lupa Password
                </h1>
                <p className="text-gray-500 text-lg">
                  Masukkan email akun kamu. Sistem akan mengirim link reset
                  password.
                </p>
              </div>

              {/* Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Status */}
              {status && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700 text-sm">{status}</p>
                </div>
              )}

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
                      className={`w-full pl-12 pr-4 py-3 text-base rounded-lg border ${
                        errors.email
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-gray-300 focus:border-gray-400 focus:ring-gray-100'
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-gray-900 text-white text-base font-semibold hover:bg-gray-800 active:bg-gray-950 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Mengirim...
                    </span>
                  ) : (
                    'Kirim Link Reset'
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 text-base text-gray-600 hover:text-gray-900 font-medium transition-colors w-full"
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
