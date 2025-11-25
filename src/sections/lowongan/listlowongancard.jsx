import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // <-- WAJIB
import JobListCard from "../../layout/joblistcard";
import { getAllJobs } from "../../services/jobService";

export default function ListLowongan({ searchTerm }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAllJobs();
      setJobs(data);
    }
    load();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const company = job.mitra?.name?.toLowerCase() || "";
    const city = job.mitra?.city?.toLowerCase() || "";

    return (
      title.includes(searchTerm) ||
      company.includes(searchTerm) ||
      city.includes(searchTerm)
    );
  });

  return (
    <section>
      <div className="space-y-6">
        {filteredJobs.length === 0 && (
          <p className="text-gray-400">Tidak ada lowongan ditemukan.</p>
        )}

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="cursor-pointer"
            onClick={() => navigate(`/lowongan/${job.id}`)}
          >
            <JobListCard
              image={job.mitra?.photo || "/img/default.png"}
              company={job.mitra?.name}
              position={job.title}
              lokasi={`${job.mitra?.address}, ${job.mitra?.city}`}
              info={job.status}
              detail={job.required_documents || []}
              penutupan={job.deadline}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
