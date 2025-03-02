import { getPlaiceholder } from "plaiceholder";

export const getBlurData = async (imageUrl: string) => {
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.statusText}`);
  }

  const buffer = await res.arrayBuffer();
  const { base64 } = await getPlaiceholder(Buffer.from(buffer));

  return base64;
};
