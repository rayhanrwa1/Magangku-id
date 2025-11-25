import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Pusat_Privasi from "../components/pusat_privasi"

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Pusat Privasi"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Pusat_Privasi />
    </Wrapper>
  );
};

export default Index;
