import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/index";
import Register from "./pages/register";
import LupaPassword from "./pages/lupapassword";
import Profile from "./pages/profile";
import CreateProfile from "./pages/createprofile";
import Createjob from "./pages/jobs/createjob";
import Job from "./pages/jobs/jobs";
import DetailJobs from "./pages/jobs/jobdetail";
import EditJobPage from "./pages/jobs/editjob";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lupapassword" element={<LupaPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/createjob" element={<Createjob />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/jobs/:id" element={<DetailJobs />} />
        <Route path="/jobs/:id/edit" element={<EditJobPage />} />
      </Routes>
    </BrowserRouter>
  );
}
