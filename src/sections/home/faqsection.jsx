import { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="w-full max-w-5xl mx-auto border-2 border-[#1E3A8A] rounded-xl shadow cursor-pointer"
      onClick={() => setOpen(!open)}>

      <div className="flex items-center justify-between p-5">
        <p className="text-[#2B2B2B] text-[19px] font-poppins font-semibold">
          {question}
        </p>

        <span className="text-2xl font-bold text-[#1E3A8A]">
          {open ? "−" : "+"}
        </span>
      </div>

      {open && (
        <div className="px-5 pb-5 text-[#4B5563] text-[16px] font-poppins animate-fade">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function Faqsection() {
  return (
    <section className="px-12 py-20">
      <h2 className="text-3xl font-semibold font-poppins text-[38px] mb-10 text-center">
        Pertanyaan yang Sering Ditanyakan
      </h2>

      <div className="space-y-4">
        <FAQItem
          question="Apakah saya bisa mendaftar lebih dari satu lowongan?"
          answer="Tentu bisa! Kamu diperbolehkan mendaftar ke lebih dari satu lowongan magang sekaligus. 
                  Namun, pastikan kamu tetap memperhatikan jadwal seleksi dan kualifikasi 
                  setiap posisi agar proses pendaftaran berjalan lancar dan tidak saling bertabrakan."
        />

        <FAQItem
          question="Bagaimana caranya saya mendaftarkan diri?"
          answer="Kamu bisa mendaftarkan diri dengan membuat akun terlebih 
                  dahulu di platform kami. Setelah login, pilih lowongan magang yang kamu inginkan, lalu klik tombol “Daftar” 
                  atau “Lamar Sekarang”. Lengkapi data diri serta dokumen yang diminta seperti CV atau portofolio, kemudian kirim lamaranmu. 
                  Setelah itu, kamu tinggal menunggu informasi seleksi dari perusahaan terkait."
        />

        <FAQItem
          question="Bagaimana caranya saya dapat menghubungi perusahaan?"
          answer="Kamu dapat menghubungi perusahaan melalui fitur pesan atau kontak yang tersedia di halaman detail lowongan. 
                  Jika perusahaan mencantumkan alamat email, nomor telepon, atau tautan media sosial, kamu juga bisa menggunakan informasi tersebut untuk berkomunikasi langsung. 
                  Pastikan pesan yang kamu kirim sopan dan relevan dengan proses magang."
        />
      </div>
    </section>
  );
}

