export default function DataAkademikKosong({ onFill }) {
  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <div className="w-full bg-[#F7F7F7] border rounded-3xl p-10 flex flex-col items-center text-center">
          <img
            src="/img/unknown-file.png"
            alt="empty"
            className="w-20 opacity-50 mx-auto mb-6"
          />
          <p className="text-gray-600 mb-6 text-lg">
            Data Akademik kamu belum dibuat
          </p>

          <button
            onClick={onFill}
            className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            Tambahkan Data
          </button>
        </div>
      </div>
    </div>
  );
}
