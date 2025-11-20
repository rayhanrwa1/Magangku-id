import JobCard from "../layout/jobcard";

const Jobsection = () => {
  return (
    <section className="px-12 py-16">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Tawaran Pekerjaan Unggulan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <JobCard
          company="PT Mandiri Utama Finance"
          position="Software Quality Assurance"
          lokasi="Tebet, Jakarta Selatan"
          tipe="Umum"
          durasi="5 bulan"
          image="/assets/mandiri.png"
        />

        {/* Tambahkan Card lainnya */}
      </div>
    </section>
  );
};

export default Jobsection;