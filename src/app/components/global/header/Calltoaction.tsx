"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaMedium,
  FaPinterestSquare,
} from "react-icons/fa";
import { fetchSocialLinks } from "@/api/rest/fetchFunctions";
import { SocialLinks } from "@/libs/interfaces";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Search from "@/app/components/Search";

const Calltoaction = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSocialLinks = async () => {
      try {
        const fetchedSocialLinks = await fetchSocialLinks();
        setSocialLinks(fetchedSocialLinks);
      } catch (error) {
        console.error("Error fetching social links:", error);
      } finally {
        setLoading(false);
      }
    };

    getSocialLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} width={20} height={20} />
        ))}
      </div>
    );
  }

  if (!socialLinks) {
    return null; // Ensure socialLinks are available before rendering
  }

  const socialMediaIcons = [
    { name: "Facebook", icon: FaFacebookSquare, link: socialLinks.facebook },
    { name: "Pinterest", icon: FaPinterestSquare, link: socialLinks.pinterest },
    { name: "Instagram", icon: FaInstagramSquare, link: socialLinks.instagram },
    { name: "Medium", icon: FaMedium, link: socialLinks.medium },
  ];

  return (
    <nav aria-label="Social Media Links">
      <ul className="flex justify-center items-center gap-2">
        <li className="mr-5">
          <Search />
        </li>
        {socialMediaIcons.map(({ name, icon: Icon, link }) => (
          <li key={name}>
            <Link target="_blank" href={link || "/"} aria-label={name}>
              <Icon className="size-5" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Calltoaction;
