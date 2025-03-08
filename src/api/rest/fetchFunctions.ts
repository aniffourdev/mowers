import { fetchData, fetchCustomData } from "@/libs/api";
import { ColorPalette, SocialLinks, ContactInfos, AboutInfos } from "@/libs/interfaces";

// Fetch colors using /wp/v2
export const fetchColors = async (): Promise<ColorPalette> => {
    const data = await fetchData<{ meta: ColorPalette }>("color_palette");
    return data.meta;
};

// Fetch social links using /wp/v2
export const fetchSocialLinks = async (): Promise<SocialLinks> => {
    const data = await fetchData<SocialLinks>("social-links");
    return data;
};

// Fetch contact infos using /custom/v1
export const fetchContactInfos = async (): Promise<ContactInfos> => {
    const data = await fetchCustomData<ContactInfos>("contact-infos");
    return data;
};

// Fetch about me infos using /custom/v1
export const fetchAboutInfos = async (): Promise<AboutInfos> => {
    const data = await fetchCustomData<AboutInfos>("about-me");
    return data;
};