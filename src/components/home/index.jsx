import HeroSection from "../../sections/home/herosection";
import JobSection from "../../sections/home/jobsection";
import FaqSection from "../../sections/home/faqsection";
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
