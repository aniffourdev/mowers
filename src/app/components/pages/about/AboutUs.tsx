"use client";
import React, { useEffect, useState } from "react";
import { Lato, Poppins } from "next/font/google";
import { fetchAboutInfos, fetchSocialLinks } from "@/api/rest/fetchFunctions";
import { AboutInfos, SocialLinks } from "@/libs/interfaces";
import { Author, author_infos } from "@/api/graphql/content/author";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaFacebookSquare, FaPinterestSquare } from "react-icons/fa";
import { IoLogoMedium } from "react-icons/io5";
import Link from "next/link";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const AboutUs = () => {
  const [aboutInfos, setAboutInfos] = useState<AboutInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAboutInfos();
        setAboutInfos(data);
      } catch (err) {
        setError("Failed to fetch contact information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetch for better performance
        const [authorData, fetchedSocialLinks] = await Promise.all([
          author_infos(),
          fetchSocialLinks(),
        ]);

        setAuthor(authorData);
        setSocialLinks(fetchedSocialLinks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!aboutInfos) return <p>No contact information found.</p>;

  if (!author || !socialLinks) {
    return <p className="text-center my-4">Content not available</p>;
  }

  const socialMediaIcons = [
    {
      name: "Facebook",
      icon: FaFacebookSquare,
      link: socialLinks.facebook,
      color: "#1877F2",
    },
    {
      name: "Pinterest",
      icon: FaPinterestSquare,
      link: socialLinks.pinterest,
      color: "#E60023",
    },
    {
      name: "Medium",
      icon: IoLogoMedium,
      link: socialLinks.medium,
      color: "#000000",
    },
  ];

  // Replace <p> tags with <div> tags and add margin for spacing
  const contentWithSpacing = aboutInfos.content.replace(
    /<\/?p[^>]*>/g,
    '</div><div class="mb-4">'
  );

  return (
    <main className="max-w-screen-lg mx-auto p-4 my-10">
      <div className="flex justify-start items-center h-full flex-col">
        <h1
          className={`${poppins.className} text-4xl text-black font-bold underline uppercase decoration-slate-400 underline-offset-8 border-b-4 border-slate-200 mb-6`}
        >
          About Me
        </h1>
        <p
          className={`${lato.className} text-center text-slate-600 text-sm max-w-md`}
        >
          {aboutInfos.subtitle}
        </p>
        <div className="lg:flex mt-20 gap-16">
          <div className="lg:w-4/12">
            <figure className="relative flex justify-center items-center mt-0 lg:mt-10">
              {!imageLoaded && (
                <div className="absolute inset-0 z-10">
                  <Skeleton width="100%" height="100%" />
                </div>
              )}
              <Image
                src={author.avatar.url}
                alt={`Avatar of ${author.name}`}
                title={author.name}
                loading="lazy"
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                height={0}
                width={0}
                className="w-[50%] lg:w-full relative z-0"
                onLoad={() => setImageLoaded(true)}
              />
            </figure>
            <p className="!text-xs !text-center !mb-2 !text-slate-800 mt-3.5">Follow me on:</p>
            <nav className="mt-1 mb-10 lg:mb-0">
              <ul className="flex justify-center items-center gap-3">
                {socialMediaIcons.map(({ name, icon: Icon, link, color }) => (
                  <li key={name}>
                    <Link target="_blank" href={link || "/"} aria-label={name}>
                      <Icon className="size-8" style={{ color: color }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:w-8/12">
            <h1
              className={`${poppins.className} text-2xl font-semibold text-black mb-5`}
            >
              {aboutInfos.title}
            </h1>
            <div
              className={`page-content ${lato.className} text-sm text-slate-900 mb-3.5`}
              dangerouslySetInnerHTML={{
                __html: `<p>${contentWithSpacing}</p>`,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;
