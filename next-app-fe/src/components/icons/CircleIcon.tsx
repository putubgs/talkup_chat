import React, { FC } from "react";

interface CircleIconProps {
  size?: number;
  color?: string;
}

const CircleIcon: FC<CircleIconProps> = ({ size, color }) => (
  <svg
    style={{
      width: size ? `${size}px` : "100px",
      height: "auto",
    }}
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6.29541" r="6" fill={color} />
  </svg>
);

export default CircleIcon;
