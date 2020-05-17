declare namespace TypesStatsCssModule {
  export interface ITypesStatsCss {
    typeArt: string;
    typeCre: string;
    typeEnc: string;
    typeIcon: string;
    typeIconCont: string;
    typeIns: string;
    typeLan: string;
    typePla: string;
    typeSor: string;
    type_art: string;
    type_cre: string;
    type_enc: string;
    type_icon: string;
    type_icon_cont: string;
    type_ins: string;
    type_lan: string;
    type_pla: string;
    type_sor: string;
    typesContainer: string;
    types_container: string;
  }
}

declare const TypesStatsCssModule: TypesStatsCssModule.ITypesStatsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TypesStatsCssModule.ITypesStatsCss;
};

export = TypesStatsCssModule;
