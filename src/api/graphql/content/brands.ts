import axios from 'axios';

export interface Brand {
  id: number;
  name: string;
  slug: string;
  brand_image: string;
  description: string;
  count: number;
}

export async function getBrands(brandNames?: string[]): Promise<Brand[]> {
  try {
    const response = await axios.get(`https://gvr.ltm.temporary.site/mower/wp-json/wp/v2/brand?per_page=100&_embed=1`);
    const allBrands = response.data;

    // Process brands to include featured media
    const processedBrands = allBrands.map((brand: any) => {
      let brandImage = brand.meta?.brand_image || '';

      // Check for featured media
      if (brand._embedded && brand._embedded['wp:featuredmedia'] && brand._embedded['wp:featuredmedia'][0]) {
        const media = brand._embedded['wp:featuredmedia'][0];
        brandImage = media.source_url || brandImage; // Use featured media if available
      }

      // console.log(`Processing brand: ${brand.name}, brand_image: ${brandImage}`);

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        brand_image: brandImage,
        description: brand.description,
        count: brand.count,
      };
    });

    // Filter brands by the provided names
    return brandNames ? processedBrands.filter((brand: Brand) => brandNames.includes(brand.name)) : processedBrands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}
