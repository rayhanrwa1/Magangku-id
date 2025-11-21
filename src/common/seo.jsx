import React, { useEffect } from "react";

const SEO = ({ pageTitle, description, keywords }) => {
  useEffect(() => {
    
    document.title = pageTitle
      ? `${pageTitle} | Admin Dashboard`
      : "Admin Dashboard";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || "Dashboard Admin - Magangku Mitra";

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords || "admin, dashboard, management";
  }, [pageTitle, description, keywords]);

  return null;
};

export default SEO;
