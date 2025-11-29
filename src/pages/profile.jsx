import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Profile from "../components/lowongan/index";

const Index = () => {
  return (
    <Wrapper>
      <SEO
        title="Profile"
        description="Temukan lowongan magang terbaik di Magangku."
        keywords="magang, internship, mahasiswa, perusahaan"
      />
      <Profile />
    </Wrapper>
  );
};

export default Index;
