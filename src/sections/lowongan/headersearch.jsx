const HeaderSearch = () => {
  return (
    <div className="px-12 mt-6">
      <h1 className="text-2xl font-poppins font-semibold mb-4">Pencarian</h1>

      <div className="flex gap-4">
        <input 
          type="text"
          placeholder="Cari posisi atau perusahaan..."
          className="w-full border rounded-xl p-4"
        />

        <button className="px-6 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white rounded-xl">
          Filter
        </button>
      </div>
    </div>
  );
};

export default HeaderSearch;