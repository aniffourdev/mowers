import React from "react";
import Image from "next/image";
import SiteLogo from "../../../../../public/assets/impose-logo.png";

const Logo = React.memo(() => {
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
});

Logo.displayName = "Logo";

export default Logo;
