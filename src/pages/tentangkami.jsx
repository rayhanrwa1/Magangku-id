import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Tentang_Kami from "../components/tentang_kami/index"

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Lowongan"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Tentang_Kami />
    </Wrapper>
  );
};

export default Index;
