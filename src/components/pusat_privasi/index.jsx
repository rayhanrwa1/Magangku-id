import Navbar from "../../layout/navbar";
import PrivacyHero from "../../sections/pusat_privasi/privacyhero";
import PrivacyContent from "../../sections/pusat_privasi/privacycontent";
import Footer from "../../layout/footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <PrivacyHero />
      <PrivacyContent />
      <Footer />
    </>
  );
};

export default Index;