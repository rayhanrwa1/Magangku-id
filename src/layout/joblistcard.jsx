export default function JobListCard({
  image,
  company,
  position,
  lokasi,
  info,
  durasi,
  skema,
  detail,
  penutupan,
}) {
  return (
    <div className="px-6 py-10 bg-white shadow-lg rounded-2xl border min-h-[403px] flex flex-col">
      
      <div className="h-14 flex items-center mb-3">
        <img src={image} alt="Logo Company" className="max-h-full object-contain"/>
      </div>
      
      <p className="-mt-2 text-[#8F8F8F] font-poppins text-[13.3px]">{company}</p>
      <h3 className="mt-4 font-semibold font-poppins text-[16px]">{position}</h3>
      <p className="text-[#8F8F8F] font-poppins text-[13.3px]">{lokasi}</p>
      <div className="flex gap-2 mt-3 text-xs">
        <span className="px-3 py-1 flex items-center justify-center bg-green-100  font-bold 
                          font-poppins text-[10.7px] text-green-700 rounded-full border-2 border-[#12B76A]">
          {info}
        </span>
        <span className="px-3 py-1 flex items-center justify-center bg-blue-50 font-bold 
                          font-poppins text-[10.7px] text-blue-700 rounded-full">{durasi}</span>
        <span className="px-3 py-1 flex items-center justify-center bg-purple-50 font-bold 
                          font-poppins text-[10.7px] text-purple-700 rounded-full">{skema}</span>
      </div>

      <ul className="mt-5 text-[#636363] font-poppins text-[14px] space-y-1 list-disc list-inside">
        {detail?.map((item, index) => (
          <li key={index} className="leading-snug">
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-12 text-[13px] text-[#6D7A88] font-light">
        Penutupan:{" "}
        <span className="text-[#F04438] font-semibold">{penutupan}</span>
      </p>
    </div>
  );
}
