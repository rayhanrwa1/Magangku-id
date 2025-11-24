const About = () => {
  return (
    <section className="px-20 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      <div className="flex justify-center">
        <img src="/img/logo.png" className="w-80" />
      </div>

      <p className="text-[#2B2B2B] text-justify leading-relaxed text-[18px] font-poppins">
        Magangku adalah platform magang terpadu yang dirancang khusus untuk menjembatani mahasiswa, dan fresh graduate, menghubungkan mereka dengan kesempatan untuk mengaplikasikan ilmu yang telah dipelajari.
        Kami memfasilitasi penempatan magang di berbagai perusahaan terkemuka, termasuk BUMN dan Perusahaan Multinasional, sehingga peserta dapat mempraktikkan keterampilan secara langsung.
        Tujuannya adalah untuk memberikan pengalaman kerja nyata dan membekali peserta dengan tambahan pengetahuan serta skill yang sesuai dengan standar kerja profesional di industri.
      </p>
    </section>
  );
};

export default About;
