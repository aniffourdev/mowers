"use client";
import React, { useEffect, useState } from "react";
import { fetchProducts } from "@/api/rest/fetchFunctions";
import { Product } from "@/libs/interfaces";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Lato } from "next/font/google";
import Link from "next/link";
import { Star, StarHalf } from "lucide-react";
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
    <div className="mb-16">
      <h2
        className={`!${lato.className} !uppercase text-center lg:text-left !text-slate-400 !font-[600] !text-xs !tracking-widest`}
      >
        Product Highlights
      </h2>
      <Ratings
        rating={ratingData.rating}
        reviewCount={ratingData.reviewCount}
        distribution={ratingData.distribution}
      />
      <div className="mt-3">
        <ProductReviews />
      </div>
    </div>
  );
};

export default ProductList;
