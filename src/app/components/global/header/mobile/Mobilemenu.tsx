// Mobilemenu.tsx
"use client";
import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import Drawermenu from "@/app/components/global/header/mobile/Drawermenu";
import { MenuItem } from "@/services/menu";

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
          <Drawermenu menuItems={menuItems} loading={loading} toggleDrawer={toggleDrawer} />
        </motion.div>
      )}
    </>
  );
};

export default Mobilemenu;