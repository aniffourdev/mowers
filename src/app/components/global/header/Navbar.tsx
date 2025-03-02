import React from "react";
import Logo from "@/app/components/global/header/Logo";
import Menu from "@/app/components/global/header/Menu";
import Calltoaction from "@/app/components/global/header/Calltoaction";

const Navbar = () => {
  return (
    <header className="bg-white/95 py-0.5 border-b-[1px] border-slate-200 sticky top-0 w-full z-40">
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <Logo />
        <Menu />
        <Calltoaction />
      </div>
    </header>
  );
};

export default Navbar;
