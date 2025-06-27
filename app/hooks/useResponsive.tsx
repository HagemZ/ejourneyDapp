"use client";

import { useEffect, useState } from "react";

const getDevice = (device: number) => {
  if (device < 768) return "mobile";
  if (device < 1024) return "tablet";
  return "desktop";
};

const useResponsive = () => {
  const [deviceName, setDeviceName] = useState(getDevice(window.innerWidth));
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setDeviceName(getDevice(window.innerWidth));
      setDeviceWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return { deviceName, deviceWidth };
};

export default useResponsive;
