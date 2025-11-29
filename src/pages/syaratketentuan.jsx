import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Syarat_Ketentuan from "../components/syarat_ketentuan"

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Syarat dan Ketentuan"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Syarat_Ketentuan />
    </Wrapper>
  );
};

export default Index;
