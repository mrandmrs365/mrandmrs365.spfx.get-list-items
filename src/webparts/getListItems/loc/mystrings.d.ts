declare interface IGetListItemsWebPartStrings {
  PropertyPaneDescription: string;
  SettingsGroupName: string;
  ListTitleFieldLabel: string;
}

declare module 'GetListItemsWebPartStrings' {
  const strings: IGetListItemsWebPartStrings;
  export = strings;
}
