import Wrapper from "../layout/wrapper";
import SEO from "../layout/seo";
import Home from "../components/home/index";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Beranda"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Home />
    </Wrapper>
  );
};

export default Index;
