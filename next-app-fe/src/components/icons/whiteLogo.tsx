import React, { FC } from "react";

interface WhiteLogoProps {
  size?: number;
}

const WhiteLogo: FC<WhiteLogoProps> = ({ size }) => (
  <svg
    style={{
      width: size ? `${size}px` : "100px",
      height: "auto",
    }}
    viewBox="0 0 139 138"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.939209"
      y="0.247559"
      width="137.505"
      height="137.505"
      rx="25"
      fill="#F6FAFF"
    />
    <path
      d="M37.1224 43.6546V27.2146H102.282V43.6546H79.9624V111.455H59.4424V43.6546H37.1224Z"
      fill="#0D90FF"
    />
  </svg>
);

export default WhiteLogo;
