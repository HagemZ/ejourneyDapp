import React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed z-90 bg-white h-2 top-0 left-0 right-0 shadow-sm flex justify-between items-center w-[100%] px-43 py-8">
      <div className="logo font-bold">Nusantara</div>
      <div className="navlink">
        <ol className="flex gap-6">
          <li>Home</li>
          <li>Service</li>
          <li>About</li>
        </ol>
      </div>
    </nav>
  );
};
