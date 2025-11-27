import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages";
import LowonganPage from "./pages/lowongan";
import Tentang_Kammi from "./components/tentang_kami";
import Pusat_Privasi from "./components/pusat_privasi";
import Syarat_Ketentuan from "./components/syarat_ketentuan"

// Halaman milik kamu (dari HEAD)
import ProfilePage from "./pages/profilepage";
import PanduanPage from "./pages/panduanpage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routing dari tim */}
        <Route path="/" element={<Home />} />
        <Route path="/lowongan" element={<LowonganPage />} />
        <Route path="/lowongan/:jobId" element={<LowonganPage />} />
        <Route path="/tentang_kami" element={<Tentang_Kammi />} />
        <Route path="/pusat_privasi" element={<Pusat_Privasi />} />
        <Route path="/syarat_ketentuan" element={<Syarat_Ketentuan />} />
        {/* Routing halaman kamu */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/panduan" element={<PanduanPage />} />
      </Routes>
    </BrowserRouter>
  );
}
