import React from "react";
import Link from "next/link";
import { getMenuByName, MenuItem } from "@/services/menu";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const cleanCategoryPath = (path: string): string => {
  return path.startsWith("/category/")
    ? "/" + path.split("/").slice(2).join("/")
    : path;
};

const MenuItemComponent = React.memo(({ item }: { item: MenuItem }) => {
  const rawHref =
    item.path ||
    item.url ||
    item.uri ||
    `/${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  const href = cleanCategoryPath(rawHref);

  return (
    <li className="mb-2">
      <Link
        href={href}
        className={`${poppins.className} text-slate-700 font-normal uppercase text-xs`}
      >
        {item.label}
      </Link>
    </li>
  );
});

MenuItemComponent.displayName = "MenuItemComponent";

const QuickLinks = ({ menuItems }: { menuItems: MenuItem[] | string }) => {
  if (!menuItems) {
    return <div>ADD A MENU</div>;
  }

  if (typeof menuItems === "string") {
    return <div>{menuItems}</div>;
  }

  const topLevelItems: MenuItem[] = menuItems.filter((item) => !item.parentId);

  return (
    <nav aria-label="Footer Menu">
      <ul className="flex justify-start items-center gap-4 -mb-1.5">
        {topLevelItems.map((item) => (
          <MenuItemComponent key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
};

// Fetch data outside the component
export async function getServerSideProps() {
  try {
    const menuItems = await getMenuByName("Policies");
    return {
      props: { menuItems },
    };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return {
      props: { menuItems: "Error fetching menu items" },
    };
  }
}

export default QuickLinks;