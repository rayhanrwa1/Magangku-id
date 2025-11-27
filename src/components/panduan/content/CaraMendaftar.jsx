import React from 'react';

const CaraMendaftar = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Mendaftar Program Magangku</h2>

      <div className="space-y-10">
        
        {/* Step 1 */}
        <div className="flex flex-col gap-4">
          <p className="text-gray-800 text-base">
            1. Buat akun untuk melanjutkan pendaftaran pada menu "Masuk ke Akun".
          </p>
          {/* Placeholder Image - Ganti src dengan screenshot dashboard magangku */}
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
             <img 
               src="/img/step-1-register.png"
               alt="Ilustrasi Masuk ke Akun" 
               className="w-full h-auto object-cover"
             />
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col gap-4">
          <p className="text-gray-800 text-base leading-relaxed">
            2. Selanjutnya, klik lowongan. Apabila muncul pemberitahuan (alert) yang mengarahkan Anda untuk melengkapi data, silahkan klik "Lengkapi data diri" dan isi secara lengkap semua kolom dibagian "Data Pribadi" dan "Data Akademik".
          </p>
           {/* Placeholder Image - Ganti src dengan screenshot alert lengkapi data */}
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
             <img 
               src="/img/step-2-alert.png"
               alt="Ilustrasi Lengkapi Data" 
               className="w-full h-auto object-cover"
             />
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col gap-4">
          <p className="text-gray-800 text-base">
            3. Terakhir kamu bisa memilih lowongan magang yang sesuai dengan jurusan kamu, lalu klik "Daftar Sekarang".
          </p>
           {/* Placeholder Image - Ganti src dengan screenshot daftar lowongan */}
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
             <img 
               src="/img/step-3-apply.png"
               alt="Ilustrasi Daftar Sekarang" 
               className="w-full h-auto object-cover"
             />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CaraMendaftar;