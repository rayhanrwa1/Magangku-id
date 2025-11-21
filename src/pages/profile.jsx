import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Login from "../components/profile/profile";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Profile - Mitra Magangku"} />
      <Login />
    </Wrapper>
  );
};

export default index;
