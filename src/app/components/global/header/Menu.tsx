"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMenuByName, MenuItem } from "@/services/menu";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Poppins } from "next/font/google";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const hasChildItems = (
  item: MenuItem
): item is MenuItem & { childItems: { nodes: MenuItem[] } } => {
  return !!item.childItems && item.childItems.nodes.length > 0;
};

const cleanCategoryPath = (path: string): string => {
  if (path.startsWith("/category/")) {
    return "/" + path.split("/").slice(2).join("/");
  }
  return path;
};

const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const rawHref =
    item.path ||
    item.url ||
    item.uri ||
    `/${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  const href = cleanCategoryPath(rawHref);

  return (
    <li className="relative group no-last-gap">
      <Link
        href={href}
        className={`${poppins.className} text-black font-normal uppercase text-xs`}
        aria-label={item.label}
      >
        {item.label}
        {hasChildItems(item) && (
          <MdOutlineKeyboardArrowDown className="inline-block size-5 relative -top-[1px] -ml-0.5 -mr-1" />
        )}
      </Link>
      {hasChildItems(item) && (
        <div className="absolute left-0 mt-[0px] hidden group-hover:block z-40 py-3">
          <ul className={`min-w-max bg-slate-50 rounded py-2 p-4`}>
            {item.childItems.nodes.map((childItem: MenuItem) => (
              <li key={childItem.id}>
                <Link
                  href={cleanCategoryPath(
                    childItem.path ||
                      childItem.url ||
                      childItem.uri ||
                      `/${childItem.label.toLowerCase().replace(/\s+/g, "-")}`
                  )}
                  className={`${poppins.className} text-black font-normal uppercase text-xs`}
                  aria-label={item.label}
                >
                  {childItem.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      const items = await getMenuByName("Main");
      if (Array.isArray(items)) {
        // Check if items is an array
        setMenuItems(items);
      } else if (items === null) {
        // Check if items is null
        setMenuItems(null);
      } else {
        // If items is a string, handle it accordingly
        console.error("Unexpected response from getMenuByName:", items);
      }
      setLoading(false);
    }

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <nav aria-label="Main Navigation" className="hidden lg:block">
        <ul className="flex justify-center items-center gap-4">
          {[...Array(6)].map((_, index) => (
            <li key={index} className="relative group no-last-gap">
              <Skeleton width={60} height={15} />
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  if (!menuItems || typeof menuItems === "string") {
    return (
      <Link
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_ENDPOINT}/wp-admin/nav-menus.php`}
        className="text-sm font-medium text-black underline"
      >
        ADD A MENU
      </Link>
    );
  }

  const topLevelItems: MenuItem[] = menuItems.filter(
    (item: MenuItem) => !item.parentId
  );

  return (
    <nav aria-label="Main Navigation" className="hidden lg:block">
      <ul className="flex justify-center items-center gap-4">
        {topLevelItems.map((item: MenuItem) => (
          <MenuItemComponent key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
}
