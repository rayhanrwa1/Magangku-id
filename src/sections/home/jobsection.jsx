import JobCard from "../../layout/jobcard";

const Jobsection = () => {
  return (
    <section className="px-12 py-16 bg-gradient-to-b from-[#FFFFFF] via-[#F3F3F3] to-[#FFFFFF]">
      <h2 className="text-3xl font-semibold mb-10 text-center font-poppins text-[38px]">
        Tawaran Pekerjaan Unggulan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <JobCard
          image="/img/mandiri.png"
          company="PT Mandiri Utama Finance"
          position="Software Quality Assurance"
          lokasi="Tebet, Jakarta Selatan"
          tipe="Umum"
          durasi="5 bulan"
          skema="WFH"
          penutupan="28 Agustus 2025"
        />

        <JobCard
          image="/img/bfi.png"
          company="PT BFI FINANCE INDONESIA"
          position="Account Office"
          lokasi="Kalideres, Jakarta"
          tipe="Umum"
          durasi="5 bulan"
          skema="WFH"
          penutupan="28 Agustus 2025"
        />

        <JobCard
          image="/img/platinum.png"
          company="PT Platinum Ceramics Industry"
          position="Management Trainee"
          lokasi="Jakarta Raya"
          tipe="Umum"
          durasi="5 bulan"
          skema="WFH"
          penutupan="28 Agustus 2025"
        />

        <JobCard
          image="/img/ef.png"
          company="EF English First Swara Group"
          position="Graphic Designer"
          lokasi="Tangerang, Jakarta"
          tipe="Umum"
          durasi="5 bulan"
          skema="WFH"
          penutupan="28 Agustus 2025"
        />

        <JobCard
          image="/img/kimiafarma.png"
          company="PT Kimia Farma TBK"
          position="Internship Akuntansi (TJSL) - KFHO"
          lokasi="Kota Adm. Jakarta Pusat"
          tipe="Umum"
          durasi="5 bulan"
          skema="WFH"
          penutupan="28 Agustus 2025"
        />

        <JobCard
          image="/img/danamon.png"
          company="PT Bank Danamon Indonesia"
          position="Bankers Trainee"
          lokasi="Jakarta Pusat"
          tipe="Umum"
          durasi="5 bulan"
          skema="WFH"
          penutupan="28 Agustus 2025"
        />
      </div>
    </section>
  );
};

export default Jobsection;