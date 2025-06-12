import { getPlaiceholder } from "plaiceholder";

export const getBlurData = async (imageUrl: string) => {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return base64;
  } catch (error) {
    console.error('Error generating blur data:', error);
    // Return a default blur data URL for error cases
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0CkAAAAASUVORK5CYII=';
  }
};

export const generateBlurDataForImages = async (images: { url: string }[]) => {
  try {
    const blurDataPromises = images.map(image => getBlurData(image.url));
    const blurDataResults = await Promise.all(blurDataPromises);
    
    return images.map((image, index) => ({
      ...image,
      blurDataURL: blurDataResults[index]
    }));
  } catch (error) {
    console.error('Error generating blur data for images:', error);
    return images;
  }
};
