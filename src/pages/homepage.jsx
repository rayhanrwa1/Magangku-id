import mainlayout from "../layout/mainlayout";
import herosection from "../sections/herosection";
import jobsection from "../sections/jobsection";
import faqsection from "../sections/faqsection";
import footer from "../layout/footer";


export default function homepage() {
  return (
    <mainlayout>
      <herosection />
      <jobsection />
      <faqsection />
    </mainlayout>
  );
}
