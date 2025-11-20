export default function Footer() {
  return (
    <footer className="bg-white py-10 px-12 border-t mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <div>
          <h2 className="text-xl font-bold text-blue-700">Magangku</h2>
          <p className="mt-3 text-sm">Email: cs.magangku@magangku.com</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Hubungi</h3>
          <p className="text-sm">Senin–Jumat: 8.00 – 20.00</p>
          <p className="text-sm">+62 851 6172 4229</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Halaman</h3>
          <p className="text-sm">Beranda</p>
          <p className="text-sm">Lowongan</p>
        </div>

      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        © 2025 Magangku. All rights reserved.
      </p>
    </footer>
  );
}
