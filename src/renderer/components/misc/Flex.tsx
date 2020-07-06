import React, { PropsWithChildren } from "react";

export default function Flex(props: PropsWithChildren<any>): JSX.Element {
  return (
    <div style={{ display: "flex" }} {...props}>
      {props.children}
    </div>
  );
}
