import React from "react";
import SiteLogo from "../../../../../public/assets/impose-logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <Image
        src={SiteLogo}
        alt="Site Logo"
        width={80}
        height={40}
        title="Site Logo"
      />
    </div>
  );
};

export default Logo;