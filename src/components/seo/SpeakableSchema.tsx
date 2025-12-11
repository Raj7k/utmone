import { Helmet } from 'react-helmet';

interface SpeakableSchemaProps {
  headline: string;
  summary: string;
  url?: string;
  cssSelectors?: string[];
}

/**
 * SpeakableSchema component for voice search optimization
 * Marks content as suitable for reading aloud by voice assistants
 * (Google Assistant, Alexa, Siri)
 */
export const SpeakableSchema = ({ 
  headline, 
  summary, 
  url,
  cssSelectors = ['article', '.speakable-content', 'h1', 'h2']
}: SpeakableSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: headline,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors
    },
    url: url || `https://utm.one${typeof window !== 'undefined' ? window.location.pathname : ''}`
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

interface SpeakableArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  speakableSections?: string[];
  url?: string;
}

/**
 * Combined Article + Speakable schema for voice-optimized articles
 */
export const SpeakableArticleSchema = ({
  headline,
  description,
  datePublished,
  dateModified,
  author = 'utm.one',
  speakableSections = ['article', 'h1', 'h2', '.summary'],
  url
}: SpeakableArticleSchemaProps) => {
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
    url: url || `https://utm.one${typeof window !== 'undefined' ? window.location.pathname : ''}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableSections
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
