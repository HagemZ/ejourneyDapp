"use client";

import { useEffect, useState } from "react";

const getDevice = (width: number) => {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const useResponsive = () => {
  // Initialize with default values, will be updated in useEffect
  const [deviceName, setDeviceName] = useState("desktop");
  const [deviceWidth, setDeviceWidth] = useState(1024);
  
  useEffect(() => {
    // Only access window after component is mounted on client side
    const handleResize = () => {
      setDeviceName(getDevice(window.innerWidth));
      setDeviceWidth(window.innerWidth);
    };
    
    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Add empty dependency array to run effect only once after mount

  return { deviceName, deviceWidth };
};

export default useResponsive;
