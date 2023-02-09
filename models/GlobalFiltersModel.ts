import { QueryParameters } from './DirectusModel';

export type GlobalFiltersModel = {
  projects: {
    list: number[];
    filter: QueryParameters; // { status: { _eq : "archived" } }
  };
  affairs: {
    list: number[];
    filter: QueryParameters;
  };
  pythagore_affaires: {
    list: string[];
    filter: QueryParameters;
  };
  files: {
    list: string[];
    filter: QueryParameters;
  };
  satisfaction: {
    list: number[];
    filter: QueryParameters;
  };
  clients: {
    list: string[];
    filter: QueryParameters;
  };
  collaborators: {
    list: string[];
    filter: QueryParameters;
  };
};
