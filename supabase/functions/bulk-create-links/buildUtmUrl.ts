/**
 * Builds a URL with UTM parameters appended
 */
export function buildUtmUrl(
  url: string,
  utmParams: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  }
): string {
  try {
    const urlObj = new URL(url);
    
    // Add UTM parameters
    if (utmParams.utm_source) {
      urlObj.searchParams.set("utm_source", utmParams.utm_source);
    }
    if (utmParams.utm_medium) {
      urlObj.searchParams.set("utm_medium", utmParams.utm_medium);
    }
    if (utmParams.utm_campaign) {
      urlObj.searchParams.set("utm_campaign", utmParams.utm_campaign);
    }
    if (utmParams.utm_term) {
      urlObj.searchParams.set("utm_term", utmParams.utm_term);
    }
    if (utmParams.utm_content) {
      urlObj.searchParams.set("utm_content", utmParams.utm_content);
    }
    
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, return original URL
    return url;
  }
}
