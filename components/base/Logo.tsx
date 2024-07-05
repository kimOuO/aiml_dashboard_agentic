import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex lg:flex-1 w-42">
      <a className="-m-1.5 p-1.5">
        <Image
          src="/mitlab_logo_black.png"
          alt="MITLab Logo"
          style={{ width: "auto", height: "auto" }}
          width={80}
          height={60}
          priority
        />
      </a>
    </div>
  );
};
export default Logo;
