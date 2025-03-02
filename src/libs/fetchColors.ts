import axios from "axios";

export interface ColorPalette {
  primary_color: string;
  secondary_color: string;
  color_3: string;
  featured_image: string;
  // Add other colors as needed
}

export const fetchColors = async (): Promise<ColorPalette> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/wp-json/wp/v2/color_palette`
    );
    const colors = response.data[0].meta; // Access the meta fields
    return colors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
};
