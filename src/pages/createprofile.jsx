import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import CreateProfile from "../components/profile/createprofile/";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Create Profile - Mitra Magangku"} />
      <CreateProfile />
    </Wrapper>
  );
};

export default index;
