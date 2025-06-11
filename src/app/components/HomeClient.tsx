"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Brand } from "@/api/graphql/content/brands";
import HomeLoading from "@/app/components/HomeLoading";
import ProductsReview from "./sections/dynamic/ProductsReview";

// Dynamic components
const Hero = dynamic(() => import("@/app/components/sections/dynamic/Hero"));
const Categories = dynamic(() => import("@/app/components/sections/dynamic/Categories"));
const FeaturedPosts = dynamic(() => import("@/app/components/sections/dynamic/FeaturedPosts"));
const ProductReviews = dynamic(() => import("@/app/components/sections/dynamic/ProductReviews"));
const TopBrands = dynamic(() => import("@/app/components/sections/dynamic/TopBrands"));
const Homecategory1 = dynamic(() => import("@/app/components/sections/dynamic/Blocks/Homecategory1"));
const Homecategory2 = dynamic(() => import("@/app/components/sections/dynamic/Blocks/Homecategory2"));
const FeaturedGuides = dynamic(() => import("@/app/components/sections/dynamic/Blocks/FeaturedGuides"));

type Props = {
  brands: Brand[];
};

const HomeClient = ({ brands }: Props) => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Disable scroll while loading
    document.body.style.overflow = "hidden";
    const timeout = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "auto";
    }, 500); // Simulate small delay for visuals (optional)

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (loading) return <HomeLoading />;

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedPosts />
      <ProductsReview />
      <TopBrands />
      <Homecategory1 />
      <Homecategory2 />
      <FeaturedGuides brands={brands} />
    </>
  );
};

export default HomeClient;
