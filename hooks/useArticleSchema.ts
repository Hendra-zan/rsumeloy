"use client";

import { useEffect } from 'react';

interface ArticleSchema {
  "@context": string;
  "@type": string;
  headline: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": string;
    name: string;
    url: string;
  };
  publisher: {
    "@type": string;
    name: string;
    logo: {
      "@type": string;
      url: string;
    };
  };
  description: string;
  image: string;
  mainEntityOfPage: {
    "@type": string;
    "@id": string;
  };
}

export function useArticleSchema(article: {
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  url: string;
}) {
  useEffect(() => {
    const articleSchema: ArticleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      datePublished: article.date,
      dateModified: article.date,
      author: {
        "@type": "Person",
        name: article.author,
        url: "https://rsumeloy.com/tentang"
      },
      publisher: {
        "@type": "Organization",
        name: "RSU Meloy",
        logo: {
          "@type": "ImageObject",
          url: "https://res.cloudinary.com/ddyqhlilj/image/upload/logo_rsmeloy_web"
        }
      },
      description: article.description,
      image: article.image || "https://res.cloudinary.com/ddyqhlilj/image/upload/hospital_default",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": article.url
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [article]);
}