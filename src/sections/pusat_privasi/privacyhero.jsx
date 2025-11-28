const PrivacyHero = () => {
  return (
    <section className="relative w-full h-[320px]">
      <img src="/img/hero_pusat.png" alt="Privacy Hero" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-20">
        <div>
          <h1 className="text-white text-5xl font-bold font-poppins">
            Pusat Privasi
          </h1>
          <p className="text-white mt-2 text-lg">
            Terakhir diperbarui 30 September 2025
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyHero;
