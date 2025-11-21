import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Login from "../components/login";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Index - Admin Magangku"} />
      <Login />
    </Wrapper>
  );
};

export default index;
