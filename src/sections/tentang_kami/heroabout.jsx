const HeroAbout = () => {
  return (
    <section className="relative w-full h-[320px]">
      <img src="/img/tentangkami.png" className="w-full h-full object-cover"/>

      <div className="absolute inset-0 bg-black bg-opacity-65 flex items-center px-20">
        <h1 className="text-white text-5xl font-bold font-poppins">
          Tentang Kami
        </h1>
      </div>
    </section>
  );
};

export default HeroAbout;