import { Guid } from '@microsoft/sp-core-library';
import { ISPHttpClientOptions } from '@microsoft/sp-http';

export interface IListDataService {
  getData(url: string, httpGetOptions: ISPHttpClientOptions): Promise<any[]>;
  getListItems(): Promise<any[]>;
}