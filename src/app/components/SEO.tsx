import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const baseTitle = "PPI AIU - Perhimpunan Pelajar Indonesia AIU";
    if (title) {
      document.title = `${title} | PPI AIU`;
    } else {
      document.title = baseTitle;
    }

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      }
    }
  }, [title, description]);

  return null;
}
