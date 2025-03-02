import { fetchData } from "@/libs/api";
import { ColorPalette, SocialLinks } from "@/libs/interfaces";

export const fetchColors = async (): Promise<ColorPalette> => {
  const data = await fetchData<{ meta: ColorPalette }>("color_palette");
  return data.meta;
};

export const fetchSocialLinks = async (): Promise<SocialLinks> => {
  const data = await fetchData<SocialLinks>("social-links");
  return data;
};
