import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Chat from "../components/chat/module";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Chat - Mitra Magangku"} />
      <Chat />
    </Wrapper>
  );
};

export default index;
