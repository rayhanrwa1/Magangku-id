import { useState } from "react";
import { useParams } from "react-router-dom";   

import Navbar from "../../layout/navbar";
import HeaderSearch from "../../sections/lowongan/headersearch";
import ListLowongan from "../../sections/lowongan/listlowongancard";
import JobDetail from "../../sections/lowongan/jobdetail";
import Footer from "../../layout/footer";

export default function LowonganPage() {
  const { jobId } = useParams();   
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar />
      <HeaderSearch onSearch={(value) => setSearchTerm(value.toLowerCase())} />
      <div className="px-4 lg:px-12 mt-6 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ListLowongan searchTerm={searchTerm} />
        </div>
        <div className="lg:col-span-2">
          {jobId ? (
            <JobDetail />
          ) : (
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
