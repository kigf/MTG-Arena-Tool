declare namespace FormsCssModule {
  export interface IFormsCss {
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
  }
}

declare const FormsCssModule: FormsCssModule.IFormsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FormsCssModule.IFormsCss;
};

export = FormsCssModule;
