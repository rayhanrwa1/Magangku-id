import { useEffect, useState } from "react";
import Navbar from "../../layout/navbar";
import NavbarLogin from "../../layout/navbarlogin";
import HeroAbout from "../../sections/tentang_kami/heroabout";
import About from "../../sections/tentang_kami/about";
import VisiMisi from "../../sections/tentang_kami/visimisi";
import Program from "../../sections/tentang_kami/program";
import Footer from "../../layout/footer";

import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../../database/firebase";

const Index = () => {
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
      <NavbarComponent user={user} userData={userData} />
      <HeroAbout />
      <About />
      <VisiMisi />
      <Program />
      <Footer />
    </>
  );
};

export default Index;
