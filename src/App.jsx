import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/";
import Login from "./components/auth/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
