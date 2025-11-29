import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { rtdb } from "../../database/firebase";

const JobDetail = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [mitra, setMitra] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("JOB ID =", jobId);

        const dbRef = ref(rtdb);
        const jobSnap = await get(child(dbRef, `jobs/${jobId}`));

        if (!jobSnap.exists()) {
          console.error("❌ JOB NOT FOUND IN REALTIME DB");
          return;
        }

        const jobData = jobSnap.val();

        const normalize = (value) => {
          if (!value) return [];
          if (Array.isArray(value)) return value;
          return value.split(",").map((i) => i.trim());
        };

        jobData.required_documents = normalize(jobData.required_documents);
        jobData.qualification = normalize(jobData.qualifications);
        jobData.job_description = normalize(jobData.job_description);

        setJob(jobData);

        if (jobData.mitra_id) {
          const mitraSnap = await get(child(dbRef, `mitra/${jobData.mitra_id}`));

          if (mitraSnap.exists()) {
            setMitra(mitraSnap.val());
          } else {
            console.error("❌ MITRA NOT FOUND");
          }
        }
      } catch (err) {
        console.error("🔥 ERROR:", err);
      }
    };

    fetchData();
  }, [jobId]);

  if (!job || !mitra) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="pt-6 px-10 pb-10 bg-white rounded-2xl shadow-lg border">
      <div className="flex justify-between items-start mb-10">

        <div className="flex flex-col">
          <img
            src={mitra.photo || "/img/default.png"}
            className="h-16 object-contain mb-4 self-start"
          />

          <h2 className="text-[28px] font-semibold">{job.title}</h2>

          <p className="text-black text-sm mb-1">{mitra.name}</p>

          <div className="text-[#616161] text-sm flex gap-6">
            <span>
              <i className="bi bi-geo-alt" /> {mitra.address}, {mitra.city}
            </span>
            <span>
              <i className="bi bi-building" /> {job.work_type}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 mt-2">
          <button className="px-8 py-3 w-[180px] bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white rounded-xl">
            Daftar Sekarang
          </button>

          <button className="px-8 py-3 w-[180px] border border-blue-700 text-blue-700 rounded-xl">
            Chat Sekarang
          </button>
        </div>

      </div>

      <h3 className="font-semibold mb-2">Pendidikan</h3>
      <p className="text-sm text-[#5A5A5A]">
        Jurusan: {job.education_requirement} <br />
        IPK Minimal: {job.gpa_min}
      </p>

      <hr className="my-6" />

      <h3 className="font-semibold mb-2">Persyaratan Dokumen</h3>
      <ul className="list-disc list-inside text-sm text-[#5A5A5A]">
        {job.required_documents.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <hr className="my-6" />

      <h3 className="font-semibold mb-2">Rincian Lowongan</h3>
      <ul className="list-disc list-inside text-sm text-[#5A5A5A]">
        {job.qualification.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <hr className="my-6" />

      <h3 className="font-semibold mb-2">Job Description</h3>
      <ol className="list-decimal list-inside text-sm text-[#5A5A5A]">
        {job.job_description.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

export default JobDetail;
