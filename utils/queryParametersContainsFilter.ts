import { QueryParameters } from '../models/DirectusModel';

/**
 * return true if the QueryParameter contains filter rules.
 */
export function queryParameterContainsFilter(queryParameter: QueryParameters) {
  return queryParameter?.filter && Object.keys(queryParameter.filter).length > 0;
}
