import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Home from "../components/auth/forgotpassword";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Forgot Password"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Home />
    </Wrapper>
  );
};

export default Index;
