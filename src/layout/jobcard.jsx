export default function JobCard({
  image,
  company,
  position,
  lokasi,
  tipe,
  durasi,
  skema,
  penutupan,
}) {
  return (
    <div className="px-6 py-10 bg-white shadow-lg rounded-2xl border">
      <img src={image} alt="Logo Company" className="h-10 mb-3" />
      <div></div>
      <p className="-mt-2 text-[#8F8F8F] font-poppins text-[13.3px]">{company}</p>
      <h3 className="mt-4 font-semibold font-poppins text-[16px] text-lg">{position}</h3>
      <p className="text-[#8F8F8F] font-poppins text-[13.3px] text-sm">{lokasi}</p>

      <div className="flex gap-2 mt-3 text-xs">
        <span className="px-3 py-1 bg-[#D1FADF] font-poppins font-bold text-[#12B76A] rounded-full border border-[#12B76A]">
          {tipe}
        </span>
        <span className="px-3 py-1 bg-[#D9D9D9] text-[#616161] font-poppins font-bold rounded-full">{durasi}</span>
        <span className="px-3 py-1 bg-[#D9D9D9] text-[#616161] font-poppins font-bold rounded-full">{skema}</span>
      </div>

      <p className="mt-10 text-[13px] text-[#6D7A88] font-light font-poppins">
        Penutupan: <span className="text-[#F04438] font-semibold font-poppins">{penutupan}</span>
      </p>
      <button className="mt-4 w-full bg-[#7E7E7E] text-white font-medium py-2 rounded-xl">
        Lihat Detail →
      </button>
    </div>
  );
}
