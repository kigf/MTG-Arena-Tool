declare namespace HomeCssModule {
  export interface IHomeCss {
    arrowDown: string;
    arrowUp: string;
    arrow_down: string;
    arrow_up: string;
    listFill: string;
    list_fill: string;
    textCentered: string;
    text_centered: string;
    topWildcardsCont: string;
    topWildcardsSetIcon: string;
    topWildcardsSetsCont: string;
    topWildcardsWcIcon: string;
    top_wildcards_cont: string;
    top_wildcards_set_icon: string;
    top_wildcards_sets_cont: string;
    top_wildcards_wc_icon: string;
  }
}

declare const HomeCssModule: HomeCssModule.IHomeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HomeCssModule.IHomeCss;
};

export = HomeCssModule;
