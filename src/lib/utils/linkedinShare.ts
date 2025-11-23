import { toPng } from 'html-to-image';

export const shareOnLinkedIn = (text: string) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(window.location.href);
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
    '_blank',
    'width=600,height=600'
  );
};

export const downloadCardAsImage = async (
  cardId: string,
  filename: string = 'linkedin-post.png'
) => {
  const element = document.getElementById(cardId);
  if (!element) {
    console.error('Card element not found');
    return;
  }

  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      width: 1200,
      height: 1200,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  }
};
