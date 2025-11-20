export default function Faqsection() {
  return (
    <section className="px-12 py-20">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Pertanyaan yang Sering Ditanyakan
      </h2>

      <div className="space-y-4">
        <div className="p-4 border rounded-xl shadow hover:bg-gray-50">
          Apakah saya bisa mendaftar lebih dari satu lowongan?
        </div>
        <div className="p-4 border rounded-xl shadow hover:bg-gray-50">
          Bagaimana caranya saya mendaftarkan diri?
        </div>
        <div className="p-4 border rounded-xl shadow hover:bg-gray-50">
          Bagaimana cara menghubungi perusahaan?
        </div>
      </div>
    </section>
  );
}
