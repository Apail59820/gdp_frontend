import { QueryParameters } from './DirectusModel';

export type GlobalFiltersModel = {
  projects: {
    list: number[];
    queryParameters: QueryParameters;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  affairs: {
    list: number[];
    queryParameters: QueryParameters;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  pythagore_affaires: {
    list: string[];
    queryParameters: QueryParameters;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  files: {
    list: string[];
    queryParameters: QueryParameters;
  };
  satisfaction: {
    list: number[];
    queryParameters: QueryParameters;
  };
  clients: {
    list: string[];
    queryParameters: QueryParameters;
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
  collaborators: {
    list: string[];
    queryParameters: QueryParameters;
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
    listWithNames: {
      name: string;
      key: string | number;
    }[];
  };
};
