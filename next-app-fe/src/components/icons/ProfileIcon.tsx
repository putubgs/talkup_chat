import React, { FC } from "react";

interface ProfileIconProps {
  size?: number;
  color?: string;
}

const ProfileIcon: FC<ProfileIconProps> = ({ size, color }) => (
  <svg
    style={{
      width: size ? `${size}%` : "100%",
      height: "auto",
    }}
    viewBox="0 0 17 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.77881 13.9693C13.1174 13.9693 16.7788 14.6743 16.7788 17.3944C16.7788 20.1154 13.0934 20.7954 8.77881 20.7954C4.44118 20.7954 0.778809 20.0904 0.778809 17.3704C0.778809 14.6493 4.46419 13.9693 8.77881 13.9693ZM8.77881 0.79541C11.7179 0.79541 14.0728 3.14943 14.0728 6.08646C14.0728 9.02349 11.7179 11.3785 8.77881 11.3785C5.84071 11.3785 3.48482 9.02349 3.48482 6.08646C3.48482 3.14943 5.84071 0.79541 8.77881 0.79541Z"
      fill={color}
    />
  </svg>
);

export default ProfileIcon;
