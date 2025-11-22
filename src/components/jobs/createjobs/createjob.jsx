import { useEffect, useState } from "react";
import { ref, set, get, push } from "firebase/database";
import { db, auth } from "../../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../../../layout/navbar/navbar";
import Sidebar from "../../../layout/sidebar/sidebar";
import { showToastTopRight } from "../../../utils/alertUtils";

import {
  Building,
  Location,
  Global,
  Briefcase,
  Clock,
  CloseCircle,
} from "iconsax-react";

export default function CreateJob() {
  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    work_type: "onsite",
    employment_duration: "",
    is_general: false,
    education_requirement: "",
    gpa_min: "",
    required_documents: "",
    job_description: "",
    qualifications: "",
    important_dates: "",
    deadline: "",
    status: "open",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return (window.location.href = "/login");

      try {
        // Get mitra data
        const snap = await get(ref(db, `mitra/${user.uid}`));
        if (snap.exists()) {
          setMitraData(snap.val());
        }

        // Get user data
        const userSnap = await get(ref(db, `users/${user.uid}`));
        if (userSnap.exists()) setUserData(userSnap.val());
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const validateForm = () => {
    const err = {};

    if (!formData.title.trim()) err.title = "Judul wajib diisi";
    if (!formData.category.trim()) err.category = "Kategori wajib diisi";
    if (!formData.location.trim()) err.location = "Lokasi wajib diisi";
    if (!formData.employment_duration.trim())
      err.employment_duration = "Durasi wajib diisi";
    if (!formData.education_requirement.trim())
      err.education_requirement = "Kualifikasi pendidikan wajib diisi";
    if (!formData.deadline.trim()) err.deadline = "Deadline wajib diisi";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        showToastTopRight("error", "Sesi berakhir. Silakan login kembali.");
        window.location.href = "/login";
        return;
      }

      const newJobRef = push(ref(db, "jobs"));

      const dataToSave = {
        ...formData,
        id: newJobRef.key,
        mitra_id: user.uid,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      await set(newJobRef, dataToSave);

      showToastTopRight("success", "Lowongan berhasil dibuat!");

      setTimeout(() => {
        window.location.href = "/jobs";
      }, 900);
    } catch (error) {
      console.error("Error saving job:", error);
      showToastTopRight("error", "Gagal menyimpan lowongan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-slate-800 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (mitraData && mitraData.verified === false) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar activeKey="jobs" />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar mitraName={mitraData?.name} mitraEmail={userData?.email} />

          <main className="p-4 md:p-6 lg:p-8">
            <div className="bg-white border border-red-200 rounded-lg p-6 md:p-8 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloseCircle size={32} className="text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-red-700 mb-2">
                Akun Anda Belum Terverifikasi
              </h2>
              <p className="text-gray-600 mb-6">
                Anda belum dapat membuat lowongan pekerjaan sebelum akun mitra
                diverifikasi oleh admin. Mohon tunggu proses verifikasi.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium text-sm">
                <Clock size={18} />
                <span>Status: Menunggu Verifikasi Admin</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeKey="jobs" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar mitraName={mitraData?.name} mitraEmail={userData?.email} />

        <main className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Buat Lowongan Baru
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Lengkapi detail lowongan pekerjaan untuk dipublish
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="bg-slate-800 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-white">
                Informasi Lowongan
              </h2>
              <p className="text-slate-300 text-sm mt-0.5">
                Detail posisi yang tersedia
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Judul Lowongan <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Frontend Developer Intern"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-600 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kategori <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Building
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm ${
                        errors.category ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Software Engineering"
                    />
                  </div>
                  {errors.category && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Location & Work Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Lokasi <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Location
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm ${
                        errors.location ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Jakarta Selatan"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tipe Pekerjaan
                  </label>
                  <div className="relative">
                    <Global
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      name="work_type"
                      value={formData.work_type}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm"
                    >
                      <option value="onsite">Onsite</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Employment Duration & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Durasi Pekerjaan <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="employment_duration"
                    value={formData.employment_duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm ${
                      errors.employment_duration
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="3 bulan"
                  />
                  {errors.employment_duration && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.employment_duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kualifikasi Pendidikan{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="education_requirement"
                    value={formData.education_requirement}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm ${
                      errors.education_requirement
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="S1 Teknik Informatika"
                  />
                  {errors.education_requirement && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.education_requirement}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: GPA & Required Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Minimal IPK
                  </label>
                  <input
                    name="gpa_min"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa_min}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm"
                    placeholder="3.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Dokumen yang Dibutuhkan
                  </label>
                  <input
                    name="required_documents"
                    value={formData.required_documents}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm"
                    placeholder="CV, Portofolio, Transkrip"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm resize-none"
                  placeholder="Jelaskan tanggung jawab dan detail pekerjaan..."
                ></textarea>
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kualifikasi & Persyaratan
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm resize-none"
                  placeholder="Jelaskan kualifikasi yang dibutuhkan..."
                ></textarea>
              </div>

              {/* Important Dates & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tanggal Penting
                  </label>
                  <textarea
                    name="important_dates"
                    value={formData.important_dates}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm resize-none"
                    placeholder="Interview: 20 Des 2024&#10;Mulai kerja: 2 Jan 2025"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Deadline Pendaftaran <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Clock
                      color="gray"
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none text-sm ${
                        errors.deadline ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.deadline && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.deadline}
                    </p>
                  )}
                </div>
              </div>

              {/* Is General Checkbox */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_general"
                    checked={formData.is_general}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-slate-800 focus:ring-2 focus:ring-slate-800"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">
                      Lowongan Umum
                    </span>
                    <span className="text-xs text-gray-500">
                      Centang jika lowongan dapat dilamar oleh semua kandidat
                      (tidak terbatas pada mahasiswa tertentu)
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => (window.location.href = "/jobs")}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Batal
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Lowongan"
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
