import { Noto_Sans, Poppins } from "next/font/google";
import Link from "next/link";
import React from "react";
import About from "@/app/components/widgets/About";
// import RecentPosts from "@/app/components/widgets/RecentPosts";
import Newsletter from "@/app/components/sections/static/Newsletter";
import { BiArrowBack } from "react-icons/bi";

const noto = Noto_Sans({ weight: "400", subsets: ["latin"] });
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const Error = () => {
  return (
    <main className="max-w-screen-lg mx-auto p-4 mt-10">
      <div className="lg:flex gap-10">
        <div className="lg:w-9/12 h-screen flex lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0 !flex-col">
          <p
            className={`${poppins.className} text-center !text-8xl text-black font-[800] uppercase`}
          >
            404
          </p>
          <p
            className={`${poppins.className} text-center text-[34px] text-black font-[800] uppercase`}
          >
            Page Not Found
          </p>
          <p className={`${noto.className} text-[13px] text-center text-[#222222] my-8`}>
            Sorry, the page you are looking for could not be found.
          </p>
          <div className="mx-auto max-w-[100px]">
          <Link
            href="/"
            className="flex justify-center min-w-max items-center gap-1 border-2 border-black text-xs uppercase px-4 py-2 transition-all duration-200 hover:bg-black hover:text-white"
            title="Return Home"
          >
            <BiArrowBack className="size-4" />
            Back Home
          </Link>
          </div>
        </div>
        <aside className="lg:w-3/12">
          <About />
          <Newsletter />
          {/* <RecentPosts /> */}
        </aside>
      </div>
    </main>
  );
};

export default Error;
