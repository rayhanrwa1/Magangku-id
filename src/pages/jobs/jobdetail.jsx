import Wrapper from "../../layout/wrapper";
import SEO from "../../common/seo";
import DetailJob from "../../components/jobs/viewjobs";

const DetailJobs = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Detail Job - Mitra Magangku"} />
      <DetailJob />
    </Wrapper>
  );
};

export default DetailJobs;
