import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages";
import Lowongan from "./pages/lowongan";
import Tentang_Kammi from "./components/tentang_kami";
import JobDetail from "./sections/lowongan/jobdetail";
import Pusat_Privasi from "./components/pusat_privasi"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lowongan" element={<Lowongan />} />
        <Route path="/lowongan/:jobId" element={<JobDetail />} />
        <Route path="/tentang_kami" element={<Tentang_Kammi />} />
        <Route path="/pusat_privasi" element={<Pusat_Privasi />} />
      </Routes>
    </BrowserRouter>
  );
}
