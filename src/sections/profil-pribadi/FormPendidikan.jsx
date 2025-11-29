import React, { useState } from 'react';

const FormPendidikan = ({ onCancel, onSave }) => {
  // State untuk menyimpan nilai form
  const [formData, setFormData] = useState({
    jenjang: '',
    perguruanTinggi: '',
    ipk: '',
    programStudi: '',
    statusPendidikan: '',
    dokumen: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, dokumen: file.name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Disini logika simpan ke API bisa dimasukkan
    console.log("Data Disimpan:", formData);
    
    // Panggil fungsi onSave dari parent untuk menutup form/refresh data
    if (onSave) onSave(); 
  };

  return (
    <div className="w-full">
       {/* Container disamakan style-nya dengan parent agar konsisten */}
       <div className="max-w-5xl mx-auto mt-10 px-6 py-10 bg-white shadow-sm rounded-3xl border font-poppins">
        
        {/* Header Form */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Pendidikan</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Tambahkan riwayat pendidikan kamu untuk menambah peluang di Magangku
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            
            {/* Jenjang Pendidikan */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-medium text-sm md:text-base">Jenjang Pendidikan</label>
              <div className="relative">
                <select 
                  name="jenjang" 
                  value={formData.jenjang} 
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Jenjang Pendidikan</option>
                  <option value="D3">D3 - Diploma 3</option>
                  <option value="D4">D4 - Sarjana Terapan</option>
                  <option value="S1">S1 - Sarjana</option>
                  <option value="S2">S2 - Magister</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Perguruan Tinggi */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-medium text-sm md:text-base">Perguruan Tinggi</label>
              <div className="relative">
                <select 
                  name="perguruanTinggi" 
                  value={formData.perguruanTinggi} 
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Perguruan Tinggi</option>
                  <option value="UI">Universitas Muhammadiyah Malang</option>
                  <option value="UI">Universitas Indonesia</option>
                  <option value="UGM">Universitas Gadjah Mada</option>
                  <option value="ITB">Institut Teknologi Bandung</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                 <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* IPK */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-medium text-sm md:text-base">IPK</label>
              <input 
                type="text" 
                name="ipk" 
                placeholder="Masukan IPK anda"
                value={formData.ipk}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Program Studi */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-medium text-sm md:text-base">Program Studi</label>
               <div className="relative">
                <select 
                  name="programStudi" 
                  value={formData.programStudi} 
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Program Studi</option>
                  <option value="Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Manajemen">Manajemen</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Status Pendidikan */}
            <div className="flex flex-col gap-2 md:col-start-2">
              <label className="text-gray-800 font-medium text-sm md:text-base">Status Pendidikan</label>
              <div className="relative">
                <select 
                  name="statusPendidikan" 
                  value={formData.statusPendidikan} 
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Status Pendidikan</option>
                  <option value="Sedang Menempuh">Sedang Menempuh</option>
                  <option value="Lulus">Lulus</option>
                </select>
                 <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Dokumen Pendukung */}
            <div className="mt-6">
            <h3 className="text-gray-800 font-medium text-sm md:text-base mb-1">Dokumen Pendukung</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-3">
                Tambahkan media pendukung seperti ijazah ataupun surat keterangan Lulus (SKL). Ukuran file tidak boleh melebihi 1Mb.
            </p>
            
            {/* 1. Input File Asli (DISEMBUNYIKAN TOTAL) */}
            <input 
                type="file" 
                id="upload-dokumen" // ID ini harus sama dengan htmlFor di bawah
                className="hidden" // Class tailwind untuk hide
                style={{ display: 'none' }} // Double check agar benar-benar hilang
                accept=".pdf,.jpg,.jpeg,.png" // Opsional: membatasi tipe file
                onChange={handleFileChange}
            />
            
            {/* 2. Tombol Custom (YANG TERLIHAT) */}
            <label 
                htmlFor="upload-dokumen" 
                className="w-fit flex flex-row items-center gap-2 mt-2 px-4 py-2 border border-[#446ED7] text-[#446ED7] rounded-lg cursor-pointer hover:bg-blue-50 transition-colors font-medium text-sm whitespace-nowrap"
            >
                {/* Icon Plus */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Tambahkan Data
            </label>
            
            {/* Preview Nama File (Muncul setelah pilih file) */}
            {formData.dokumen && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 w-fit">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span className="truncate max-w-xs">{formData.dokumen}</span>
                {/* Tombol Hapus File (Opsional) */}
                <button 
                    type="button" 
                    onClick={() => setFormData({...formData, dokumen: null})}
                    className="text-red-500 hover:text-red-700 ml-2 font-bold"
                >
                    &times;
                </button>
                </div>
            )}
            </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-4 mt-10 pt-4">
            <button 
              type="button"
              onClick={onCancel} // Trigger fungsi cancel dari parent
              className="px-6 py-1.5 rounded-lg border border-red-500 text-red-500 font-medium text-lg hover:bg-red-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-6 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FormPendidikan;