import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'GetListItemsWebPartStrings';
import GetListItems from './components/GetListItems';
import { IGetListItemsProps } from './interfaces/IGetListItems';

export interface IGetListItemsWebPartProps {
  environmentType: EnvironmentType;
  context: WebPartContext;
  listTitle: string;
}

export default class GetListItemsWebPart extends BaseClientSideWebPart <IGetListItemsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGetListItemsProps> = React.createElement(
      GetListItems,
      {
        environmentType: Environment.type,
        context: this.context,
        listTitle: this.properties.listTitle
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.SettingsGroupName,
              groupFields: [
                PropertyPaneTextField('listTitle', {
                  label: strings.ListTitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
