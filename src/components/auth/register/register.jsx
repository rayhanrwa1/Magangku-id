import React, { useState } from "react";
import Navbar from "../../../layout/navbarlogin";
import Footer from "../../../layout/footer";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import { getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nama || !form.email || !form.password || !form.konfirmasi) {
      alert("Semua field harus diisi!");
      return;
    }
    if (form.password !== form.konfirmasi) {
      alert("Password tidak sama!");
      return;
    }

    try {
      const auth = getAuth();
      const db = getDatabase(getApp());

      // 1. Buat akun Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const uid = userCred.user.uid;

      // 2. Simpan biodata ke Realtime Database
      await set(ref(db, "users/" + uid), {
        id: uid,
        nama: form.nama,
        email: form.email,
        userable_type: "user",
        userable_id: uid,
        created_at: new Date().toISOString(),
        verified: false,
      });

      alert("Register berhasil!");
      navigate("/login");

    } catch (err) {
      alert("Register gagal: " + err.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex flex-1 flex-col md:flex-row items-center px-4 md:px-8 justify-center gap-6 md:gap-8 w-full">
          {/* Gambar kiri */}
          <div className="w-full md:w-1/2 flex flex-col justify-between max-w-full md:max-w-md mb-6 md:mb-0">
            <img
              src="/img/HalamanLogin.png"
              alt="Register Illustration"
              className="rounded-xl object-cover w-full h-[220px] md:h-[400px] max-w-full"
            />
          </div>
          {/* Form Register */}
          <div className="w-full md:w-1/2 max-w-lg bg-white rounded-xl shadow-lg px-5 md:px-10 py-7 md:py-10 flex flex-col justify-start">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 font-medium">Nama Lengkap (sesuai KTP)</label>
                <input
                  name="nama"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 font-medium">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="mb-8">
                <label className="block mb-1 text-gray-700 font-medium">Konfirmasi Password</label>
                <input
                  name="konfirmasi"
                  type="password"
                  placeholder="Konfirmasi Password"
                  value={form.konfirmasi}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#446ED7] to-[#1EC6FF] text-white rounded-lg py-2 font-semibold"
              >
                Masuk
              </button>
            </form>
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-200"/>
              <span className="px-4 text-gray-400 text-sm">Atau</span>
              <hr className="flex-grow border-gray-200"/>
            </div>
            <div className="text-center text-base mt-2">
              SUdah Ada Akun Magangku ?{" "}
              <button
                type="button"
                className="text-[#243589] font-semibold hover:underline"
                onClick={() => navigate('/login')}
              >
                Login disini
              </button>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
}
