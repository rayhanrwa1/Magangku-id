import Wrapper from "../../layout/wrapper";
import SEO from "../../common/seo";
import Job from "../../components/jobs";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Create Job - Mitra Magangku"} />
      <Job />
    </Wrapper>
  );
};

export default index;
