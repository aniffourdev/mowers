"use client";
import React, { useState, Suspense } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { MenuItem } from "@/services/menu";

// Dynamically import the Drawermenu component
const Drawermenu = dynamic(() => import("@/app/components/global/header/mobile/Drawermenu"));

interface MobilemenuProps {
  menuItems: MenuItem[] | null;
  loading: boolean;
}

const Mobilemenu = ({ menuItems, loading }: MobilemenuProps) => {
  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  return (
    <>
      <nav className="block lg:hidden">
        {drawer ? (
          <AiOutlineClose
            className="size-5 cursor-pointer"
            onClick={toggleDrawer}
          />
        ) : (
          <AiOutlineMenu
            className="size-5 cursor-pointer"
            onClick={toggleDrawer}
          />
        )}
      </nav>
      {drawer && (
        <motion.div
          className="fixed w-[80%] bg-white opacity-95 h-screen p-[10px] px-5 top-[3.6rem] left-0"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Drawermenu menuItems={menuItems} loading={loading} toggleDrawer={toggleDrawer} />
          </Suspense>
        </motion.div>
      )}
    </>
  );
};

export default Mobilemenu;