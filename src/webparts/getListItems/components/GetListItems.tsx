import * as React from 'react';
import styles from './GetListItems.module.scss';
import { IGetListItemsProps, IGetListItemsState } from '../interfaces/IGetListItems';
import { escape } from '@microsoft/sp-lodash-subset';
import { EnvironmentType } from '@microsoft/sp-core-library';
import { IListDataService } from '../interfaces/IListDataService';
import ListDataService from '../services/ListDataService';
import ListDataServiceMock from '../services/ListDataServiceMock';
import { DetailsList, IColumn} from 'office-ui-fabric-react/lib/DetailsList';

export default class GetListItems extends React.Component<IGetListItemsProps, IGetListItemsState> {

  private listDataService: IListDataService;

  constructor(props: IGetListItemsProps, state: IGetListItemsState) {
    super(props);
    this.state = {
      isLoading: true,
      listItems: null,
    };

    if (this.props.environmentType === EnvironmentType.Local) {
      this.listDataService = new ListDataServiceMock();
    } else {
      this.listDataService = new ListDataService(this.props.context, this.props.listTitle);
    }

  }

  public async componentDidMount(): Promise<void> {
    let listItems = await this.listDataService.getListItems();
    this.setState({
      isLoading: false,
      listItems: listItems,
    });
  }

  public async componentWillReceiveProps(newProps: IGetListItemsProps) {
    if (newProps.listTitle !== this.props.listTitle) {
      if (this.props.environmentType !== EnvironmentType.Local) {
        this.listDataService = new ListDataService(this.props.context, newProps.listTitle);
      }
    }
    let listItems = await this.listDataService.getListItems();
    this.setState({
      isLoading: false,
      listItems: listItems,
    });
  }


  public render(): React.ReactElement<IGetListItemsProps> {
    if (this.state.isLoading) {
      return (
        <div className={styles.getListItems}>
          Fetching data...
        </div>
      );
    }

    const columns: IColumn[] = [
      { key: 'column1', name: 'Guid', fieldName: 'GUID', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Id', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Title', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
    ];

    return (
      <div className={styles.getListItems}>
        <DetailsList 
          items={this.state.listItems}
          columns={columns} />
      </div>
    );
  }
}
