"use client";
import React, { useEffect, useState } from "react";
import { fetchSocialLinks } from "@/api/rest/fetchFunctions";
import { getMenuByName, MenuItem } from "@/services/menu";
import { SocialLinks } from "@/libs/interfaces";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaMedium,
  FaPinterestSquare,
} from "react-icons/fa";
import Link from "next/link";
import SiteLogo from "../../../../../public/assets/impose-logo.png";
import Policies from "./Policies";
import { Setting, settings_infos } from "@/api/graphql/content/settings";

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[] | string | null>(null);
  const [settings, setSettings] = useState<Setting | null>(null);

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

    const fetchMenuItems = async () => {
      const data = await getMenuByName("Policies");
      setMenuItems(data);
    };

    getSocialLinks();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetch for better performance
        const [authorData, fetchedSocialLinks] = await Promise.all([
          settings_infos(),
          fetchSocialLinks(),
        ]);

        console.log("Settings data:", authorData); // Log the settings data
        setSettings(authorData);
        setSocialLinks(fetchedSocialLinks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!settings) {
    return <p className="text-center my-4">No Settings Found!</p>;
  }

  if (loading || menuItems === null) {
    return (
      <div className="max-w-screen-lg px-5 py-8 mx-auto justify-between flex items-center lg:flex-row flex-col">
        <div className="flex justify-start items-center gap-2">
          <Skeleton width={150} height={15} />
          <Skeleton width={100} height={15} />
          <Skeleton width={80} height={15} />
        </div>
        <div className="flex justify-start items-center gap-2">
          <Skeleton width={60} height={15} />
          <Skeleton width={60} height={15} />
          <Skeleton width={60} height={15} />
          <Skeleton width={60} height={15} />
        </div>
        <div className="flex justify-start items-center gap-2">
          <Skeleton width={20} height={20} />
          <Skeleton width={20} height={20} />
          <Skeleton width={20} height={20} />
          <Skeleton width={20} height={20} />
        </div>
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
    <footer className="text-gray-600 body-font">
      <div className="max-w-screen-lg px-5 py-8 mx-auto justify-between flex items-center lg:flex-row flex-col">
        <Image
          src={SiteLogo}
          alt="Site Logo"
          width={100}
          height={40}
          title="Site Logo"
        />
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © {new Date().getFullYear()} {settings.title} —
          <Link
            href="/"
            className="text-black ml-1 font-medium"
            rel="noopener noreferrer"
          >
            @{settings.title}
          </Link>
        </p>
        <nav className="ml-0 lg:ml-10 mt-5 lg:mt-0">
          <Policies menuItems={menuItems} />
        </nav>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <nav aria-label="Social Media Links">
            <ul className="flex justify-center items-center gap-2">
              {socialMediaIcons.map(({ name, icon: Icon, link }) => (
                <li key={name}>
                  <Link target="_blank" href={link || "/"} aria-label={name}>
                    <Icon className="size-5 text-black" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
