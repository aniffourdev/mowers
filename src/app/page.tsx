import Image from "next/image";
import Hero from "@/app/components/sections/dynamic/Hero";
import Categories from "@/app/components/sections/dynamic/Categories";
import FeaturedPosts from "@/app/components/sections/dynamic/FeaturedPosts";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedPosts />
    </>
  );
}
