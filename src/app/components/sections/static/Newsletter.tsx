"use client";
import { Lato } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const Newsletter = () => {
  const [result, setResult] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const router = useRouter();

  const sendEmail = () => {
    setLoading(true);

    fetch("/functions/email", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // router.push("/thank-u-for-subscribing");
          toast.success("Thank you for subscribing!");
        }
        return response.json();
      })
      .then((data) => setResult(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <div className="mb-12">
        <h2
          className={`!${lato.className} !uppercase !text-slate-400 !font-[600] !text-xs !tracking-widest`}
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
            value={email}
            onChange={handleInputChange}
          />
          <button
            onClick={sendEmail}
            type="button"
            className="px-4 cursor-pointer py-2 border-2 border-black transition-all duration-200 hover:bg-black hover:text-white mt-3 text-xs"
          >
            Get Updates
          </button>
        </form>
        <Toaster position="top-right" reverseOrder={true} />
      </div>
    </>
  );
};

export default Newsletter;
