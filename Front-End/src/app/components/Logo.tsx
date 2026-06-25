import React from "react";

export interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Code bracket representation on the left */}
      <path d="M 6,17 L 2,12 L 6,7" />
      
      {/* Rupee-like transaction and coding stripes on the right */}
      <path d="M 10,7 L 20,7" />
      <path d="M 10,11 L 18,11" />
      
      {/* Infinite loop and leg */}
      <path d="M 13,7 C 17.5,7 17.5,15 13,15 L 20,22" />
    </svg>
  );
}
