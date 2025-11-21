import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db, auth } from "../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "../../layout/navbar/navbar";
import Sidebar from "../../layout/sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import { InfoCircle } from "iconsax-react";

function Home() {
  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      // --- Ambil data user ---
      const userSnap = await get(ref(db, `users/${user.uid}`));
      if (userSnap.exists()) {
        setUserData(userSnap.val());
      }

      // --- Cek folder mitra ---
      const mitraSnap = await get(ref(db, `mitra/${user.uid}`));
      if (mitraSnap.exists()) {
        setMitraData(mitraSnap.val());
      } else {
        setMitraData(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleToggleSidebar = () => console.log("toggle sidebar mobile");
  const handleLogout = () => console.log("logout diklik");

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden md:block">
        <Sidebar activeKey="dashboard" />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar
          mitraName={mitraData?.name || "Nama Perusahaan Belum Diisi"}
          mitraEmail={userData?.email || "Memuat..."}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
        />

        <main className="p-4 space-y-4">
          {!mitraData && !loading && (
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              {/* Kiri: Icon + Text */}
              <div className="flex items-start gap-3">
                <InfoCircle size="24" color="#b91c1c" variant="Bulk" />

                <div>
                  <p className="text-red-800 font-medium">
                    Profil Mitra Belum Dibuat
                  </p>
                  <p className="text-red-700 text-sm">
                    Silakan lengkapi{" "}
                    <span className="font-semibold">Profile Mitra</span>
                    untuk melanjutkan proses verifikasi dan menggunakan
                    dashboard.
                  </p>
                </div>
              </div>

              {/* Kanan: Tombol */}
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Lengkapi Data
              </button>
            </div>
          )}

          {/* =================== */}
          {/* ALERT: Belum diverifikasi */}
          {/* =================== */}
          {userData?.verified === false && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <InfoCircle size="24" color="#b7791f" variant="Bulk" />
              <div>
                <p className="text-yellow-800 font-medium">
                  Akun Anda belum diverifikasi
                </p>
                <p className="text-yellow-700 text-sm">
                  Tunggu persetujuan admin atau lengkapi Profile Mitra jika
                  belum lengkap.
                </p>
              </div>
            </div>
          )}

          <p className="text-slate-700">Area konten untuk preview.</p>
        </main>
      </div>
    </div>
  );
}

export default Home;
