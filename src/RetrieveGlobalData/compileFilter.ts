import { GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { queryParameterContainsFilter } from '../../utils/queryParametersContainsFilter';

/**
 * @param globalFilters global filters current Data
 * @param globalFilterKey key of the list filter to use.
 * @param listFilter a filter rule that translate globalFilters list of an objects
 * @param queryFilter a filter rule that translate globalFilters filters (queryParams.filters) of an objects
 */
export function compileFilter(
  globalFilters: GlobalFiltersModel,
  globalFilterKey: keyof GlobalFiltersModel,
  listFilter: any,
  queryFilter: any
) {
  const rules: any[] = [];
  if (globalFilters[globalFilterKey].list.length > 0) rules.push(listFilter);
  if (queryParameterContainsFilter(globalFilters[globalFilterKey].queryParameters)) rules.push(queryFilter);
  if (rules.length > 0) return { _and: rules };
  else return null;
}
