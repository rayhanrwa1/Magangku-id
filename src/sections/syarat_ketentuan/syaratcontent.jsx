const SyaratContent = () => {
  return (
    <section className="px-10 py-16 flex flex-col items-center">
      <img src="/img/syaratketentuan.png" alt="Privacy Illustration" className="w-1/2 mb-10" />

      <p className="text-justify leading-7 text-gray-700 mb-5">
        Syarat: Dengan membuat akun dan memakai layanan Magangku, kamu menyetujui seluruh aturan yang berlaku. 
        Kamu wajib memberi data yang benar dan terbaru. Gunakan layanan hanya untuk tujuan magang atau pencarian kerja yang sah. 
        Dilarang melakukan tindak melawan hukum, penipuan, penyalahgunaan fitur, spam, atau scraping. Jaga kerahasiaan kredensial akun. 
        Kamu bertanggung jawab atas seluruh aktivitas pada akunmu.
      </p>

      <p className="text-justify leading-7 text-gray-700">
        Ketentuan: Kami berhak menangguhkan atau menghapus akun yang melanggar kebijakan, menampilkan konten tidak pantas, atau menyalahgunakan sistem. 
        Informasi dan materi di platform dapat berubah sewaktu-waktu tanpa pemberitahuan. 
        Kami tidak bertanggung jawab atas kerugian akibat kesalahan pengguna, gangguan teknis, atau tindakan pihak ketiga. Dengan terus memakai layanan, kamu dianggap memahami dan menyetujui setiap perubahan Syarat dan Ketentuan. 
        Pertanyaan lebih lanjut, hubungi support@[domain].com.
      </p>
    </section>
  );
};

export default SyaratContent;