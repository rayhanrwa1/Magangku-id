import React from "react";
import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Home from "../components/home";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={""} />
      <Home />
    </Wrapper>
  );
};

export default index;
