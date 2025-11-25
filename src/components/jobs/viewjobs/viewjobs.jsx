import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db, auth } from "../../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../../layout/navbar/navbar";
import Sidebar from "../../../layout/sidebar/sidebar";

import {
  Building,
  Location,
  Global,
  Briefcase,
  Clock,
  DocumentText,
  Calendar,
  Edit,
  ArrowLeft,
} from "iconsax-react";

export default function ViewJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return (window.location.href = "/");

      try {
        // Get mitra data
        const snap = await get(ref(db, `mitra/${user.uid}`));
        if (snap.exists()) setMitraData(snap.val());

        // Get user data
        const userSnap = await get(ref(db, `users/${user.uid}`));
        if (userSnap.exists()) setUserData(userSnap.val());

        // Get job data
        const jobSnap = await get(ref(db, `jobs/${id}`));
        if (jobSnap.exists()) {
          const job = jobSnap.val();
          // Verify ownership
          if (job.mitra_id !== user.uid) {
            alert("Anda tidak memiliki akses ke lowongan ini");
            window.location.href = "/jobs";
            return;
          }
          setJobData(job);
        } else {
          alert("Lowongan tidak ditemukan");
          window.location.href = "/jobs";
        }
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-green-100 text-green-700 border-green-200",
      closed: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      open: "Aktif",
      closed: "Ditutup",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {labels[status] || status}
      </span>
    );
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

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeKey="jobs" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar mitraPhoto={mitraData?.photo} mitraName={mitraData?.name} mitraEmail={userData?.email} />

        <main className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Job Detail Card */}
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Header Section */}
            <div className="bg-slate-800 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {jobData?.title || "Judul Lowongan"}
                  </h2>
                  <p className="text-slate-300 text-sm mt-1">
                    {jobData?.category || "Kategori"}
                  </p>
                </div>
                {getStatusBadge(jobData?.status)}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-slate-700" />
                  Informasi Dasar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Location size={18} />}
                    label="Lokasi"
                    value={jobData?.location}
                  />
                  <InfoItem
                    icon={<Global size={18} />}
                    label="Tipe Pekerjaan"
                    value={
                      jobData?.work_type === "onsite"
                        ? "Onsite"
                        : jobData?.work_type === "hybrid"
                        ? "Hybrid"
                        : "Remote"
                    }
                  />
                  <InfoItem
                    icon={<Clock size={18} />}
                    label="Durasi"
                    value={jobData?.employment_duration}
                  />
                  <InfoItem
                    icon={<Building size={18} />}
                    label="Kualifikasi Pendidikan"
                    value={jobData?.education_requirement}
                  />
                  <InfoItem
                    icon={<DocumentText size={18} />}
                    label="Minimal IPK"
                    value={jobData?.gpa_min || "-"}
                  />
                  <InfoItem
                    icon={<Calendar size={18} />}
                    label="Deadline"
                    value={formatDate(jobData?.deadline)}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Required Documents */}
              {jobData?.required_documents && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Dokumen yang Dibutuhkan
                    </h3>
                    <p className="text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {jobData.required_documents}
                    </p>
                  </div>
                  <div className="border-t border-gray-200"></div>
                </>
              )}

              {/* Job Description */}
              {jobData?.job_description && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Deskripsi Pekerjaan
                    </h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {jobData.job_description}
                    </div>
                  </div>
                  <div className="border-t border-gray-200"></div>
                </>
              )}

              {/* Qualifications */}
              {jobData?.qualifications && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Kualifikasi & Persyaratan
                    </h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {jobData.qualifications}
                    </div>
                  </div>
                  <div className="border-t border-gray-200"></div>
                </>
              )}

              {/* Important Dates */}
              {jobData?.important_dates && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Tanggal Penting
                    </h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {jobData.important_dates}
                    </div>
                  </div>
                  <div className="border-t border-gray-200"></div>
                </>
              )}

              {/* Additional Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Informasi Tambahan
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`px-3 py-2 rounded-lg border ${
                      jobData?.is_general
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {jobData?.is_general
                      ? "✓ Lowongan Umum"
                      : "Lowongan Khusus"}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Dibuat:</span>{" "}
                    {jobData?.created_at
                      ? new Date(jobData.created_at).toLocaleString("id-ID")
                      : "-"}
                  </div>
                  {jobData?.updated_at &&
                    jobData.updated_at !== jobData.created_at && (
                      <div>
                        <span className="font-medium">Diperbarui:</span>{" "}
                        {new Date(jobData.updated_at).toLocaleString("id-ID")}
                      </div>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate("/jobs")}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>

                <button
                  onClick={() => navigate(`/jobs/${jobData?.id}/edit`)}
                  className="px-6 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={18} color="white" />
                  Edit Lowongan
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable Info Item Component
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-600">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-sm text-gray-900 break-words">{value || "-"}</p>
      </div>
    </div>
  );
}
