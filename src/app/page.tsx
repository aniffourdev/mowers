import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Dynamically import components
const Hero = dynamic(() => import("@/app/components/sections/dynamic/Hero"));
const Categories = dynamic(() => import("@/app/components/sections/dynamic/Categories"));
const FeaturedPosts = dynamic(() => import("@/app/components/sections/dynamic/FeaturedPosts"));
const ProductReviews = dynamic(() => import("@/app/components/sections/dynamic/ProductReviews"));

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Categories />
        <FeaturedPosts />
        {/* <ProductReviews /> */}
      </Suspense>
    </>
  );
}
