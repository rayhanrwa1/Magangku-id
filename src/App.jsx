import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/";
import Login from "./pages/login";
import Home from "./pages";
import LowonganPage from "./pages/lowongan";   
import Tentang_Kammi from "./components/tentang_kami";
import Pusat_Privasi from "./components/pusat_privasi";
import Register from "./pages/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/lowongan" element={<LowonganPage />} />
        <Route path="/lowongan/:jobId" element={<LowonganPage />} />
        <Route path="/tentang_kami" element={<Tentang_Kammi />} />
        <Route path="/pusat_privasi" element={<Pusat_Privasi />} />
      </Routes>
    </BrowserRouter>
  );
}
