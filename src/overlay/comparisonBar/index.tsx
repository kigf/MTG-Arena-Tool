import React from "react";
import css from "./index.css";

interface BarProps {
  leftVal: number;
  rightVal: number;
}

export function ComparisonBar(props: BarProps): JSX.Element {
  const { leftVal, rightVal } = props;

  const total = leftVal + rightVal;
  let leftWidth = (100 / total) * leftVal;
  let rightWidth = (100 / total) * rightVal;

  if (leftVal == 0 && rightVal == 0) {
    leftWidth = 50;
    rightWidth = 50;
  }

  return (
    <div className={css.container}>
      <div className={css.left} style={{ width: `calc(${leftWidth}% - 1px)` }}>
        <div className={css.innerNumber}>{leftVal}</div>
      </div>
      <div
        className={css.right}
        style={{ width: `calc(${rightWidth}% - 1px)` }}
      >
        <div className={css.innerNumber}>{rightVal}</div>
      </div>
    </div>
  );
}

interface BarArrayProps {
  leftVal: number[];
  rightVal: number[];
}

export function ComparisonBarArray(props: BarArrayProps): JSX.Element {
  let { leftVal, rightVal } = props;
  if (leftVal.length == 0) {
    leftVal = [1];
  }
  if (rightVal.length == 0) {
    rightVal = [1];
  }

  const leftTotal = leftVal.reduce((acc, cur) => acc + cur, 0);
  const rightTotal = rightVal.reduce((acc, cur) => acc + cur, 0);

  return (
    <div className={css.container}>
      <div className={css.arrayBarSide}>
        {leftVal.reverse().map((val, index) => {
          const width = (100 / leftTotal) * val;
          return (
            <div
              key={"left-" + index}
              className={css.arrayLeft}
              style={{ width: `calc(${width}% - 2px)` }}
            />
          );
        })}
      </div>
      <div className={css.arrayBarSide}>
        {rightVal.map((val, index) => {
          const width = (100 / rightTotal) * val;
          return (
            <div
              key={"right-" + index}
              className={css.arrayRight}
              style={{ width: `calc(${width}% - 2px)` }}
            />
          );
        })}
      </div>
    </div>
  );
}
