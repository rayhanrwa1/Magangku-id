import { useEffect, useState } from "react";
import Navbar from "../../layout/navbar";
import NavbarLogin from "../../layout/navbarlogin";
import Footer from "../../layout/footer";
import Panduan from "../../sections/panduan/panduan";

import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../../database/firebase";

export default function PanduanPage() {
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
      <Panduan />
      <Footer />
    </>
  );
}
