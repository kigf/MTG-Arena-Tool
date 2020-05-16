import React from "react";
import indexCss from "../../index.css";

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <div
      style={props.style || {}}
      onClick={props.onClick}
      className={props.className ?? indexCss.buttonSimple + " " + indexCss.centered}
    >
      {props.text}
    </div>
  );
}
