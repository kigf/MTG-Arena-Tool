declare namespace AuthCssModule {
  export interface IAuthCss {
    "form-authenticate": string;
    "form-button": string;
    "form-container": string;
    "form-error": string;
    "form-icon": string;
    "form-input-container": string;
    "form-label": string;
    "form-options": string;
    formAuthenticate: string;
    formButton: string;
    formContainer: string;
    formError: string;
    formIcon: string;
    formInputContainer: string;
    formLabel: string;
    formOptions: string;
    launchLoginLink: string;
    launch_login_link: string;
    messageSmall: string;
    message_small: string;
    privacyLink: string;
    privacy_link: string;
    signupLink: string;
    signup_link: string;
  }
}

declare const AuthCssModule: AuthCssModule.IAuthCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AuthCssModule.IAuthCss;
};

export = AuthCssModule;
