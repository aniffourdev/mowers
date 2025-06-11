"use client"; // Make this a Client Component

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { getBlurData } from "@/utils/blur-data-generator";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

interface Brand {
  id: number;
  name: string;
  slug: string;
  brand_image: string;
  blurData?: string; // Add blurData to the Brand interface
}

const LoadingItem: React.FC<{ blurDataURL: string }> = ({ blurDataURL }) => (
  <article 
    className="w-full h-[450px] relative overflow-hidden"
    role="status"
    aria-label="Loading brand"
  >
    <Image
      className="object-cover"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0CkAAAAASUVORK5CYII="
      alt="Loading brand image..."
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  </article>
);

const BrandGrid: React.FC<{ brands: Brand[] }> = ({ brands }) => {
  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5 w-full"
      role="list"
      aria-label="Featured brands"
    >
      {brands.map((brand) => (
        <article
          key={brand.id}
          className="relative h-[450px] overflow-hidden"
          role="listitem"
        >
          <Link 
            href={`/${brand.slug}`}
            aria-label={`View ${brand.name} brand guide`}
          >
            <div className="relative h-full" title={brand.name}>
              <Image
                className="object-cover"
                src={brand.brand_image}
                alt={`Featured image for ${brand.name} brand`}
                title={brand.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={brand.blurData}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-teal-200/50 from-teal-900/50 to-transparent flex justify-center items-center"
                role="presentation"
              >
                <h4
                  className={`${poppins.className} !bg-black/75 !text-white !w-full !uppercase !py-5 !text-2xl !lg:text-lg !font-bold !text-center`}
                >
                  {brand.name}
                </h4>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

const LoadingGrid: React.FC<{ blurDataURL: string }> = ({ blurDataURL }) => (
  <div 
    className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 w-full"
    role="status"
    aria-label="Loading brands"
  >
    {[...Array(4)].map((_, index) => (
      <LoadingItem key={index} blurDataURL={blurDataURL} />
    ))}
  </div>
);

interface FeaturedGuidesProps {
  brands: Brand[];
}

const FeaturedGuides: React.FC<FeaturedGuidesProps> = ({ brands }) => {
  return (
    <section
      className="max-w-screen-lg mx-auto p-4 my-20"
      aria-label="Featured brand guides"
    >
      <header className="sr-only">
        <h2>Featured Brand Guides</h2>
      </header>
      <Suspense
        fallback={
          <LoadingGrid
            blurDataURL={brands[0]?.blurData || ""}
          />
        }
      >
        <BrandGrid brands={brands} />
      </Suspense>
    </section>
  );
};

export default FeaturedGuides;
