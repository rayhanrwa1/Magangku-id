export default function DataKosong({ onFill }) {
  return (
    <div className="w-full bg-white border border-gray-300 rounded-xl py-20 text-center shadow-sm">
      <img
        src="/img/unknown-file.png"
        alt="empty"
        className="w-20 opacity-50 mx-auto mb-6"
      />

      <p className="text-gray-600 mb-6 text-lg">
        Data Kamu belum lengkap, silahkan lengkapi data!
      </p>

      <button
        onClick={onFill}
        className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-100 transition"
      >
        Lengkapi Data
      </button>
    </div>
  );
}
