import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Guid, Text } from '@microsoft/sp-core-library';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import { IListItem } from '../interfaces/IListItem';

export default class ListDataService {
  private spHttpClient: SPHttpClient;
  private webUrl: string;
  private listTitle: string;

  constructor(context: WebPartContext, listTitle: string) {
    this.spHttpClient = context.spHttpClient;
    this.webUrl = context.pageContext.web.absoluteUrl;
    this.listTitle = listTitle;
  }

  public async getData(url: string, httpGetOptions: ISPHttpClientOptions): Promise<any> {
    const response = await this.spHttpClient.get(url, SPHttpClient.configurations.v1, httpGetOptions);
    const responseJson: any = await response.json();
    let result = {};
    if (responseJson.value.length) {
        result = {
            items: responseJson.value,
            nextLink: responseJson['@odata.nextLink'],
        };
    }
    else {
        result = null;
    }
    return result;
  }


  public async getListItems(): Promise<IListItem[]> {

    const fields: string[] = ['GUID', 'Id', 'Title'];
    const select: string = Text.format('$select={0}', fields.join(','));
    let endpoint: string = Text.format('{0}/_api/web/lists/getbytitle(\'{1}\')/items?{2}', this.webUrl, this.listTitle, select);

    const httpGetOptions: ISPHttpClientOptions = {
      headers: {
        'accept': 'application/json',
      },
    };

    let getMore = true;
    let listItems: IListItem[] = [];
    while (getMore) {
      let result: any = await this.getData(endpoint, httpGetOptions);
      if (result !== null) {
        listItems = listItems.concat(result.items);
        if (result.nextLink !== undefined) {
          endpoint = result.nextLink;
        } else {
          getMore = false;
        }
      } else {
        getMore = false;
      }
    }
    return listItems;
  }
}