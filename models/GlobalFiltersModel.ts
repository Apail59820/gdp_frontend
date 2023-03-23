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
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  affairs: {
    list: number[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  pythagore_affaires: {
    list: string[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
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
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  collaborators: {
    list: string[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  company_entities: {
    list: number[];
    queryParameters: QueryParameters;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  clients_company_entities: {
    list: number[];
    queryParameters: QueryParameters;
    action: GlobalFilterActionType;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
};
