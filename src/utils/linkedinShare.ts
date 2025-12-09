export const shareToLinkedIn = (text: string) => {
  const encodedText = encodeURIComponent(text);
  const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};