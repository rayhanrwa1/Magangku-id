import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import JobListCard from "../../layout/joblistcard";
import { getAllJobs } from "../../services/jobService";

export default function ListLowongan({ searchTerm, filters }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAllJobs();
      setJobs(data);
    }
    load();
  }, []);

  const passesFilters = (job) => {
    const locOK =
      filters.locations.length === 0 ||
      filters.locations.includes(job.mitra?.city?.toLowerCase());

    const posOK =
      filters.positions.length === 0 ||
      filters.positions.includes(job.title?.toLowerCase());

    const schemeOK =
      filters.workScheme.length === 0 ||
      filters.workScheme.includes(job.work_type?.toLowerCase());

    const durationOK =
      filters.duration.length === 0 ||
      filters.duration.includes(job.employment_duration?.toLowerCase());

    return locOK && posOK && schemeOK && durationOK;
  };

  const filteredJobs = jobs
    .filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.mitra?.name?.toLowerCase() || "";
      const city = job.mitra?.city?.toLowerCase() || "";

      return (
        title.includes(searchTerm) ||
        company.includes(searchTerm) ||
        city.includes(searchTerm)
      );
    })
    .filter((job) => passesFilters(job)); 

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
              durasi={job.employment_duration}
              skema={job.work_type}
              detail={job.required_documents || []}
              penutupan={job.deadline}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
