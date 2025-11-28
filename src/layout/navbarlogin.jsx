import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-10">
      <img src="/img/logo.png" alt="Logo" className="w-36 md:w-40 h-auto mb-2 md:mb-0" />
      <ul className="flex gap-6 md:gap-8 text-[#8E8E93]">
        <li className="cursor-pointer font-poppins text-[17px] md:text-[20px] hover:text-[#00144F]">
          <Link to="/">Beranda</Link>
        </li>
        <li className="cursor-pointer font-poppins text-[17px] md:text-[20px] hover:text-[#00144F]">
          <Link to="/lowongan">Lowongan</Link>
        </li>
      </ul>
    </nav>
  );
}
