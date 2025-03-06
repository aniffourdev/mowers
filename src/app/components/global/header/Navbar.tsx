import React from "react";
import Logo from "@/app/components/global/header/Logo";
import Menu from "@/app/components/global/header/Menu";
import Calltoaction from "@/app/components/global/header/Calltoaction";
import Mobilemenu from "@/app/components/global/header/mobile/Mobilemenu";

const Navbar = () => {
  return (
    <header className="bg-white/95 py-0.5 border-b-[1px] border-slate-200 sticky top-0 w-full z-40">
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex justify-start items-center gap-5">
          <Mobilemenu />
          <Logo />
        </div>
        <Menu />
        <Calltoaction />
      </div>
    </header>
  );
};

export default Navbar;
