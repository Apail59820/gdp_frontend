import { QueryParameters } from './DirectusModel';

export enum GlobalFilterActionType {
  ADD = 'add',
  REPLACE = 'replace',
}

export type GlobalFiltersModel = {
  projects: {
    list: number[];
    queryParameters: QueryParameters; // { status: { _eq : "archived" } }
    action: GlobalFilterActionType;
  };
  affairs: {
    list: number[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
  };
  pythagore_affaires: {
    list: string[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
  };
  files: {
    list: string[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
  };
  satisfaction: {
    list: number[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
  };
  clients: {
    list: string[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
  };
  collaborators: {
    list: string[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
  };
  company_entities: {
    list: number[];
    queryParameters: QueryParameters;
  };
};
