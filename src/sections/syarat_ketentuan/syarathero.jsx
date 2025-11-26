const SyaratHero = () => {
  return (
    <section className="relative w-full h-[320px]">
      <img src="/img/hero_syarat.png" alt="Privacy Hero" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-20">
        <div>
          <h1 className="text-white text-5xl font-bold font-poppins">
            Syarat dan Ketentuan
          </h1>
        </div>
      </div>
    </section>
  );
};

export default SyaratHero;
