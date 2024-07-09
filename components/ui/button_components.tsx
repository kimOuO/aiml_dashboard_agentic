import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-900 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
