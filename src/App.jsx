import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/";
import Login from "./pages/login";
import AlertContainer from "./utils/usealert_utils.jsx";
import LowonganPage from "./pages/lowongan";
import Tentang_Kammi from "./pages/tentangkami";
import Pusat_Privasi from "./pages/pusatprivasi";
import Syarat_Ketentuan from "./pages/syaratketentuan"
import Register from "./pages/register";
import ProfilePage from "./pages/profilepage";
import PanduanPage from "./pages/panduanpage";

export default function App() {
  return (
    <BrowserRouter>
      <AlertContainer />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lowongan" element={<LowonganPage />} />
        <Route path="/lowongan/:jobId" element={<LowonganPage />} />
        <Route path="/tentang_kami" element={<Tentang_Kammi />} />
        <Route path="/pusat_privasi" element={<Pusat_Privasi />} />
        <Route path="/syarat_ketentuan" element={<Syarat_Ketentuan />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/panduan" element={<PanduanPage />} />
      </Routes>
    </BrowserRouter>
  );
}
