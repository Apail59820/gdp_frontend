import { GlobalFiltersModel } from '../../../models/GlobalFiltersModel';
import { compileFilter } from '../compileFilter';

export function compileGlobalFiltersToSatisfactionFilter(_globalFilters: GlobalFiltersModel) {
  const filterRules: any[] = [];
  //satisfaction:
  const satisfactionFilterRule = compileFilter(
    _globalFilters,
    'satisfaction',
    { id: { _in: _globalFilters.satisfaction.list } },
    _globalFilters.satisfaction.queryParameters.filter
  );
  if (satisfactionFilterRule != null) filterRules.push(satisfactionFilterRule);

  //satisfaction of projects
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { affairs_id: { projects_id: { _in: _globalFilters.projects.list } } },
    { affairs_id: { projects_id: _globalFilters.projects.queryParameters.filter } }
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  // satisfaction by affairs
  const AffairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { affairs_id: { _in: _globalFilters.affairs.list } },
    { affairs_id: { _in: _globalFilters.affairs.queryParameters.filter } }
  );
  if (AffairsFilterRule != null) filterRules.push(AffairsFilterRule);

  // satisfaction by pythagore_affaires
  const pythagoreAffairesFilterRule = compileFilter(
    _globalFilters,
    'pythagore_affaires',
    { affairs_id: { pythagore_affaires_id: { affairs_id: _globalFilters.pythagore_affaires.list } } },
    { affairs_id: { pythagore_affaires_id: { affairs_id: _globalFilters.pythagore_affaires.queryParameters.filter } } }
  );
  if (pythagoreAffairesFilterRule != null) filterRules.push(pythagoreAffairesFilterRule);

  // satisfaction that contains at least one of these files
  const filesFilterRule = compileFilter(
    _globalFilters,
    'files',
    { affairs_id: { projects_id: { files: _globalFilters.files.list } } },
    { affairs_id: { projects_id: { files: _globalFilters.files.queryParameters.filter } } }
  );
  if (filesFilterRule != null) filterRules.push(filesFilterRule);

  //satisfaction of company_entities
  const companyEntitiesFilterRule = compileFilter(_globalFilters, 'company_entities', {
    affairs_id: { company_entity: _globalFilters.company_entities.list },
  });
  if (companyEntitiesFilterRule != null) filterRules.push(companyEntitiesFilterRule);

  // satisfaction that contains at least one of these clients
  const clientsFilterRule = compileFilter(
    _globalFilters,
    'clients',
    {
      affairs_id: {
        projects_id: {
          projects_directus_users_clients_ids: { affairs_id: { directus_users_id: _globalFilters.clients.list } },
        },
      },
    },
    {
      affairs_id: {
        projects_id: {
          projects_directus_users_clients_ids: {
            affairs_id: { directus_users_id: _globalFilters.clients.queryParameters.filter },
          },
        },
      },
    }
  );
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);

  // satisfaction that contains at least one of these Collaborators
  const collaboratorsProjectsFilterRule = compileFilter(
    _globalFilters,
    'collaborators',
    {
      affairs_id: {
        projects_id: {
          projects_directus_users_collaborators_ids: {
            affairs_id: { directus_users_id: _globalFilters.collaborators.list },
          },
        },
      },
    },
    {
      affairs_id: {
        projects_id: {
          projects_directus_users_collaborators_ids: {
            affairs_id: { directus_users_id: _globalFilters.collaborators.queryParameters.filter },
          },
        },
      },
    }
  );
  if (collaboratorsProjectsFilterRule != null) filterRules.push(collaboratorsProjectsFilterRule);

  // satisfaction  that contains at least one of these Collaborators in its affairs
  const collaboratorsAffairsFilterRule = compileFilter(
    _globalFilters,
    'collaborators',
    {
      affairs_ids: { affairs_directus_users_ids: { directus_users_id: { _in: _globalFilters.collaborators.list } } },
    },
    {
      affairs_ids: {
        affairs_directus_users_ids: { directus_users_id: _globalFilters.collaborators.queryParameters.filter },
      },
    }
  );
  if (collaboratorsAffairsFilterRule != null) filterRules.push(collaboratorsAffairsFilterRule);
  return filterRules;
}
