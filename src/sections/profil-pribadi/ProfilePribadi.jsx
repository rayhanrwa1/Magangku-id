import { useState } from "react";
import DataKosong from "./DataKosong";
import FormDataPribadi from "./FormDataPribadi";

import DataAkademikKosong from "./DataAkademikKosong";
import FormDataAkademik from "./FormDataAkademik";

export default function ProfilPribadi() {
  const [tab, setTab] = useState("pribadi");
  const [isFilledPribadi, setIsFilledPribadi] = useState(false);
  const [isFilledAkademik, setIsFilledAkademik] = useState(false);
  const isEditing = isFilledPribadi || isFilledAkademik;

  const handleTabChange = (selectedTab) => {
    // Jika sedang mengedit (salah satu form terbuka), cegah perpindahan
    if (isEditing) {
      alert("Selesaikan atau batalkan pengisian data terlebih dahulu sebelum berpindah tab!");
      return;
    }
    setTab(selectedTab);
  };

  return (
    <div className="w-full min-h-screen font-sans">

      {/* ------ Banner ------- */}
      <img
        src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
        className="w-full h-64 object-cover"
      />

      {/* ------ Foto + Nama ------- */}
      <div className="max-w-5xl mx-auto flex gap-6 mt-[-20px] px-4">
        <img
          src="/img/default-profile.png" 
          className="w-42 h-64 rounded-xl border-4 border-white object-cover bg-white mt-[-50px]"
        />
        <div className="flex flex-col justify-center mt-[-40px]">
          <h1 className="text-3xl font-semibold">FARRAS SANDY HARSOYO</h1>
          <p className="text-gray-600">Student</p>
        </div>
      </div>

      {/* ------ Tab ------- */}
      <div className="max-w-5xl mx-auto mt-8 px-4 flex gap-8 border-b pb-3">
        <button
          onClick={() => setTab("pribadi")}
          className={
            tab === "pribadi"
              ? "text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
              : "text-gray-500"
          }
        >
          Data Pribadi
        </button>

        <button
          onClick={() => setTab("akademik")}
          className={
            tab === "akademik"
              ? "text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
              : "text-gray-500"
          }
        >
          Data Akademik
        </button>
      </div>

      {/* ------ Content ------- */}
      <div className="max-w-5xl mx-auto mt-6 px-4 mb-20">
        {tab === "pribadi" ? (
          isFilledPribadi ? (
            <FormDataPribadi onBack={() => setIsFilledPribadi(false)} />
          ) : (
            <DataKosong onFill={() => setIsFilledPribadi(true)} />
          )
        ) : tab === "akademik" ? (
          isFilledAkademik ? (
            <FormDataAkademik onBack={() => setIsFilledAkademik(false)} />
          ) : (
            <DataAkademikKosong onFill={() => setIsFilledAkademik(true)} />
          )
        ) : null}
      </div>
    </div>
  );
}
