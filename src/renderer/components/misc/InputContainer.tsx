import React from "react";
import indexCss from "../../index.css";

export function InputContainer(
  props: React.PropsWithChildren<any>
): JSX.Element {
  return (
    <div
      {...props}
      className={(props.className ?? "") + " " + indexCss.inputContainer}
    >
      {props.children}
    </div>
  );
}
