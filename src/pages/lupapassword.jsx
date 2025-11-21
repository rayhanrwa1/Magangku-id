import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import LupaPassword from "../components/auth/lupapassword";

const LupaPasswordPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Lupa Password - Admin Magangku"} />
      <LupaPassword />
    </Wrapper>
  );
};

export default LupaPasswordPage;
