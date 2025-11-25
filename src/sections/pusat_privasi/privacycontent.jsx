const PrivacyContent = () => {
  return (
    <section className="px-10 py-16 flex flex-col items-center">
      <img src="/img/pusatprivasi.png" alt="Privacy Illustration" className="w-1/2 mb-10" />

      <p className="text-justify leading-7 text-gray-700 mb-5">
        Kami melindungi data pribadi sesuai UU PDP dan standar keamanan industri. 
        Data yang kami proses mencakup nama, email, profil, riwayat lamaran, dan aktivitas akun. 
        Tujuannya untuk menjalankan layanan magang, memberi rekomendasi relevan, mencegah penipuan, dan menjaga keamanan sistem. 
        Kami berbagi data hanya dengan perusahaan mitra dan penyedia layanan tepercaya untuk kebutuhan operasional. 
        Kami tidak menjual data pribadi dalam bentuk apa pun.
      </p>

      <p className="text-justify leading-7 text-gray-700">
        Kami menerapkan enkripsi, kontrol akses berbasis peran, pemantauan insiden, dan audit berkala. 
        Data disimpan selama diperlukan lalu dihapus atau dianonimkan sesuai aturan. 
        Kamu berhak melihat, memperbarui, mengunduh, atau menghapus data melalui menu Kelola Data Pribadi. 
        Pengaturan notifikasi dan preferensi komunikasi tersedia di akunmu. Pertanyaan atau permintaan privasi, kirim email ke privacy@[domain].com.
      </p>
    </section>
  );
};

export default PrivacyContent;