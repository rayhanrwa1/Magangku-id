import Navbar from "../../layout/navbar";
import HeroAbout from "../../sections/tentang_kami/heroabout";
import About from "../../sections/tentang_kami/about";
import VisiMisi from "../../sections/tentang_kami/visimisi";
import Program from "../../sections/tentang_kami/program";
import Footer from "../../layout/footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <HeroAbout />
      <About />
      <VisiMisi />
      <Program />
      <Footer />
    </>
  );
};

export default Index;