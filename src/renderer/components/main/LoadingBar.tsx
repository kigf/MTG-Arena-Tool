import React from "react";
import css from "./loading.scss";

interface LoadingBarProps {
  style?: React.CSSProperties;
}

export default function LoadingBar({ style }: LoadingBarProps): JSX.Element {
  return (
    <>
      <div style={{ ...style }} className={css.loadingBarMain}>
        <div className={`${css.loadingW} ${css.loadingColor}`}></div>
        <div className={`${css.loadingU} ${css.loadingColor}`}></div>
        <div className={`${css.loadingB} ${css.loadingColor}`}></div>
        <div className={`${css.loadingR} ${css.loadingColor}`}></div>
        <div className={`${css.loadingG} ${css.loadingColor}`}></div>
      </div>
    </>
  );
}
