import React from "react";
import css from "./loading.scss";

interface LoadingBarProps {
  style?: React.CSSProperties;
}

export default function LoadingBar({ style }: LoadingBarProps): JSX.Element {
  return (
    <>
      <div style={{ ...style }} className={css.loadingBarMain}>
        <div className={css.loadingW}></div>
        <div className={css.loadingU}></div>
        <div className={css.loadingB}></div>
        <div className={css.loadingR}></div>
        <div className={css.loadingG}></div>
      </div>
    </>
  );
}
