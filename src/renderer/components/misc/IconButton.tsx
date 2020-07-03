import React from "react";
import css from "./IconButton.css";
interface IconButtonProps {
  style?: React.CSSProperties;
  icon: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function IconButton(props: IconButtonProps): JSX.Element {
  const { onClick, style, icon } = props;
  return (
    <div
      className={css.iconButton}
      onClick={onClick}
      style={{ ...style, backgroundImage: `url("${icon}"` }}
    ></div>
  );
}
