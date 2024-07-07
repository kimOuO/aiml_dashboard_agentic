import React from "react";

import Logo from "./Logo";
import Navbar from "./Navbar";
import Logout from "./Logout";

const Header = ({ accountInfo="123" }) => {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-2 lg:px-8" aria-label="Global">
          <Logo />
          <Navbar />
          <Logout accountInfo={accountInfo} />
        </nav>
      </header>
    </div>
  );
};

export default Header;
