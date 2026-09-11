import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO: React.FC = () => {
  const title = "Dr. Hauwa | Diaspora Wealth Network";
  const description = "Helping immigrants and diaspora professionals build careers, income, influence and lasting wealth through strategy and meaningful connections.";
  const url = "https://drhauwaphd.com";
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* Assuming a generated OG image path */}
      <meta property="og:image" content={`${url}/dr-hauwa.jpg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}/dr-hauwa.jpg`} />

      {/* Structured Data (Schema.org) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Dr. Hauwa",
          "url": url,
          "image": `${url}/dr-hauwa.jpg`,
          "jobTitle": "Founder",
          "worksFor": {
            "@type": "Organization",
            "name": "Diaspora Wealth Network"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
