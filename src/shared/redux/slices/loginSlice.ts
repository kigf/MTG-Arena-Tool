import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOGIN_AUTH } from "../../constants";

const initialLoginState = {
  canLogin: true,
  loginForm: {
    email: "",
    pass: "",
    rememberme: false,
  },
  loginState: LOGIN_AUTH,
};

type Login = typeof initialLoginState;

const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    setLoginState: (state: Login, action: PayloadAction<number>): void => {
      state.loginState = action.payload;
    },
    setLoginPassword: (state: Login, action: PayloadAction<string>): void => {
      state.loginForm.pass = action.payload;
    },
    setLoginEmail: (state: Login, action: PayloadAction<string>): void => {
      state.loginForm.email = action.payload;
    },
    setLoginRemember: (state: Login, action: PayloadAction<boolean>): void => {
      state.loginForm.rememberme = action.payload;
    },
    setLoginForm: (
      state: Login,
      action: PayloadAction<Login["loginForm"]>
    ): void => {
      state.loginForm = action.payload;
    },
    setCanLogin: (state: Login, action: PayloadAction<boolean>): void => {
      state.canLogin = action.payload;
    },
  },
});

export const {
  setCanLogin,
  setLoginEmail,
  setLoginForm,
  setLoginPassword,
  setLoginRemember,
  setLoginState,
} = loginSlice.actions;

export default loginSlice;
