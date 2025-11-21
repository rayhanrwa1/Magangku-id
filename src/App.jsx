import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/index";
import Register from "./pages/register";
import LupaPassword from "./pages/lupapassword"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lupapassword" element={<LupaPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
