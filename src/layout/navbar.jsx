export default function navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-10">
      <div className="text-2xl font-bold text-blue-700">Magangku</div>

      <ul className="flex gap-8 text-gray-700">
        <li className="cursor-pointer hover:text-blue-600">Beranda</li>
        <li className="cursor-pointer hover:text-blue-600">Lowongan</li>
      </ul>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-full">
        Masuk
      </button>
    </nav>
  );
}
