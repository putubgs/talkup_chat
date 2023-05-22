import React, { FC } from "react";

interface SettingsIconProps {
  size?: number;
  color?: string;
}

const SettingsIcon: FC<SettingsIconProps> = ({ size, color }) => (
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
      d="M10.996 0.0454102C11.7523 0.0454102 12.437 0.46541 12.8151 1.08541C12.9991 1.38541 13.1217 1.75541 13.091 2.14541C13.0706 2.44541 13.1626 2.74541 13.3261 3.02541C13.8473 3.87541 15.0021 4.19541 15.9014 3.71541C16.9132 3.13541 18.1906 3.48541 18.7731 4.47541L19.4578 5.65541C20.0506 6.64541 19.7236 7.91541 18.7016 8.48541C17.8329 8.99541 17.5263 10.1254 18.0475 10.9854C18.2111 11.2554 18.395 11.4854 18.6812 11.6254C19.0388 11.8154 19.3148 12.1154 19.5089 12.4154C19.8871 13.0354 19.8564 13.7954 19.4885 14.4654L18.7731 15.6654C18.395 16.3054 17.6899 16.7054 16.9643 16.7054C16.6066 16.7054 16.208 16.6054 15.881 16.4054C15.6153 16.2354 15.3087 16.1754 14.9817 16.1754C13.9699 16.1754 13.1217 17.0054 13.091 17.9954C13.091 19.1454 12.1508 20.0454 10.9756 20.0454H9.58573C8.40026 20.0454 7.46006 19.1454 7.46006 17.9954C7.43962 17.0054 6.5914 16.1754 5.57966 16.1754C5.24241 16.1754 4.93583 16.2354 4.68034 16.4054C4.35331 16.6054 3.94453 16.7054 3.59706 16.7054C2.86125 16.7054 2.1561 16.3054 1.77798 15.6654L1.07283 14.4654C0.694704 13.8154 0.674265 13.0354 1.05239 12.4154C1.2159 12.1154 1.52249 11.8154 1.86996 11.6254C2.1561 11.4854 2.34006 11.2554 2.51379 10.9854C3.02477 10.1254 2.71818 8.99541 1.84952 8.48541C0.837778 7.91541 0.510752 6.64541 1.09327 5.65541L1.77798 4.47541C2.37071 3.48541 3.63794 3.13541 4.6599 3.71541C5.549 4.19541 6.70381 3.87541 7.22501 3.02541C7.38853 2.74541 7.4805 2.44541 7.46006 2.14541C7.43962 1.75541 7.55204 1.38541 7.74621 1.08541C8.12433 0.46541 8.80905 0.0654102 9.55507 0.0454102H10.996ZM10.2909 7.22541C8.68641 7.22541 7.38853 8.48541 7.38853 10.0554C7.38853 11.6254 8.68641 12.8754 10.2909 12.8754C11.8954 12.8754 13.1626 11.6254 13.1626 10.0554C13.1626 8.48541 11.8954 7.22541 10.2909 7.22541Z"
      fill={color}
    />
  </svg>
);

export default SettingsIcon;
