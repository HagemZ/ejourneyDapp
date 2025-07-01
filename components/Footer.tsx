import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="h-21 bg-white shadow-lg flex items-center justify-center">
      &copy; {new Date().getFullYear()} Explore Nusantara
    </footer>
  );
};

export default Footer;
