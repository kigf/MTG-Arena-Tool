declare namespace AppCssModule {
  export interface IAppCss {
    movingUx: string;
    moving_ux: string;
    outerWrapper: string;
    outer_wrapper: string;
    overflowUxMain: string;
    overflow_ux_main: string;
    uxItem: string;
    ux_item: string;
    versionNumber: string;
    version_number: string;
    wrapper: string;
    wrapperMain: string;
    wrapper_main: string;
  }
}

declare const AppCssModule: AppCssModule.IAppCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppCssModule.IAppCss;
};

export = AppCssModule;
