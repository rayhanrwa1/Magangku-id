import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10 font-poppins">

      <div className="py-10 px-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <img src="/img/logofooter.png" alt="Logo" className="w-21 h-auto" />
          <p className="mt-3 text-[15px] text-[#616161] font-medium">
            Email: cs.magangku@magangku.com
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Hubungi</h3>
          <p className="text-[14px] text-[#848484] font-medium mt-2">Senin–Jumat: 8.00 – 20.00</p>
          <p className="text-[14px] text-[#848484] font-medium mt-2">Sabtu–Minggu: 9.00 – 18.00</p>
          <p className="text-[14px] text-[#848484] font-medium mt-2">+62 851 6172 4229</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Halaman</h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2">

            <div className="space-y-2">
              <Link to="/" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">
                Beranda
              </Link>

              <Link to="/lowongan" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">
                Lowongan
              </Link>
            </div>

            <div className="space-y-2">
              <Link to="/tentang_kami" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">
                Tentang Kami
              </Link>

              <Link to="/panduan" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">
                Panduan
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-gradient-to-r from-[#EB0081] to-[#0D2058]">

        <div className="max-w-screen-xl mx-auto py-3 px-6 flex justify-between text-white text-[13px]">
          <p>© 2025 Magangku. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/pusat_privasi" className="hover:underline">
              Pusat Privasi
            </Link>

            <Link to="/syarat_ketentuan" className="hover:underline">
              Syarat dan Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


