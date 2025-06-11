import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import HomeLoading from "./components/HomeLoading";
import ProductsReview from "./components/sections/dynamic/ProductsReview";
import TopBrands from "./components/sections/dynamic/TopBrands";
import Homecategory1 from "./components/sections/dynamic/Blocks/Homecategory1";
import Homecategory2 from "./components/sections/dynamic/Blocks/Homecategory2";
import FeaturedGuides from "./components/sections/dynamic/Blocks/FeaturedGuides";
import { getBrands, Brand } from "@/api/graphql/content/brands";
import { getBlurData } from "@/utils/blur-data-generator";

// Dynamically import components
const Hero = dynamic(() => import("@/app/components/sections/dynamic/Hero"));
const Categories = dynamic(
  () => import("@/app/components/sections/dynamic/Categories")
);
const FeaturedPosts = dynamic(
  () => import("@/app/components/sections/dynamic/FeaturedPosts")
);
const ProductReviews = dynamic(
  () => import("@/app/components/sections/dynamic/ProductReviews")
);

export default async function Home() {
  try {
    // console.log("Home page: Fetching brands...");

    // Try with no filter first to see what brands are available
    const allBrands = await getBrands();
    // console.log("Home page: Available brands:", allBrands.map(b => b.name));

    // Now try with your specific brand names
    const desiredBrandNames = ["Brand1", "Brand2", "Brand3", "Brand4"];
    // console.log("Home page: Trying to filter by:", desiredBrandNames);

    let brands = await getBrands(desiredBrandNames);

    // If no brands match, use all brands
    if (!brands || brands.length === 0) {
      // console.log("Home page: No matching brands found, using all brands");
      brands = allBrands;
    }

    // console.log("Home page: Selected brands:", brands.map(b => ({
    //   name: b.name,
    //   brand_image: b.brand_image?.substring(0, 100) + '...' // Log just part of the URL to avoid cluttering logs
    // })));

    // Fetch blur data for each brand
    const brandsWithBlurData = await Promise.all(
      brands.map(async (brand: Brand) => {
        try {
          const defaultImage =
            "https://gvr.ltm.temporary.site/mower/wp-content/uploads/2025/02/load.jpg";
          const imageUrl = brand.brand_image || defaultImage;
          // console.log(`Generating blur data for ${brand.name} using image:`, imageUrl);

          const blurData = await getBlurData(imageUrl);
          return { ...brand, blurData };
        } catch (err) {
          console.error(`Error generating blur data for ${brand.name}:`, err);
          return { ...brand, blurData: undefined };
        }
      })
    );

    // console.log("Home page: Final brands with blur data:", brandsWithBlurData.map(b => ({
    //   name: b.name,
    //   hasBlur: !!b.blurData
    // })));

    return (
      <>
        <Suspense fallback={<HomeLoading />}>
          <Hero />
          <Categories />
          <FeaturedPosts />
          <ProductsReview />
          <TopBrands />
          <Homecategory1 />
          <Homecategory2 />
          <FeaturedGuides brands={brandsWithBlurData} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error("Error in Home page rendering:", error);
  }
}
