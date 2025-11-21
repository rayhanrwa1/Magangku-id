export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-10">
      <img src="/img/logo.png" alt="Logo" className="w-40 h-auto" />
      
      <ul className="flex gap-8 text-[#8E8E93]">
        <li className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F]">Beranda</li>
        <li className="cursor-pointer font-poppins text-[20px] hover:text-[#00144F]">Lowongan</li>
      </ul>

      <button className="px-6 py-2 bg-[#446ED7] text-white font-poppins text-[20px] rounded-full">
        Masuk
      </button>
    </nav>
  );
}
