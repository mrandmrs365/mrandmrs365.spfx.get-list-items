import { Guid } from '@microsoft/sp-core-library';

export interface IListItem {
  guid: Guid;
  id: number;
  title: string;
}