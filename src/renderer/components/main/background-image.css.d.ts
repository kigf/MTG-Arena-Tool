declare namespace BackgroundImageCssModule {
  export interface IBackgroundImageCss {
    mainWrapper: string;
    main_wrapper: string;
  }
}

declare const BackgroundImageCssModule: BackgroundImageCssModule.IBackgroundImageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BackgroundImageCssModule.IBackgroundImageCss;
};

export = BackgroundImageCssModule;
