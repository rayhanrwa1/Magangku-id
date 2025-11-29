import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../layout/navbar";
import HeaderSearch from "../../sections/lowongan/headersearch";
import ListLowongan from "../../sections/lowongan/listlowongancard";
import JobDetail from "../../sections/lowongan/jobdetail";
import Footer from "../../layout/footer";
import { getAllJobs } from "../../services/jobService";

export default function LowonganPage() {
  const { jobId } = useParams();
  
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    locations: [],
    positions: [],
    workScheme: [],
    duration: []
  });

  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    positions: [],
    workScheme: [],
    duration: []
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      const jobs = await getAllJobs();
      const loc = [...new Set(jobs.map(j => j.location).filter(Boolean))];
      const pos = [...new Set(jobs.map(j => j.title).filter(Boolean))];
      const work = [...new Set(jobs.map(j => j.work_type).filter(Boolean))];
      const dur = [...new Set(jobs.map(j => j.employment_duration).filter(Boolean))];

      setFilterOptions({
        locations: loc,
        positions: pos,
        workScheme: work,
        duration: dur
      });
    };

    loadFilterOptions();
  }, []);

  return (
    <>
      <Navbar />

      <HeaderSearch 
        onSearch={(value) => setSearchTerm(value.toLowerCase())}
        filterOptions={filterOptions}               
        onApplyFilter={(selected) => setFilters(selected)}/>

      <div className="px-4 lg:px-12 mt-6 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-1">
          <ListLowongan 
            searchTerm={searchTerm}
            filters={filters}                       
          />
        </div>

        <div className="lg:col-span-2">
          {jobId ? <JobDetail /> : (
            <div className="text-gray-400 text-center mt-20">
              Pilih lowongan untuk melihat detail
            </div>
          )}
        </div>

      </div>

      <Footer />
    </>
  );
}
