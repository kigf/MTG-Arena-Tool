import React, { useState, useCallback, useMemo } from "react";
import DayPicker from "react-day-picker";

export default function useDatePicker(
  initialDateFrom: Date,
  editCallback?: (range: Date) => void,
  closeCallback?: (range: Date) => void
): [Date, () => void, JSX.Element] {
  const initState = {
    from: initialDateFrom,
    to: new Date()
  };
  const [range, setRange] = useState(initState);
  const [show, setShow] = useState(false);

  const handleClose = useCallback(
    e => {
      e.stopPropagation();
      setShow(false);
      if (closeCallback) {
        closeCallback(range.from);
      }
    },
    [closeCallback, range]
  );

  const handleDayClick = useCallback(
    (day: Date): void => {
      const r = { from: day, to: new Date() };
      setRange(r);
      if (editCallback) {
        editCallback(r.from);
      }
    },
    [editCallback]
  );

  const handleResetClick = useCallback((): void => {
    setRange(initState);
  }, [initState]);

  const modifiers = { start: range.from, end: new Date() };

  const doShow = useCallback(() => {
    setShow(true);
  }, []);

  const elem = useMemo((): JSX.Element => {
    return show ? (
      <div className="picker-background" onClick={handleClose}>
        <div
          className="picker-div"
          style={{
            fontFamily: "var(--main-font-name)",
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "4px",
            color: "black"
          }}
          onClick={(e): void => {
            e.stopPropagation();
          }}
        >
          <div className="RangeExample">
            <p>
              {!range.from && "Please select the first day."}
              {range.from &&
                `Selected from ${range.from.toLocaleDateString()} to
                ${new Date().toLocaleDateString()}`}{" "}
              {range.from && range.to && (
                <button className="link" onClick={handleResetClick}>
                  Reset
                </button>
              )}
            </p>
            <DayPicker
              className="Selectable"
              numberOfMonths={2}
              selectedDays={[range.from, { from: range.from, to: new Date() }]}
              modifiers={modifiers}
              onDayClick={handleDayClick}
            />
          </div>
        </div>
      </div>
    ) : (
      <></>
    );
  }, [modifiers, show, handleClose, handleResetClick, handleDayClick, range]);

  return [range.from, doShow, elem];
}
