import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Login from "../components/auth/login/index";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Login"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Login />
    </Wrapper>
  );
};

export default Index;
