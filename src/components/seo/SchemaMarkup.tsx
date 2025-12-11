import { Helmet } from 'react-helmet';

interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url?: string;
}

export const ArticleSchema = ({
  headline,
  description,
  datePublished,
  dateModified,
  author = 'utm.one',
  url
}: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'utm.one',
      logo: {
        '@type': 'ImageObject',
        url: 'https://utm.one/logo.png'
      }
    },
    datePublished,
    dateModified: dateModified || datePublished,
    url: url || `https://utm.one${window.location.pathname}`
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}

export const HowToSchema = ({ name, description, steps, totalTime }: HowToSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface DefinedTermSchemaProps {
  term: string;
  description: string;
  category?: string;
}

export const DefinedTermSchema = ({ term, description, category }: DefinedTermSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description,
    inDefinedTermSet: category,
    url: `https://utm.one${window.location.pathname}`
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface FAQSchemaProps {
  questions: { question: string; answer: string }[];
}

export const FAQSchema = ({ questions }: FAQSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface ItemListSchemaProps {
  name: string;
  description: string;
  items: { name: string; url: string; description?: string }[];
}

export const ItemListSchema = ({ name, description, items }: ItemListSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      description: item.description
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface DataDownloadSchemaProps {
  name: string;
  description: string;
  contentUrl: string;
  encodingFormat: string;
}

export const DataDownloadSchema = ({ name, description, contentUrl, encodingFormat }: DataDownloadSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DataDownload',
    name,
    description,
    contentUrl,
    encodingFormat
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface WebPageSchemaProps {
  name: string;
  description: string;
  url?: string;
}

export const WebPageSchema = ({ name, description, url }: WebPageSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: url || `https://utm.one${window.location.pathname}`,
    publisher: {
      '@type': 'Organization',
      name: 'utm.one'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface ProductSchemaProps {
  name: string;
  description: string;
  brand?: string;
  url?: string;
  image?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export const ProductSchema = ({ 
  name, 
  description, 
  brand = 'utm.one',
  url,
  image,
  aggregateRating
}: ProductSchemaProps) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    url: url || `https://utm.one${window.location.pathname}`
  };

  if (image) {
    schema.image = image;
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
