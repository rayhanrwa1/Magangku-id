import React from "react";
import Navbar from "../../layout/navbar/navbar";
import Sidebar from "../../layout/sidebar/sidebar";

function Home() {
  const handleMenuChange = (key) => {
    console.log("pindah menu:", key);
  };

  const handleLogout = () => {
    console.log("logout diklik");
  };

  const handleToggleSidebar = () => {
    console.log("toggle sidebar mobile");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar
          activeKey="dashboard"
          onChangeMenu={handleMenuChange}
          onLogout={handleLogout}
        />
      </div>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        <Navbar
          mitraName="PT Contoh Mitra"
          mitraEmail="hrd@contohmitra.com"
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
        />
        <main className="p-4">
          <p className="text-slate-700">Area konten untuk preview.</p>
        </main>
      </div>
    </div>
  );
}

export default Home;
