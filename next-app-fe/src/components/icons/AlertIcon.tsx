import React, { FC } from "react";

interface AlertIconProps {
  size?: number;
  color?: string;
}

const AlertIcon: FC<AlertIconProps> = ({ size, color }) => (
  <svg
    style={{
      width: size ? `${size}%` : "100%",
      height: "auto",
    }}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0.171631C15.53 0.171631 20 4.65263 20 10.1716C20 15.6926 15.53 20.1716 10 20.1716C4.48 20.1716 0 15.6926 0 10.1716C0 4.65263 4.48 0.171631 10 0.171631ZM10 13.1026C9.52 13.1026 9.13 13.4926 9.13 13.9726C9.13 14.4526 9.52 14.8526 10.01 14.8526C10.49 14.8526 10.88 14.4526 10.88 13.9726C10.88 13.4926 10.49 13.1026 10 13.1026ZM10 5.50163C9.52 5.50163 9.12 5.90263 9.12 6.38163V10.8016C9.12 11.2826 9.52 11.6716 10 11.6716C10.48 11.6716 10.87 11.2826 10.87 10.8016V6.38163C10.87 5.90263 10.48 5.50163 10 5.50163Z"
      fill={color}
    />
  </svg>
);

export default AlertIcon;
