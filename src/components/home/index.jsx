import HeroSection from "../../sections/herosection";
import JobSection from "../../sections/jobsection";
import FaqSection from "../../sections/faqsection";
import Footer from "../../layout/footer";
import Navbar from "../../layout/navbar";

const Index = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <JobSection />
      <FaqSection />
      <Footer />
    </>
  );
};

export default Index;
