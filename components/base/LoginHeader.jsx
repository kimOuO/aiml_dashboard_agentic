import React from "react";
import Logo from "./Logo";
import Login from "./Login";

const LoginHeader = () => {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="w-42">
            <Logo />
          </div>
          <Login />
        </nav>
      </header>
    </div>
  );
};
export default LoginHeader;
