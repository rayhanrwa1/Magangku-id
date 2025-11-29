import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center px-12 py-20 gap-10">
      <div>
        <h1 className="text-4xl font-semibold font-poppins text-[38px] leading-tight">
          Temukan kesempatan <br /> magang di berbagai <br /> Perusahaan <br /> Multinasional
        </h1>

        <p className="mt-4 text-black font-poppins">
          Bergabung dengan Magangku sekarang <br />
          dan temukan karier yang paling sesuai untuk Kamu.
        </p>

        <Link
          to="/lowongan"
          className="mt-6 px-8 py-3 bg-[#1E3A8A] font-semibold font-poppins text-white rounded-xl inline-block"
        >
          Cari Lowongan
        </Link>
      </div>

      <img src="/img/gambarhero.png" alt="Hero" />
    </section>
  );
};

export default HeroSection;
