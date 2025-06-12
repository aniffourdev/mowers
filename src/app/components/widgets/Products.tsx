"use client";
import React from "react";
import { Lato } from "next/font/google";
import Ratings from "./Ratings";
import ProductReviews from "../sections/dynamic/ProductReviews";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const ratingData = {
  rating: 4.9,
  reviewCount: 14,
  distribution: {
    excellent: 93,
    veryGood: 7,
    average: 0,
    poor: 0,
    terrible: 0,
  },
};

const ProductList = () => {
  return (
    <aside 
      className="mb-16"
      aria-label="Product highlights and reviews"
    >
      <header>
        <h2
          className={`!${lato.className} !uppercase text-center lg:text-left !text-slate-800 !font-[600] !text-xs !tracking-widest`}
        >
          Product Highlights
        </h2>
      </header>
      <div 
        role="complementary"
        aria-label="Product ratings and reviews"
      >
        <Ratings
          rating={ratingData.rating}
          reviewCount={ratingData.reviewCount}
          distribution={ratingData.distribution}
        />
        <div className="mt-3">
          <ProductReviews />
        </div>
      </div>
    </aside>
  );
};

export default ProductList;
