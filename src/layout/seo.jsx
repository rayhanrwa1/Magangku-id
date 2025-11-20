import { Helmet } from "react-helmet";

export default function SEO({ title, description, keywords, image }) {
  const pageTitle = title ? `${title} | Magangku` : "Magangku";
  const pageDescription =
    description ||
    "Platform pencarian magang terbaik untuk mahasiswa Indonesia.";
  const pageKeywords =
    keywords || "magang, internship, lowongan magang, karier mahasiswa";
  const pageImage = image || "/img/seo-default.png";

  return (
    <Helmet>
      <title>{pageTitle}</title>

      {/* Basic SEO */}
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
