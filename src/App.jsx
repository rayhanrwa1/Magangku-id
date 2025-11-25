import Index from "./pages";
import ProfilePage from "./pages/profilepage";
import PanduanPage from "./pages/panduanpage";

export default function App() {
  const path = window.location.pathname;

  if (path === "/profile" || path === "/profil") {
    return <ProfilePage />;
  } else if (path === "/panduan" || path === "/panduan") {
    return <PanduanPage />
  }

  // default = index
  return <Index />;
}
