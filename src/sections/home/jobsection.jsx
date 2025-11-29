import { useEffect, useState } from "react";
import JobCard from "../../layout/jobcard";
import { getAllJobs } from "../../services/jobService";
import { useNavigate } from "react-router-dom";

const Jobsection = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getAllJobs();

      const sixJobs = data.slice(0, 6);

      setJobs(sixJobs);
    }
    load();
  }, []);

  return (
    <section className="px-12 py-16 bg-gradient-to-b from-[#FFFFFF] via-[#F3F3F3] to-[#FFFFFF]">
      <h2 className="text-3xl font-semibold mb-10 text-center font-poppins text-[38px]">
        Tawaran Pekerjaan Unggulan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {jobs.length === 0 && (
          <p className="text-gray-400 text-center">Memuat data...</p>
        )}

        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => navigate(`/lowongan/${job.id}`)}
            className="cursor-pointer"
          >
            <JobCard
              image={job.mitra?.photo || "/img/default.png"}
              company={job.mitra?.name}
              position={job.title}
              lokasi={`${job.mitra?.address}, ${job.mitra?.city}`}
              tipe={job.status}
              durasi={job.employment_duration}
              skema={job.work_type}
              penutupan={job.deadline}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Jobsection;
