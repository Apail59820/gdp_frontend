import { getUsClientsCompanyEntitiesUsers } from '../../services/userService/UsClientsCompanyEntitiesUsers';
import { GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';

/**
 * compiles globalFilters.clients_company_entities into a filter rule and retrieves all clients linked to clientsCompanyEntities filters
 * @param globalFilters
 * @returns an array of clients ids
 */
export async function RetrieveClientsOfClientsCompanyEntities(globalFilters: GlobalFiltersModel): Promise<string[]> {
  //retrieve clients linked to clientsCompanyEntities
  const clientsOfClientsCompanyEntities: string[] = [];
  const OrRules: any[] = [];
  if (globalFilters.clients_company_entities.list.length > 0)
    OrRules.push({
      clients_company_entities_id: {
        _in: globalFilters.clients_company_entities.list,
      },
    });
  if (globalFilters.clients_company_entities.queryParameters.filter)
    OrRules.push(globalFilters.clients_company_entities.queryParameters.filter);

  if (OrRules.length == 0) return [];

  const clientsCompanyUsersRes = await getUsClientsCompanyEntitiesUsers({
    fields: 'directus_users_id',
    filter: { _or: OrRules },
  });
  if (isRequestSuccessful(clientsCompanyUsersRes.status) && clientsCompanyUsersRes.data) {
    clientsOfClientsCompanyEntities.push(
      ...clientsCompanyUsersRes.data.map((item) => item.directus_users_id as string)
    );
  }
  return clientsOfClientsCompanyEntities;
}
