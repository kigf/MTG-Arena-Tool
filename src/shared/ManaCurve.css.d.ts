declare namespace ManaCurveCssModule {
  export interface IManaCurveCss {
    manaCurve: string;
    manaCurveColumn: string;
    manaCurveColumnNumber: string;
    manaCurveContainer: string;
    manaCurveCosts: string;
    manaCurveNumber: string;
    manaCurveNumbers: string;
    manaCurveTag: string;
    mana_curve: string;
    mana_curve_column: string;
    mana_curve_column_number: string;
    mana_curve_container: string;
    mana_curve_costs: string;
    mana_curve_number: string;
    mana_curve_numbers: string;
    mana_curve_tag: string;
  }
}

declare const ManaCurveCssModule: ManaCurveCssModule.IManaCurveCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ManaCurveCssModule.IManaCurveCss;
};

export = ManaCurveCssModule;
