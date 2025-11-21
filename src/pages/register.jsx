import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Login from "../components/auth/register";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Register - Admin Magangku"} />
      <Login />
    </Wrapper>
  );
};

export default index;
