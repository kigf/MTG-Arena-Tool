declare namespace SelectScssModule {
  export interface ISelectScss {
    active: string;
    light: string;
    "react-autosuggest__input": string;
    "react-autosuggest__suggestion--highlighted": string;
    "react-autosuggest__suggestions-list": string;
    reactAutosuggestInput: string;
    reactAutosuggestSuggestionHighlighted: string;
    reactAutosuggestSuggestionsList: string;
    select: string;
    "select-hidden": string;
    "select-options": string;
    "select-styled": string;
    selectButton: string;
    selectContainer: string;
    selectHidden: string;
    selectOption: string;
    selectOptions: string;
    selectOptionsContainer: string;
    selectStyled: string;
    selectTitle: string;
    select_button: string;
    select_container: string;
    select_option: string;
    select_options_container: string;
    select_title: string;
    "settings-select": string;
    settingsSelect: string;
  }
}

declare const SelectScssModule: SelectScssModule.ISelectScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectScssModule.ISelectScss;
};

export = SelectScssModule;
