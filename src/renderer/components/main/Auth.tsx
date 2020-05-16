/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import store, { AppState } from "../../../shared/redux/stores/rendererStore";
import { shell } from "electron";
import Checkbox from "../misc/Checkbox";
import { ipcSend } from "../../rendererUtil";
import {
  HIDDEN_PW,
  IPC_NONE,
  IPC_BACKGROUND,
  IPC_ALL,
  IPC_RENDERER
} from "../../../shared/constants";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import sha1 from "js-sha1";

import css from "./auth.css";

function clickRememberMe(value: boolean): void {
  reduxAction(
    store.dispatch,
    "SET_APP_SETTINGS",
    { rememberMe: value },
    IPC_BACKGROUND
  );
}

interface AuthProps {
  authForm: { email: string; pass: string; rememberme: boolean };
}

export default function Auth(props: AuthProps): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [authForm, setAuthForm] = React.useState(props.authForm);
  const canLogin = useSelector((state: AppState) => state.login.canLogin);
  const dispatcher = useDispatch();

  const handleEmailChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setAuthForm({ ...authForm, email: event.target.value });
    },
    [authForm]
  );

  const handlePassChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setAuthForm({ ...authForm, pass: event.target.value });
    },
    [authForm]
  );

  React.useEffect(() => {
    setAuthForm(props.authForm);
  }, [props.authForm]);

  const onSubmit = React.useCallback((): void => {
    if (authForm.pass.length < 8) {
      setErrorMessage("Passwords must contain at least 8 characters.");
    } else {
      setErrorMessage("");
      const pwd = authForm.pass == HIDDEN_PW ? HIDDEN_PW : sha1(authForm.pass);
      reduxAction(dispatcher, "SET_CAN_LOGIN", false, IPC_NONE);
      reduxAction(
        dispatcher,
        "SET_APP_SETTINGS",
        { email: authForm.email },
        IPC_ALL ^ IPC_RENDERER
      );
      ipcSend("login", {
        username: authForm.email,
        password: pwd
      });
    }
  }, [dispatcher, authForm.email, authForm.pass]);

  return (
    <div className={css.formContainer}>
      <div className={css.formAuthenticate}>
        <div className={css.formIcon} />
        <div id="loginform">
          <label className={css.formLabel}>Email</label>
          <div className={css.formInputContainer}>
            <input
              onChange={handleEmailChange}
              type="email"
              id="signin_email"
              autoComplete="off"
              value={authForm.email}
            />
          </div>
          <label className={css.formLabel}>Password</label>
          <div className={css.formInputContainer}>
            <input
              onChange={handlePassChange}
              type="password"
              id="signin_pass"
              autoComplete="off"
              value={authForm.pass}
            />
          </div>
          <div
            style={{
              color: "var(--color-mid-75)",
              cursor: "pointer",
              marginBottom: "16px"
            }}
          >
            <a
              onClick={(): void => {
                shell.openExternal("https://mtgatool.com/resetpassword/");
              }}
              className={"forgot_link"}
            >
              Forgot your password?
            </a>
          </div>
          <button
            className={css.formButton}
            type="submit"
            id="submit"
            onClick={onSubmit}
            disabled={!canLogin}
          >
            Login
          </button>
          <div className={css.formError}>{errorMessage}</div>
        </div>
      </div>
      <div className={css.formOptions}>
        <Checkbox
          style={{ width: "max-content", margin: "auto auto 12px auto" }}
          text="Remember me?"
          value={authForm.rememberme}
          callback={clickRememberMe}
        />
        <div className={css.message_small}>
          Dont have an account?{" "}
          <a
            onClick={(): void => {
              shell.openExternal("https://mtgatool.com/signup/");
            }}
            className={css.signupLink}
          >
            Sign up!
          </a>
        </div>
        <div className={css.messageSmall}>
          You can also{" "}
          {canLogin ? (
            <a
              onClick={(): void => {
                ipcSend("login", { username: "", password: "" });
              }}
              className={"offline_link"}
            >
              continue offline
            </a>
          ) : (
            "continue offline"
          )}
        </div>
      </div>
    </div>
  );
}
