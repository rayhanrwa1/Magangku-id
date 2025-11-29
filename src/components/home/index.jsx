// src/components/home/index.jsx
import { useEffect, useState } from 'react';
import HeroSection from '../../sections/home/herosection';
import JobSection from '../../sections/home/jobsection';
import FaqSection from '../../sections/home/faqsection';
import Footer from '../../layout/footer';

import Navbar from '../../layout/navbar';
import NavbarLogin from '../../layout/navbarlogin';

import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '../../database/firebase';

const Index = () => {
	const [user, setUser] = useState(null); // data dari Firebase Auth
	const [userData, setUserData] = useState(null); // data dari Realtime DB
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);

				// ambil data detail di Realtime DB: /users/{uid}
				try {
					const userRef = ref(db, `users/${firebaseUser.uid}`);
					const snap = await get(userRef);
					if (snap.exists()) {
						setUserData(snap.val());
					} else {
						setUserData(null);
					}
				} catch (err) {
					console.error('Gagal ambil data user:', err);
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
			{/* kirim data user ke navbar login jika perlu */}
			<NavbarComponent
				user={user}
				userData={userData}
			/>
			<HeroSection />
			<JobSection />
			<FaqSection />
			<Footer />
		</>
	);
};

export default Index;
