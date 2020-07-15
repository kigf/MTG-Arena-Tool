import React, { CSSProperties } from "react";
import css from "./Bullet.css";

interface BulletProps {
  style?: CSSProperties;
  checked: boolean;
}

export default function Bullet(props: BulletProps): JSX.Element {
  const { style, checked } = props;
  return (
    <div
      className={`${css.bullet} ${checked && css.checked}`}
      style={{ ...style }}
    />
  );
}
