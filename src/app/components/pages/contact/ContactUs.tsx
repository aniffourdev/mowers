"use client";
import { fetchContactInfos } from "@/api/rest/fetchFunctions";
import { ContactInfos } from "@/libs/interfaces";
import { Lato, Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";
import Form from "./Form";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const ContactUs = () => {
  const [contactInfos, setContactInfos] = useState<ContactInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchContactInfos();
        setContactInfos(data);
      } catch (err) {
        setError("Failed to fetch contact information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!contactInfos) return <p>No contact information found.</p>;

  return (
    <main className="max-w-screen-lg mx-auto p-4 my-10">
      <div className="flex justify-start items-center h-full flex-col">
        <h1
          className={`${poppins.className} text-4xl text-black font-bold underline uppercase decoration-slate-400 underline-offset-8 border-b-4 border-slate-200 mb-6`}
        >
          Contact
        </h1>
        <p
          className={`${lato.className} text-center text-slate-600 text-sm max-w-md`}
        >
          {contactInfos.paragraph1}
        </p>
      </div>
      <div className="lg:flex mt-20 gap-16">
        <div className="lg:w-5/12">
          <p
            className={`${lato.className} text-left text-slate-800 text-sm mb-4`}
          >
            {contactInfos.paragraph2}
          </p>
          <p
            className={`${lato.className} text-left text-slate-800 text-sm mb-4`}
          >
            {contactInfos.paragraph3}
          </p>
          <p
            className={`${lato.className} text-left text-slate-800 text-sm mb-4`}
          >
            {contactInfos.paragraph4}
          </p>
          <p
            className={`${lato.className} text-left font-semibold underline text-slate-800 text-md uppercase mt-10 mb-3`}
          >
            {contactInfos.subtitle}
          </p>
          <ul className="text-sm space-y-1.5">
            <li>
              Email:{" "}
              <span className="text-black font-semibold">
                {contactInfos.email}
              </span>
            </li>
            <li>
              Phone:{" "}
              <span className="text-black font-semibold">
                {contactInfos.phone}
              </span>
            </li>
            <li>
              Address:{" "}
              <span className="text-black font-semibold">
                {contactInfos.address}
              </span>
            </li>
          </ul>
        </div>
        <div className="lg:w-7/12">
            <Form />
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
