const Program = () => {
  return (
    <section className="px-20 py-20 font-poppins">
      <h2 className="text-center text-3xl font-bold mb-16">
        Jenis Program Magang
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img src="/img/magangumum.png" className="w-full h-56 object-cover"/>
            <div className="absolute inset-0 bg-black/40"></div>
            <h3 className="absolute bottom-4 left-4 text-white text-2xl font-semibold drop-shadow-md">
              Magang Umum
            </h3>
          </div>
          <p className="mt-6 text-[#4B5563] text-justify leading-relaxed">
            Magang umum adalah program magang yang ditujukan untuk mahasiswa atau
            pelajar yang ingin memperoleh pengalaman kerja nyata di bidang tertentu
            tanpa persyaratan sertifikasi khusus. Fokusnya adalah pada pembelajaran
            praktik kerja, pengembangan keterampilan, dan adaptasi terhadap dunia
            profesional.
          </p>
        </div>

        <div>
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img src="/img/magangsertif.png" className="w-full h-56 object-cover"/>

            <div className="absolute inset-0 bg-black/40"></div>
            <h3 className="absolute bottom-4 left-4 text-white text-2xl font-semibold drop-shadow-md">
              Magang Bersertifikat
            </h3>
          </div>
          <p className="mt-6 text-[#4B5563] text-justify leading-relaxed">
            Magang bersertifikat adalah program magang yang diakui secara resmi 
            dan biasanya bekerja sama dengan lembaga pemerintah atau institusi 
            pendidikan. Peserta akan mendapatkan sertifikat resmi setelah 
            menyelesaikan magang, yang dapat digunakan sebagai bukti kompetensi 
            dan pengalaman profesional di bidang terkait.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Program;
