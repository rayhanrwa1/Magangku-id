import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Register from "../components/auth/register";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Register"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Register />
    </Wrapper>
  );
};

export default Index;
