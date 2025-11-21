import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Login from "../components/auth/login";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Index - Mitra Magangku"} />
      <Login />
    </Wrapper>
  );
};

export default index;
