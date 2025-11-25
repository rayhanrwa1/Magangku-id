import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Lowongan from "../components/lowongan/index";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Lowongan"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Lowongan />
    </Wrapper>
  );
};

export default Index;
