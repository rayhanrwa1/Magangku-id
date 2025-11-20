import MainLayout from "../layout/MainLayout";
import HeroSection from "../sections/HeroSection";
import JobSection from "../sections/JobSection";
import FAQSection from "../sections/FAQSection";
import Footer from "../components/Footer";


export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <JobSection />
      <FAQSection />
    </MainLayout>
  );
}
