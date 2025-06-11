"use client";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { getMenuByName, MenuItem } from "@/services/menu";
import localFont from "next/font/local";

// Dynamically import components
const Logo = dynamic(() => import("@/app/components/global/header/Logo"));
const Menu = dynamic(() => import("@/app/components/global/header/Menu"));
const Calltoaction = dynamic(() => import("@/app/components/global/header/Calltoaction"));
const Mobilemenu = dynamic(() => import("@/app/components/global/header/mobile/Mobilemenu"));

const Parafina = localFont({ 
  src: '../../sections/dynamic/contents/fonts/parafina.woff2',
  preload: true,
  display: 'swap'
})

const Navbar = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const items = await getMenuByName("Main");
        if (Array.isArray(items)) {
          setMenuItems(items);
        } else {
          setMenuItems(null);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
      
    }

    fetchMenu();
  }, []);

  return (
    <header className="bg-white/95 py-0.5 border-b-[1px] border-slate-200 sticky top-0 w-full z-40">
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex justify-start items-center gap-5">
          <Suspense fallback={<div className="h-screen w-screen flex justify-center items-center">Loading...</div>}>
            <Mobilemenu menuItems={menuItems} loading={loading} />
          </Suspense>
          <Logo />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Menu />
        </Suspense>
        <Calltoaction />
      </div>
    </header>
  );
};

export default Navbar;
