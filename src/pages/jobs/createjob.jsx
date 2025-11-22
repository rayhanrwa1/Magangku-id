import Wrapper from "../../layout/wrapper";
import SEO from "../../common/seo";
import CreateJob from "../../components/jobs/createjobs";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Create Job - Mitra Magangku"} />
      <CreateJob />
    </Wrapper>
  );
};

export default index;
