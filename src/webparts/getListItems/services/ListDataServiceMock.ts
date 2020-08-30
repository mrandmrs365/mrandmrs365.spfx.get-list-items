import { Guid, Text } from '@microsoft/sp-core-library';
import { IListItem } from '../interfaces/IListItem';
import { ISPHttpClientOptions } from '@microsoft/sp-http';

export default class ListDataServiceMock {
  
  private mockItems: IListItem[];

  constructor() {
    this.mockItems = [];
    for (let i = 1; i < 6544; i++) {
      this.mockItems.push({ guid: Guid.newGuid(), id: i, title: Text.format('Custom item {0}', i)});
    }
  }

  private async getData(url: string, httpGetOptions: ISPHttpClientOptions): Promise<any[]> {
    return new Promise<IListItem[]>((resolve) => {
      resolve(this.mockItems);
    });
  }

  public async getListItems(): Promise<any[]> {
    return new Promise<IListItem[]>((resolve) => {
      resolve(this.mockItems);
    });
  }
}