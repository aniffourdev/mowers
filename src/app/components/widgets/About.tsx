"use client";
import React, { useEffect, useState } from "react";
import { Lato } from "next/font/google";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Author, author_infos } from "@/api/graphql/content/author";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookSquare, FaPinterestSquare } from "react-icons/fa";
import { IoLogoMedium } from "react-icons/io5";
import { SocialLinks } from "@/libs/interfaces";
import { fetchSocialLinks } from "@/api/rest/fetchFunctions";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const About = () => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Skeleton loader component
  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex flex-col items-center">
          <Skeleton width={240} height={240} />
          <div className="mt-5 flex justify-center items-center gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} width={32} height={32} className="rounded" />
            ))}
          </div>
          <div className="mt-4 w-full">
            <Skeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="mb-16">
      <h2
          className={`!${lato.className} !uppercase text-center lg:text-left !text-slate-400 !font-[600] !text-xs !tracking-widest`}
        >
          About me
        </h2>
      <figure className="relative">
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
          className="mx-auto w-[40%] lg:w-full relative z-0"
          onLoad={() => setImageLoaded(true)}
        />
      </figure>

      <nav className="mt-5">
        <ul className="flex justify-center items-center gap-1.5">
          {socialMediaIcons.map(({ name, icon: Icon, link, color }) => (
            <li key={name}>
              <Link target="_blank" href={link || "/"} aria-label={name}>
                <Icon className="size-8" style={{ color: color }} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="text-slate-600 text-center text-xs mt-4">
        {author.description}
      </p>
    </div>
  );
};

export default About;
