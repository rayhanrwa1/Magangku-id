import Wrapper from "../../layout/wrapper";
import SEO from "../../common/seo";
import EditJobForm from "../../components/jobs/editjobs";

const EditJobPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Edit Job - Mitra Magangku"} />
      <EditJobForm />
    </Wrapper>
  );
};

export default EditJobPage;
