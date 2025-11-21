import { useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import { db, auth, storage } from "../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Navbar from "../../layout/navbar/navbar";
import Sidebar from "../../layout/sidebar/sidebar";
import {
  InfoCircle,
  Building,
  Location,
  Call,
  Camera,
  TickCircle,
  CloseCircle,
} from "iconsax-react";

const NAVY = "#102C57";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [showAgreement, setShowAgreement] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone_number: "",
    city: "",
    state: "",
    country: "Indonesia",
    address: "",
    vendor_type: "company",
    photo: "",
    verified: false,
    is_available: true,
  });

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
        const data = mitraSnap.val();
        setMitraData(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          phone_number: data.phone_number || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "Indonesia",
          address: data.address || "",
          vendor_type: data.vendor_type || "company",
          photo: data.photo || "",
          verified: data.verified || false,
          is_available:
            data.is_available !== undefined ? data.is_available : true,
        });

        setAgreeTerms(true);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama mitra wajib diisi";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi wajib diisi";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "Nomor telepon wajib diisi";
    if (!formData.city.trim()) newErrors.city = "Kota wajib diisi";
    if (!formData.state.trim()) newErrors.state = "Provinsi wajib diisi";
    if (!formData.country.trim()) newErrors.country = "Negara wajib diisi";
    if (!formData.address.trim())
      newErrors.address = "Alamat lengkap wajib diisi";

    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (formData.phone_number && !phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = "Format nomor telepon tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setPhotoFile(e.target.files[0]);
  };

  const uploadPhoto = async (userId) => {
    if (!photoFile) return formData.photo;

    try {
      setUploadingPhoto(true);
      const fileRef = storageRef(
        storage,
        `mitra_photos/${userId}/${photoFile.name}`
      );
      await uploadBytes(fileRef, photoFile);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (err) {
      console.error("Upload error:", err);
      setErrors({ submit: "Gagal mengunggah foto. Coba lagi." });
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!agreeTerms) {
      setErrors({ submit: "Anda harus menyetujui perjanjian kemitraan." });
      return;
    }

    setSaving(true);
    setSuccessMessage("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const finalPhotoURL = await uploadPhoto(user.uid);
      if (finalPhotoURL === null) return;

      const mitraRef = ref(db, `mitra/${user.uid}`);

      const dataToSave = {
        ...formData,
        photo: finalPhotoURL,
        id: Date.now(),
      };

      await set(mitraRef, dataToSave);

      setSuccessMessage("Data mitra berhasil disimpan!");
      setMitraData(dataToSave);

      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (error) {
      console.error("Error saving mitra data:", error);
      setErrors({ submit: "Gagal menyimpan data. Silakan coba lagi." });
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar activeKey="profile" />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar
          mitraName={mitraData?.name || "Nama Perusahaan Belum Diisi"}
          mitraEmail={userData?.email || "Memuat..."}
        />

        <main className="p-4 md:p-6 space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Profil Mitra
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Lengkapi informasi profil mitra Anda untuk proses verifikasi
              </p>
            </div>

            {mitraData?.verified && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <TickCircle size="20" color={NAVY} variant="Bold" />
                <span className="text-green-700 font-medium text-sm">
                  Terverifikasi
                </span>
              </div>
            )}
          </div>

          {/* SUCCESS */}
          {successMessage && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <TickCircle size="24" color={NAVY} variant="Bold" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          )}

          {/* ERROR */}
          {errors.submit && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <CloseCircle size="24" color={NAVY} variant="Bold" />
              <p className="text-red-800 font-medium">{errors.submit}</p>
            </div>
          )}

          {/* FORM */}
          <div className="space-y-6">
            {/* Informasi Dasar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-lg">
                  <Building size="24" color={NAVY} variant="Bold" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Informasi Dasar
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Mitra *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: PT Mitra Sejahtera"
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.name ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deskripsi *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Jelaskan tentang mitra Anda..."
                    className={`w-full px-4 py-2.5 border rounded-lg resize-none ${
                      errors.description ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipe Vendor *
                  </label>
                  <select
                    name="vendor_type"
                    value={formData.vendor_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  >
                    <option value="company">Perusahaan</option>
                    <option value="gov">Pemerintah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+62 812-3456-7890"
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.phone_number
                        ? "border-red-300"
                        : "border-slate-300"
                    }`}
                  />
                  {errors.phone_number && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-lg">
                  <Location size="24" color={NAVY} variant="Bold" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Alamat</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kota *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Contoh: Jakarta"
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.city ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Contoh: DKI Jakarta"
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.state ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Negara *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Contoh: Indonesia"
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.country ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.country && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Detail alamat lengkap"
                    className={`w-full px-4 py-2.5 border rounded-lg resize-none ${
                      errors.address ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-lg">
                  <Camera size="24" color={NAVY} variant="Bold" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Informasi Tambahan
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Foto / Logo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  />

                  {uploadingPhoto && (
                    <p className="text-blue-600 text-sm mt-2">
                      Mengunggah foto...
                    </p>
                  )}

                  {formData.photo && (
                    <div className="mt-3">
                      <div className="w-32 h-32 border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <img
                          src={formData.photo}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* AGREEMENT INSTEAD OF is_available */}
                <div className="flex items-center gap-1">
                  {/* Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium">
                      Saya menyetujui Perjanjian Kemitraan
                    </span>
                  </label>

                  {/* Link ke modal */}
                  <button
                    type="button"
                    onClick={() => setShowAgreement(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Baca Perjanjian
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => (window.location.href = "/mitra/home")}
                className="px-6 py-2.5 border border-slate-300 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 bg-slate-700 text-white rounded-lg disabled:bg-slate-900 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Profil"
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* AGREEMENT MODAL */}
      {showAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Perjanjian Kemitraan Magang
            </h2>

            <div className="max-h-72 overflow-y-auto pr-2 space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                Perjanjian ini mengatur hubungan antara{" "}
                <strong>Mitra Perusahaan</strong>
                dan platform <strong>Magangku</strong> dalam menyediakan
                lowongan magang bagi mahasiswa. Dengan menjadi mitra, perusahaan
                menyatakan memahami dan bersedia mematuhi ketentuan berikut:
              </p>

              <p>
                <strong>1. Kebenaran Data</strong>
                <br />
                Mitra bertanggung jawab atas kebenaran seluruh informasi yang
                diunggah ke sistem Magangku.
              </p>

              <p>
                <strong>2. Profesionalitas & Pembinaan</strong>
                <br />
                Mitra wajib memberikan lingkungan magang yang aman, edukatif,
                dan sesuai standar profesional.
              </p>

              <p>
                <strong>3. Komunikasi</strong>
                <br />
                Mitra wajib merespons lamaran dan komunikasi dari peserta magang
                maupun sistem Magangku secara wajar.
              </p>

              <p>
                <strong>4. Status Verifikasi</strong>
                <br />
                Admin Magangku berhak menyetujui atau mencabut verifikasi jika
                ditemukan pelanggaran.
              </p>

              <p>
                <strong>5. Privasi & Keamanan</strong>
                <br />
                Mitra wajib menjaga kerahasiaan data peserta magang dan tidak
                menyalahgunakannya untuk tujuan non-profesional.
              </p>

              <p>
                <strong>6. Penghentian Kemitraan</strong>
                <br />
                Magangku berhak menonaktifkan akun mitra jika melanggar
                ketentuan.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5"
              />
              <label className="text-sm text-slate-700">
                Saya telah membaca dan menyetujui perjanjian kemitraan.
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowAgreement(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                Tutup
              </button>
              <button
                onClick={() => setShowAgreement(false)}
                disabled={!agreeTerms}
                className={`px-4 py-2 rounded-lg ${
                  agreeTerms
                    ? "bg-slate-700 text-white"
                    : "bg-slate-400 text-white cursor-not-allowed"
                }`}
              >
                Setuju
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
