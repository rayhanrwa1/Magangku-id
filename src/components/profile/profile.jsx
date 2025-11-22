import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db, auth } from "../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../../layout/navbar/navbar";
import Sidebar from "../../layout/sidebar/sidebar";
import {
  Building,
  Location,
  Call,
  Camera,
  TickCircle,
  Edit,
  InfoCircle,
} from "iconsax-react";

const NAVY = "#102C57";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const userSnap = await get(ref(db, `users/${user.uid}`));
      if (userSnap.exists()) setUserData(userSnap.val());

      const mitraSnap = await get(ref(db, `mitra/${user.uid}`));
      if (mitraSnap.exists()) {
        setMitraData(mitraSnap.val());
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleCreateOrEdit = () => {
    window.location.href = "/createprofile";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Jika belum ada data mitra
  if (!mitraData) {
    return (
      <div className="min-h-screen flex bg-slate-50">
        <div className="hidden md:block">
          <Sidebar activeKey="profile" />
        </div>

        <div className="flex-1 flex flex-col">
          <Navbar
            mitraName="Nama Perusahaan Belum Diisi"
            mitraEmail={userData?.email || "Memuat..."}
          />

          <main className="p-4 md:p-6 flex-1 flex items-center justify-center">
            <div className="max-w-md w-full text-center space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Building size="40" color={NAVY} variant="Bold" />
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Profil Belum Dibuat
                </h2>
                <p className="text-slate-600 text-sm mb-6">
                  Anda belum memiliki profil mitra. Silakan buat profil terlebih
                  dahulu untuk dapat menggunakan layanan kami.
                </p>

                <button
                  onClick={handleCreateOrEdit}
                  className="w-full px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Buat Profil Sekarang
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Tampilan profil
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden md:block">
        <Sidebar activeKey="profile" />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar
          mitraName={mitraData?.name || "Nama Perusahaan"}
          mitraEmail={userData?.email || "Memuat..."}
        />

        <main className="p-4 md:p-6 space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Profil Mitra
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Informasi lengkap tentang mitra Anda
              </p>
            </div>

            <div className="flex items-center gap-3">
              {mitraData?.verified && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <TickCircle size="20" color="#22c55e" variant="Bold" />
                  <span className="text-green-700 font-medium text-sm">
                    Terverifikasi
                  </span>
                </div>
              )}

              <button
                onClick={handleCreateOrEdit}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Edit size="18" color="white" />
                <span className="font-medium">Edit Profil</span>
              </button>
            </div>
          </div>

          {/* PHOTO & NAME CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-6 flex-wrap">
              {mitraData.photo ? (
                <div className="w-32 h-32 border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                  <img
                    src={mitraData.photo}
                    alt={mitraData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-slate-200 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Camera size="48" color={NAVY} variant="Bulk" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">
                  {mitraData.name}
                </h2>
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                  {mitraData.vendor_type === "company"
                    ? "Perusahaan"
                    : "Pemerintah"}
                </div>
                <p className="text-slate-600 leading-relaxed mt-3">
                  {mitraData.description}
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Call size="24" color={NAVY} variant="Bold" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">
                Informasi Kontak
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Nomor Telepon</p>
                <p className="text-slate-800 font-medium">
                  {mitraData.phone_number}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <p className="text-slate-800 font-medium">
                  {userData?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* ADDRESS INFO */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Location size="24" color={NAVY} variant="Bold" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Alamat</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Kota</p>
                <p className="text-slate-800 font-medium">{mitraData.city}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Provinsi</p>
                <p className="text-slate-800 font-medium">{mitraData.state}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Negara</p>
                <p className="text-slate-800 font-medium">
                  {mitraData.country}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Alamat Lengkap</p>
              <p className="text-slate-800 leading-relaxed">
                {mitraData.address}
              </p>
            </div>
          </div>

          {/* STATUS INFO */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-50 rounded-lg">
                <InfoCircle size="24" color={NAVY} variant="Bold" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">
                Status Akun
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Status Verifikasi</p>
                <div className="flex items-center gap-2">
                  {mitraData.verified ? (
                    <>
                      <TickCircle size="20" color="#22c55e" variant="Bold" />
                      <span className="text-green-700 font-medium">
                        Terverifikasi
                      </span>
                    </>
                  ) : (
                    <>
                      <InfoCircle size="20" color="#eab308" variant="Bold" />
                      <span className="text-yellow-700 font-medium">
                        Menunggu Verifikasi
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">
                  Status Ketersediaan
                </p>
                <div className="flex items-center gap-2">
                  {mitraData.is_available ? (
                    <>
                      <TickCircle size="20" color="#22c55e" variant="Bold" />
                      <span className="text-green-700 font-medium">
                        Tersedia
                      </span>
                    </>
                  ) : (
                    <>
                      <InfoCircle size="20" color="#64748b" variant="Bold" />
                      <span className="text-slate-700 font-medium">
                        Tidak Tersedia
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
