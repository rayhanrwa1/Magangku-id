import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import LupaPassword from "../components/auth/forgotpassword";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Lupa Password"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <LupaPassword />
    </Wrapper>
  );
};

export default Index;
