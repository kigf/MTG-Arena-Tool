declare namespace AuthCssModule {
  export interface IAuthCss {
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
