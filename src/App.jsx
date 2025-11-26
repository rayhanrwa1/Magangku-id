import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages";
import LowonganPage from "./pages/lowongan";   
import Tentang_Kammi from "./components/tentang_kami";
import Pusat_Privasi from "./components/pusat_privasi";
import Syarat_Ketentuan from "./components/syarat_ketentuan"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lowongan" element={<LowonganPage />} />
        <Route path="/lowongan/:jobId" element={<LowonganPage />} />
        <Route path="/tentang_kami" element={<Tentang_Kammi />} />
        <Route path="/pusat_privasi" element={<Pusat_Privasi />} />
        <Route path="/syarat_ketentuan" element={<Syarat_Ketentuan />} />
      </Routes>
    </BrowserRouter>
  );
}
