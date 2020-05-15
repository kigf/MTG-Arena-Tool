declare namespace MainCssModule {
  export interface IMainCss {
    popup: string;
  }
}

declare const MainCssModule: MainCssModule.IMainCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MainCssModule.IMainCss;
};

export = MainCssModule;
