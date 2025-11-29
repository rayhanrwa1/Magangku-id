import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Panduan from "../components/panduan/";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Panduan"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Panduan />
    </Wrapper>
  );
};

export default Index;
