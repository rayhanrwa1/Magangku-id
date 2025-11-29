import Navbar from "../../layout/navbar";
import SyaratHero from "../../sections/syarat_ketentuan/syarathero";
import SyaratContent from "../../sections/syarat_ketentuan/syaratcontent";
import Footer from "../../layout/footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <SyaratHero />
      <SyaratContent />
      <Footer />
    </>
  );
};

export default Index;