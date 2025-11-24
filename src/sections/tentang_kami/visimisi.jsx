const VisiMisi = () => {
  return (
    <section
      className="py-20 px-20 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/img/visimisi.png')",
      }}
    >

      <div className="absolute inset-0 bg-gradient-to-b from-[#EB0081]/75 to-[#0D2058]/75"></div>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 text-white">
        <div>
          <h2 className="text-3xl text-center font-bold mb-5 underline decoration-white decoration-2">
            Visi:
          </h2>
          <p className="text-[18px] leading-relaxed text-justify whitespace-normal font-light file:font-poppins">
            Menjadi platform akselerasi karier dan magang terdepan di Indonesia
            yang secara konsisten menghasilkan talenta muda siap kerja yang
            profesional dan kompeten, menjadi jembatan utama untuk masa depan
            gemilang di BUMN dan Perusahaan Multinasional.
          </p>
        </div>

        <div>
          <h2 className="text-3xl text-center font-bold mb-5 underline decoration-white decoration-2">
            Misi:
          </h2>
          <p className="text-[18px] leading-relaxed text-justify whitespace-normal font-light font-poppins">
            Menjembatani kesenjangan keterampilan dengan menghubungkan talenta
            muda dengan magang terverifikasi di BUMN dan Perusahaan
            Multinasional. Kami memfasilitasi pengalaman kerja profesional dan
            memberikan pelatihan terpadu yang relevan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisiMisi;
