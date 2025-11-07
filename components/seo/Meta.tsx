
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BRAND_NAME, SITE_URL } from '../../constants';

interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const Meta: React.FC<MetaProps> = ({ title, description, image, url }) => {
  const pageTitle = title ? `${title} | ${BRAND_NAME}` : `${BRAND_NAME} | Woven with Culture. Designed for Today.`;
  const pageDescription = description || "Experience the elegance of handcrafted Aso-Oke woven with precision, passion, and pride. Rightyway blends timeless Yoruba weaving artistry with modern fashion creativity.";
  const pageUrl = `${SITE_URL}${url || ''}`;
  const pageImage = image || `${SITE_URL}/og-image.jpg`; // A default OG image

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />
    </Helmet>
  );
};

export default Meta;
