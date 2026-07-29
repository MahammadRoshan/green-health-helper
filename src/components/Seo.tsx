import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://green-health-helper.lovable.app";

type SeoProps = {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

/**
 * The static index.html ships fallback og:/twitter: tags for non-JS social
 * crawlers. Once Helmet renders route-specific ones, drop the static copies so
 * each route exposes exactly one self-referencing set.
 */
const useDedupeStaticTags = () => {
  useEffect(() => {
    document
      .querySelectorAll(
        'head meta[property^="og:"]:not([data-rh]), head meta[name^="twitter:"]:not([data-rh]), head link[rel="canonical"]:not([data-rh])',
      )
      .forEach((el) => el.remove());
  }, []);
};

const Seo = ({ title, description, path, jsonLd, noindex }: SeoProps) => {
  useDedupeStaticTags();

  const url = `${SITE_URL}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Green Health" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
