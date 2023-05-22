import React, { FC } from "react";

interface MsgIconProps {
  size?: number;
  color?: string;
}

const MsgIcon: FC<MsgIconProps> = ({ size, color }) => (
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
      d="M10.02 0.54541C15.7 0.54541 20 5.2024 20 10.5304C20 16.7097 14.96 20.5454 10 20.5454C8.36 20.5454 6.54 20.1047 5.08 19.2435C4.57 18.933 4.14 18.7026 3.59 18.8829L1.57 19.4838C1.06 19.6441 0.6 19.2435 0.75 18.7026L1.42 16.4593C1.53 16.1488 1.51 15.8183 1.35 15.5579C0.49 13.9756 0 12.243 0 10.5604C0 5.29253 4.21 0.54541 10.02 0.54541ZM14.59 9.28852C13.88 9.28852 13.31 9.85938 13.31 10.5704C13.31 11.2715 13.88 11.8524 14.59 11.8524C15.3 11.8524 15.87 11.2715 15.87 10.5704C15.87 9.85938 15.3 9.28852 14.59 9.28852ZM9.98 9.28852C9.28 9.27851 8.7 9.85938 8.7 10.5604C8.7 11.2715 9.27 11.8424 9.98 11.8524C10.69 11.8524 11.26 11.2715 11.26 10.5704C11.26 9.85938 10.69 9.28852 9.98 9.28852ZM5.37 9.28852C4.66 9.28852 4.09 9.85938 4.09 10.5704C4.09 11.2715 4.67 11.8524 5.37 11.8524C6.08 11.8424 6.65 11.2715 6.65 10.5704C6.65 9.85938 6.08 9.28852 5.37 9.28852Z"
      fill={color}
    />
  </svg>
);

export default MsgIcon;
