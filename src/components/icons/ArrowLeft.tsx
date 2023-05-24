import React, { FC } from "react";

interface ArrowLeftProps {
  width?: number;
  height?: number;
  color?: string;
}

const ArrowLeftIcon: FC<ArrowLeftProps> = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: "scaleX(-1)" }} // Flip horizontally
  >
    <path
      d="M21.4028 4.64896C21.598 4.4537 21.598 4.13712 21.4028 3.94186L18.2208 0.759876C18.0255 0.564614 17.7089 0.564614 17.5137 0.759876C17.3184 0.955138 17.3184 1.27172 17.5137 1.46698L20.3421 4.29541L17.5137 7.12384C17.3184 7.3191 17.3184 7.63568 17.5137 7.83094C17.7089 8.02621 18.0255 8.02621 18.2208 7.83094L21.4028 4.64896ZM0.142273 4.79541H21.0492V3.79541H0.142273V4.79541Z"
      fill={color}
    />
  </svg>
);

export default ArrowLeftIcon;
