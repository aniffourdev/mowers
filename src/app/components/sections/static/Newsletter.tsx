import { Lato } from "next/font/google";
import React from "react";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const Newsletter = () => {
  return (
    <>
      <div className="mb-12">
        <h2
          className={`!${lato.className} !mb-[1.1em] !pb-[0.3em] !text-xs !tracking-[2px] !uppercase !text-[#222]`}
        >
          Subscribe to newsletter
        </h2>
        <form action="">
          <input
            type="text"
            className="py-3 w-full border-[1px] px-2 placeholder:text-slate-300 border-slate-200 rounded-none text-slate-500 text-xs outline-none"
            placeholder="Your Email"
            name="email"
            id="email"
          />
          <button type="button" className="px-4 cursor-pointer py-2 border-2 border-black transition-all duration-200 hover:bg-black hover:text-white mt-3 text-xs">
            Get Updates
          </button>
        </form>
      </div>
    </>
  );
};

export default Newsletter;
