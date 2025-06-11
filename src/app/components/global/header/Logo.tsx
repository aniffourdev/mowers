import React from "react";
import Image from "next/image";
import SiteLogo from "../../../../../public/assets/impose-logo.png";
import Link from "next/link";

const Logo = React.memo(() => {
  return (
    <header>
      <div role="banner">
        <Link href="/">
          <Image
            src={SiteLogo}
            alt="BKmower Logo"
            width={80}
            height={40}
            title="BKmower Logo"
            priority
            aria-label="BKmower Logo"
          />
        </Link>
      </div>
    </header>
  );
});

Logo.displayName = "Logo";

export default Logo;
