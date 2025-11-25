export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10 font-poppins">
      {/* Top content */}
      <div className="py-10 px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10">
        <div>
          <img src="/img/logofooter.png" alt="Logo" className="w-20 md:w-21 h-auto" />
          <p className="mt-3 text-[15px] text-[#616161] font-medium">
            Email: <a href="mailto:cs.magangku@magangku.com" className="hover:underline">cs.magangku@magangku.com</a>
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
          <div className="grid grid-cols-2 gap-x-6 md:gap-x-10 gap-y-2">
            <div className="space-y-2">
              <a href="#" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">Beranda</a>
              <a href="#" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">Lowongan</a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">Tentang Kami</a>
              <a href="#" className="block text-[14px] text-[#636363] font-medium hover:text-[#00144F]">Panduan</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full bg-gradient-to-r from-[#EB0081] to-[#0D2058]">
        <div className="max-w-screen-xl mx-auto py-3 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-white text-[13px]">
          <p className="mb-2 md:mb-0">© 2025 Magangku. All rights reserved.</p>
          <div className="flex gap-3 md:gap-6">
            <a href="#" className="hover:underline">Pusat Privasi</a>
            <a href="#" className="hover:underline">Syarat dan Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
