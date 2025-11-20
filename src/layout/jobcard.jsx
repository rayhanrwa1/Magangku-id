export default function JobCard({
  company,
  position,
  lokasi,
  tipe,
  durasi,
  image,
}) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl border">
      <img src={image} alt="logo" className="h-10 mb-3" />

      <h3 className="font-semibold text-lg">{position}</h3>
      <p className="text-gray-600">{company}</p>
      <p className="text-gray-500 text-sm">{lokasi}</p>

      <div className="flex gap-2 mt-3 text-xs">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
          {tipe}
        </span>
        <span className="px-3 py-1 bg-gray-200 rounded-full">{durasi}</span>
      </div>

      <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded-xl">
        Lihat Detail →
      </button>
    </div>
  );
}
