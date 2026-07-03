import React from "react";

export interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <img
      src="/logo/brand-logo.png"
      alt="ConsistPay Logo"
      className={`${className} object-contain select-none`}
    />
  );
}
