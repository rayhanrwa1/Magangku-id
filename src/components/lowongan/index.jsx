// src/components/lowongan/index.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../layout/navbar";
import NavbarLogin from "../../layout/navbarlogin";

import HeaderSearch from "../../sections/lowongan/headersearch";
import ListLowongan from "../../sections/lowongan/listlowongancard";
import JobDetail from "../../sections/lowongan/jobdetail";
import Footer from "../../layout/footer";

import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../../database/firebase";

export default function LowonganPage() {
  const { jobId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userRef = ref(db, `users/${firebaseUser.uid}`);
          const snap = await get(userRef);
          if (snap.exists()) {
            setUserData(snap.val());
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error("Gagal ambil data user:", err);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat...</p>
      </div>
    );
  }

  const NavbarComponent = user ? NavbarLogin : Navbar;

  return (
    <>
      {/* kirim user dan userData ke navbar login */}
      <NavbarComponent user={user} userData={userData} />

      <HeaderSearch onSearch={(value) => setSearchTerm(value.toLowerCase())} />

      <div className="px-4 lg:px-12 mt-6 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ListLowongan searchTerm={searchTerm} />
        </div>
        <div className="lg:col-span-2">
          {jobId ? (
            <JobDetail />
          ) : (
            <div className="text-gray-400 text-center mt-20">
              Pilih lowongan untuk melihat detail
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
