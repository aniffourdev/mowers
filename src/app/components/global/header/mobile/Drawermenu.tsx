"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { MenuItem } from "@/services/menu";
import { FiMinusSquare, FiPlusSquare } from "react-icons/fi";
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

interface MenuItemComponentProps {
  item: MenuItem;
  toggleDrawer: () => void;
}

const MenuItemComponent = React.memo(({ item, toggleDrawer }: MenuItemComponentProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const rawHref =
    item.path ||
    item.url ||
    item.uri ||
    `/${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  const href = cleanCategoryPath(rawHref);

  return (
    <li className="relative group no-last-gap w-full">
      <div
        className={`${poppins.className} text-black w-full py-[13px] font-medium uppercase text-md cursor-pointer border-b-[1px] border-slate-200`}
        onClick={toggleDropdown}
        onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
        tabIndex={0}
        role="button"
        aria-expanded={dropdownOpen}
      >
        <Link href={href} onClick={toggleDrawer}>{item.label}</Link>
        {hasChildItems(item) &&
          (dropdownOpen ? (
            <FiMinusSquare className="inline-block size-4 relative -top-[1.5px] ml-[5px]" />
          ) : (
            <FiPlusSquare className="inline-block size-4 relative -top-[1.5px] ml-[5px]" />
          ))}
      </div>
      {hasChildItems(item) && dropdownOpen && (
        <div className="w-full">
          <ul className={`w-full pt-3 border-slate-200 border-b-[1px]`}>
            {item.childItems.nodes.map((childItem: MenuItem) => (
              <li key={childItem.id} className="mb-1.5">
                <Link
                  href={cleanCategoryPath(
                    childItem.path ||
                      childItem.url ||
                      childItem.uri ||
                      `/${childItem.label.toLowerCase().replace(/\s+/g, "-")}`
                  )}
                  className={`${poppins.className} text-slate-800 font-medium uppercase px-4 text-sm`}
                  aria-label={childItem.label}
                  onClick={toggleDrawer} // Close the drawer when a link is clicked
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
});

MenuItemComponent.displayName = "MenuItemComponent";

interface DrawermenuProps {
  menuItems: MenuItem[] | null;
  loading: boolean;
  toggleDrawer: () => void;
}

export default function Drawermenu({
  menuItems,
  loading,
  toggleDrawer,
}: DrawermenuProps) {
  if (loading) {
    return (
      <nav aria-label="Main Navigation" className="w-full">
        <ul className="flex justify-start items-start flex-col w-full">
          {[...Array(6)].map((_, index) => (
            <li
              key={index}
              className="relative group w-full no-last-gap cursor-pointer py-[13px] border-b-[1px] border-slate-200"
            >
              <Skeleton width={100} height={20} />
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  if (!menuItems) {
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
    <nav aria-label="Main Navigation">
      <ul className="flex justify-start items-start flex-col">
        {topLevelItems.map((item: MenuItem) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            toggleDrawer={toggleDrawer}
          />
        ))}
      </ul>
    </nav>
  );
}