"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/app/components/global/header/Logo";
import Menu from "@/app/components/global/header/Menu";
import Calltoaction from "@/app/components/global/header/Calltoaction";
import Mobilemenu from "@/app/components/global/header/mobile/Mobilemenu";
import { getMenuByName, MenuItem } from "@/services/menu";

const Navbar = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      const items = await getMenuByName("Main");
      if (Array.isArray(items)) {
        setMenuItems(items);
      } else if (items === null) {
        setMenuItems(null);
      } else {
        console.error("Unexpected response from getMenuByName:", items);
      }
      setLoading(false);
    }

    fetchMenu();
  }, []);

  return (
    <header className="bg-white/95 py-0.5 border-b-[1px] border-slate-200 sticky top-0 w-full z-40">
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex justify-start items-center gap-5">
          <Mobilemenu menuItems={menuItems} loading={loading} />
          <Logo />
        </div>
        <Menu />
        <Calltoaction />
      </div>
    </header>
  );
};

export default Navbar;