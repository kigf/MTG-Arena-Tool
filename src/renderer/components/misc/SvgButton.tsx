import React from "react";
import css from "./IconButton.css";
interface SvgButtonProps {
  style?: React.CSSProperties;
  title?: string;
  svg: JSX.Element; //React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function SvgButton(props: SvgButtonProps): JSX.Element {
  const { onClick, style, title, svg } = props;
  return (
    <div
      title={title}
      className={css.svgButton}
      onClick={onClick}
      style={{ ...style }}
    >
      {svg}
    </div>
  );
}
