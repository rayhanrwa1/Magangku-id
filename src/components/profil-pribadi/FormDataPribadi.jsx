export default function FormDataPribadi({ onBack }) {
  return (
    <div className="w-full bg-white border border-blue-200 rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-1">Data Pribadi</h2>
      <p className="text-gray-600 mb-6">
        Pastikan data pribadi benar untuk mempermudah proses pendaftaran.
      </p>

      {/* Tentang Saya */}
      <label className="font-medium">Tentang Saya</label>
      <textarea
        className="w-full border rounded-lg p-3 mt-2 mb-6 h-32 text-gray-700"
        placeholder="Tuliskan tentang diri Anda..."
      ></textarea>

      {/* GRID FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nama Lengkap */}
        <div>
          <label className="block mb-1 font-medium">Nama Lengkap *</label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg"
            placeholder="Masukkan nama"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            className="w-full border p-3 rounded-lg"
            placeholder="Masukkan email"
          />
        </div>

        {/* Nomor Telepon */}
        <div>
          <label className="block mb-1 font-medium">No Handphone *</label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg"
            placeholder="08xxxx"
          />
        </div>

        {/* NIK */}
        <div>
          <label className="block mb-1 font-medium">NIK *</label>
          <input
            type="number"
            className="w-full border p-3 rounded-lg"
            placeholder="357xxxx"
          />
        </div>

        {/* TTL */}
        <div>
          <label className="block mb-1 font-medium">Tanggal Lahir *</label>
          <input
            type="date"
            className="w-full border p-3 rounded-lg"
            placeholder="01/01/2003"
          />
        </div>

        {/* TTL */}
        <div>
          <label className="block mb-1 font-medium">Tempat Lahir *</label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg"
            placeholder="Malang"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block mb-1 font-medium">Jenis Kelamin *</label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg"
            placeholder="Laki-laki"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block mb-1 font-medium">Alamat</label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg"
            placeholder="Jl. Soekarno Hatta, Malang, Jawa Timur"
          />
        </div>
      </div>

      {/* Tombol */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
        >
          Batal
        </button>

        <button className="px-6 py-1.5 bg-blue-600 text-white rounded-lg">
          Simpan
        </button>
      </div>
    </div>
  );
}
