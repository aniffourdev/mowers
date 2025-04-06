import React, { Suspense } from "react";
import Image from "next/image";
import { getCategories } from "@/api/graphql/content/categories";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { getBlurData } from "@/utils/blur-data-generator";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

interface Category {
  id: string;
  name: string;
  slug: string;
  categoryImage: string;
  blurData?: string; // Add blurData to the Category interface
}

const LoadingItem: React.FC<{ blurDataURL: string }> = ({ blurDataURL }) => (
  <article className="w-full h-[350px] relative overflow-hidden">
    <Image
      className="object-cover"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0CkAAAAASUVORK5CYII="
      alt="Loading..."
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  </article>
);

const CategoryGrid: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 w-full">
      {categories.map((category) => (
        <article
          key={category.id}
          className="relative h-[350px] overflow-hidden"
        >
          <Link href={`/${category.slug}`}>
            <div className="relative h-full" title={category.name}>
              <Image
                className="object-cover"
                src={category.categoryImage}
                alt={`Image of ${category.name} category`}
                title={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={category.blurData}
              />
              <div className="absolute inset-0 bg-gradient-to-teal-200/50 from-teal-900/50 to-transparent flex justify-center items-center">
                <h4
                  className={`${poppins.className} !bg-black/65 !text-white !w-full !uppercase !py-5 !text-sm !lg:text-lg !font-semibold !text-center`}
                >
                  {category.name}
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
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 w-full">
    {[...Array(4)].map((_, index) => (
      <LoadingItem key={index} blurDataURL={blurDataURL} />
    ))}
  </div>
);

const Categories = async () => {
  // Specify the category names you want to display
  const desiredCategoryNames = [
    "Riding Lawn",
    "Battery Lawn",
    "Ryobi Lawn",
    "Toro Lawn",
  ];
  const categories = await getCategories(desiredCategoryNames);

  // Fetch blur data for each category
  const categoriesWithBlurData = await Promise.all(
    categories.map(async (category) => {
      const blurData = await getBlurData(
        category.categoryImage ||
          `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
      );
      return { ...category, blurData };
    })
  );

  return (
    <section
      className="max-w-screen-lg mx-auto p-4 my-20"
      aria-label="Categories"
    >
      <Suspense
        fallback={
          <LoadingGrid
            blurDataURL={categoriesWithBlurData[0]?.blurData || ""}
          />
        }
      >
        <CategoryGrid categories={categoriesWithBlurData} />
      </Suspense>
    </section>
  );
};

export default Categories;
