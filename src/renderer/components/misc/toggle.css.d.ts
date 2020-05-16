declare namespace ToggleCssModule {
  export interface IToggleCss {
    switch: string;
    "switch-container": string;
    "switch-label": string;
    switchContainer: string;
    switchLabel: string;
    switchslider: string;
  }
}

declare const ToggleCssModule: ToggleCssModule.IToggleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToggleCssModule.IToggleCss;
};

export = ToggleCssModule;
