import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobListCard from "../../layout/joblistcard";
import { getAllJobs } from "../../services/jobService";

export default function ListLowongan() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAllJobs();
      console.log("DATA FROM FIREBASE =", data);
      setJobs(data);
    }
    load();
  }, []);

  return (
    <section>
      <div className="space-y-6">
        {jobs.length === 0 && <p>Loading...</p>}

        {jobs.map((job) => (
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
