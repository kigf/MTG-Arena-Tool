import React from "react";
import css from "../../index.css";
import sharedCss from "../../../shared/shared.css";

interface CheckboxProps {
  text: string | JSX.Element;
  value: boolean;
  callback: (value: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Checkbox(props: CheckboxProps): JSX.Element {
  const { disabled, value, callback, style } = props;
  const [currentValue, setCurrentValue] = React.useState(value);

  const click = (): void => {
    if (!disabled) {
      callback(!currentValue);
      setCurrentValue(!currentValue);
    }
  };

  const disabledLabelStyle = {
    ...style,
    cursor: "default",
    opacity: 0.4
  };

  React.useEffect(() => {
    setCurrentValue(props.value);
  }, [props.value]);

  return (
    <label
      style={disabled ? disabledLabelStyle : { ...style }}
      onClick={click}
      className={css.checkContainer + (disabled ? "" : " " + sharedCss.hoverLabel)}
    >
      {props.text}
      <input type="checkbox" checked={currentValue} disabled />
      <span className={css.checkmark} />
    </label>
  );
}
