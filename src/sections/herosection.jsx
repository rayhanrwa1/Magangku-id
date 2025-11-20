const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center px-12 py-20 gap-10">
      <div>
        <h1 className="text-4xl font-bold leading-tight">
          Temukan kesempatan magang di berbagai Perusahaan Multinasional
        </h1>

        <p className="mt-4 text-gray-600">
          Bergabung dengan Magangku sekarang dan temukan karier yang cocok untuk
          kamu.
        </p>

        <button className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl">
          Cari Lowongan
        </button>
      </div>

      <img src="/img/gambarhero.png" alt="Hero" />
    </section>
  );
};

export default HeroSection;
