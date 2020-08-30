import { EnvironmentType } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IGetListItemsProps {
  environmentType: EnvironmentType;
  context: WebPartContext;
  listTitle: string;
}
export interface IGetListItemsState {
  isLoading: boolean;
  listItems: any[];
}
