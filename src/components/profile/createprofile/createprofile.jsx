import { useEffect, useState, useCallback } from "react";
import { ref, set, get } from "firebase/database";
import { db, auth, storage } from "../../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import Navbar from "../../../layout/navbar/navbar";
import Sidebar from "../../../layout/sidebar/sidebar";
import { Building, Location, Camera, Global } from "iconsax-react";
import Cropper from "react-easy-crop";
import CountrySelect from "./countryselect";

// =======================
// ==== TOAST CONFIG =====
// =======================

const NAVY = "#102C57";

const config = {
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-600",
    iconColor: "#22c55e",
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-600",
    iconColor: "#ef4444",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-600",
    iconColor: "#eab308",
  },
};

const showToastTopRight = (type, message) => {
  const style = config[type] || config.info;
  const toast = document.createElement("div");
  toast.className = `
    fixed right-5 top-5 z-[9999] ${style.bg} ${style.border}
    backdrop-blur-xl border shadow-xl rounded-xl px-4 py-3
    flex items-center gap-3 w-[330px] animate-[slideIn_.25s_ease-out]
  `;

  const msgText = document.createElement("p");
  msgText.className = `${style.text} text-sm flex-1`;
  msgText.textContent = message;

  toast.appendChild(msgText);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-2");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// =======================
// === CROP UTILITIES ====
// =======================

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, cropArea) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas empty"));
          return;
        }
        resolve({ blob, url: URL.createObjectURL(blob) });
      },
      "image/jpeg",
      0.9
    );
  });
};

// =======================
// ===== MAIN COMPONENT ===
// =======================

function CreateProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [imageSrc, setImageSrc] = useState(null); // original image base64 / url
  const [photoFile, setPhotoFile] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);

  const [showCropModal, setShowCropModal] = useState(false);

  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);

  const [showAgreement, setShowAgreement] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

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

  const [socialMedia, setSocialMedia] = useState({
    website: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
  });

  // =======================
  // LOAD FIREBASE DATA
  // =======================

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
        setIsEditMode(true);
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

        if (data.photo) setImageSrc(data.photo);
      }

      const socialSnap = await get(ref(db, `mitra/${user.uid}/socialmedia`));
      if (socialSnap.exists()) setSocialMedia(socialSnap.val());

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // =======================
  // FORM HANDLERS
  // =======================

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

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
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

  // =======================
  // ON PHOTO UPLOAD
  // =======================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToastTopRight("error", "Ukuran file maksimal 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setShowCropModal(true);
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(file);

    setPhotoFile(file);
  };

  // =======================
  // CROP COMPLETE HANDLER
  // =======================

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // =======================
  // APPLY CROP
  // =======================

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedBlob(blob);
      setFormData((prev) => ({ ...prev, photo: url }));
      setShowCropModal(false);
    } catch (err) {
      console.error("Crop error:", err);
      showToastTopRight("error", "Gagal memproses crop gambar.");
    }
  };

  // =======================
  // UPLOAD PHOTO
  // =======================

  const uploadPhoto = async (uid) => {
    let file = croppedBlob || photoFile;

    // kalau tidak ada file baru, pakai URL lama (jika ada)
    if (!file) return formData.photo || "";

    try {
      setUploadingPhoto(true);
      const fileRef = storageRef(
        storage,
        `mitra_photos/${uid}/${Date.now()}.jpg`
      );
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (err) {
      console.error("Upload error:", err);
      showToastTopRight("error", "Gagal mengunggah foto. Coba lagi.");
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToastTopRight("error", "Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (!agreeTerms) {
      showToastTopRight(
        "warning",
        "Anda harus menyetujui perjanjian kemitraan"
      );
      return;
    }

    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Unauthenticated");

      const photoURL = await uploadPhoto(user.uid);
      if (photoURL === null) {
        setSaving(false);
        return;
      }

      const mitraRef = ref(db, `mitra/${user.uid}`);
      const socialRef = ref(db, `mitra/${user.uid}/socialmedia`);

      const saveData = {
        ...formData,
        photo: photoURL,
        id: mitraData?.id || Date.now(),
      };

      await set(mitraRef, saveData);
      await set(socialRef, socialMedia);

      showToastTopRight(
        "success",
        isEditMode ? "Profil berhasil diperbarui!" : "Profil berhasil dibuat!"
      );
      setTimeout(() => (window.location.href = "/profile"), 1500);
    } catch (err) {
      console.error(err);
      showToastTopRight("error", "Gagal menyimpan data. Silakan coba lagi.");
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
      <Sidebar activeKey="profile" />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <Navbar
          mitraName={mitraData?.name || "Nama Perusahaan Belum Diisi"}
          mitraEmail={userData?.email || "Memuat..."}
        />

        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {isEditMode ? "Edit Profil Mitra" : "Buat Profil Mitra"}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Lengkapi informasi profil mitra Anda untuk proses verifikasi
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Informasi Dasar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg">
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
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
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
                    className={`w-full px-4 py-2.5 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 ${
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
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
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
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
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
                <div className="p-2 bg-slate-50 rounded-lg">
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
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
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
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                      errors.state ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <CountrySelect
                  value={formData.country}
                  onChange={handleChange}
                  error={errors.country}
                />

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
                    className={`w-full px-4 py-2.5 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 ${
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

            {/* Foto & Logo */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Camera size="24" color={NAVY} variant="Bold" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Foto / Logo
                </h2>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Upload Foto / Logo
                </label>

                <label className="flex flex-col items-center justify-center w-full px-6 py-6 bg-slate-100 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-200 transition">
                  <Camera size="32" color="#475569" />
                  <p className="text-sm mt-2 text-slate-600">
                    Klik untuk memilih foto atau logo
                  </p>
                  <p className="text-xs text-slate-400">(JPG / PNG, max 5MB)</p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>

                {formData.photo && (
                  <div className="mt-4 flex items-center gap-4">
                    <div className="w-28 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={formData.photo}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImageSrc(formData.photo);
                          setShowCropModal(true);
                        }}
                        className="px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                      >
                        Crop Ulang
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, photo: "" }));
                          setPhotoFile(null);
                          setCroppedBlob(null);
                        }}
                        className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  </div>
                )}

                {uploadingPhoto && (
                  <p className="text-blue-600 text-sm mt-1">
                    Mengunggah foto...
                  </p>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Global size="24" color={NAVY} variant="Bold" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Media Sosial
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={socialMedia.website}
                    onChange={handleSocialMediaChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={socialMedia.linkedin}
                    onChange={handleSocialMediaChange}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={socialMedia.instagram}
                    onChange={handleSocialMediaChange}
                    placeholder="@username"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={socialMedia.facebook}
                    onChange={handleSocialMediaChange}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Twitter / X
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={socialMedia.twitter}
                    onChange={handleSocialMediaChange}
                    placeholder="@username"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Agreement */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Saya menyetujui Perjanjian Kemitraan
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAgreement(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Baca Perjanjian
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="px-6 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>{isEditMode ? "Perbarui Profil" : "Simpan Profil"}</>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== */}
      {/*       CROP MODAL      */}
      {/* ==================== */}
      {showCropModal && imageSrc && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="font-bold text-lg">Crop Foto</h3>

            <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Zoom: {Math.round(zoom * 100)}%
              </label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={handleApplyCrop}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg"
              >
                Crop & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AGREEMENT MODAL */}
      {showAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Perjanjian Kemitraan Magang
            </h2>

            <div className="max-h-72 overflow-y-auto pr-2 space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                Perjanjian ini mengatur hubungan antara{" "}
                <strong>Mitra Perusahaan</strong> dan platform{" "}
                <strong>Magangku</strong> dalam menyediakan lowongan magang bagi
                mahasiswa. Dengan menjadi mitra, perusahaan menyatakan memahami
                dan bersedia mematuhi ketentuan berikut:
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
                <strong>4. Status Verifikasi Perusahaan</strong>
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
                className="w-5 h-5 cursor-pointer"
              />
              <label className="text-sm text-slate-700">
                Saya telah membaca dan menyetujui perjanjian kemitraan.
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowAgreement(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => setShowAgreement(false)}
                disabled={!agreeTerms}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  agreeTerms
                    ? "bg-slate-700 text-white hover:bg-slate-800"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
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

export default CreateProfile;
