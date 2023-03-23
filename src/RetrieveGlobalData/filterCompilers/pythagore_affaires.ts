import { GlobalFiltersModel } from '../../../models/GlobalFiltersModel';
import { compileFilter } from '../compileFilter';

export function compileGlobalFiltersToPythagoreAffairesFilter(
  _globalFilters: GlobalFiltersModel,
  additionalClients: string[] = []
) {
  const filterRules: any[] = [];
  //Pythagore affaires linked to a project through affairs:
  const projectsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { affairs_id: { affairs_id: { projects_id: { _in: _globalFilters.projects.list } } } },
    {
      affairs_id: { affairs_id: { projects_id: _globalFilters.projects.queryParameters.filter } },
    }
  );
  if (projectsFilterRule != null) filterRules.push(projectsFilterRule);

  //Pythagore affaires linked to a company entity through a project
  const companyEntitiesProjectsFilterRule = compileFilter(
    _globalFilters,
    'company_entities',
    {
      affairs_id: {
        affairs_id: { projects_id: { company_entity: { _in: _globalFilters.company_entities.list } } },
      },
    },
    {
      affairs_id: {
        affairs_id: { projects_id: { company_entity: _globalFilters.company_entities.queryParameters.filter } },
      },
    }
  );
  if (companyEntitiesProjectsFilterRule != null) filterRules.push(companyEntitiesProjectsFilterRule);

  //Pythagore affaires linked to a company entity through an affair
  const companyEntitiesAffairsFilterRule = compileFilter(
    _globalFilters,
    'company_entities',
    { affairs_id: { affairs_id: { company_entity: { _in: _globalFilters.company_entities.list } } } },
    { affairs_id: { affairs_id: { company_entity: _globalFilters.company_entities.queryParameters.filter } } }
  );
  if (companyEntitiesAffairsFilterRule != null) filterRules.push(companyEntitiesAffairsFilterRule);

  //Pythagore affaires of these affairs
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { affairs_id: { affairs_id: { _in: _globalFilters.affairs.list } } },
    { affairs_id: { affairs_id: _globalFilters.affairs.queryParameters.filter } }
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  //Pythagore affaires
  const pythagoreAffairesFilterRule = compileFilter(
    _globalFilters,
    'pythagore_affaires',
    { numero_affaire: { _in: _globalFilters.pythagore_affaires.list } },
    { numero_affaire: _globalFilters.pythagore_affaires.queryParameters.filter }
  );
  if (pythagoreAffairesFilterRule != null) filterRules.push(pythagoreAffairesFilterRule);

  //pythagore affaires that are linked to the same project as these files
  //Je ne sais pas si ça a du sens. A vous de voir
  const filesFilterRule = compileFilter(
    _globalFilters,
    'files',
    { affairs_id: { affairs_id: { projects_id: { files: { _in: _globalFilters.files.list } } } } },
    { affairs_id: { affairs_id: { projects_id: { files: _globalFilters.files.queryParameters.filter } } } }
  );
  if (filesFilterRule != null) filterRules.push(filesFilterRule);

  //satisfaction
  //je ne sais pas si ça a un sens ? De toute façon, on ne peut pas encore setup ce filtre

  //Pythagore affaires that contains at least one of these clients
  const clientsFilterRule = compileFilter(
    _globalFilters,
    'clients',
    {
      affairs_id: {
        affairs_id: {
          projects_id: {
            projects_directus_users_clients_ids: {
              directus_users_id: { _in: Array.from(new Set([..._globalFilters.clients.list, ...additionalClients])) },
            },
          },
        },
      },
    },
    {
      affairs_id: {
        affairs_id: {
          projects_id: {
            projects_directus_users_clients_ids: { directus_users_id: _globalFilters.clients.queryParameters.filter },
          },
        },
      },
    },
    additionalClients
  );
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);

  //Pythagore affaires that contains at least one of these Collaborators
  const collaboratorsProjectsFilterRule = compileFilter(
    _globalFilters,
    'collaborators',
    {
      affairs_id: {
        affairs_id: {
          projects_id: {
            projects_directus_users_collaborators_ids: {
              directus_users_id: { _in: _globalFilters.collaborators.list },
            },
          },
        },
      },
    },
    {
      affairs_id: {
        affairs_id: {
          projects_id: {
            projects_directus_users_collaborators_ids: {
              directus_users_id: _globalFilters.collaborators.queryParameters.filter,
            },
          },
        },
      },
    }
  );
  if (collaboratorsProjectsFilterRule != null) filterRules.push(collaboratorsProjectsFilterRule);

  //Pythagore affaires that contains at least one of these Collaborators in its affairs
  const collaboratorsAffairsFilterRule = compileFilter(
    _globalFilters,
    'collaborators',
    {
      affairs_id: {
        affairs_ids: {
          affairs_directus_users_ids: { directus_users_id: { _in: _globalFilters.collaborators.list } },
        },
      },
    },
    {
      affairs_id: {
        affairs_ids: {
          affairs_directus_users_ids: { directus_users_id: _globalFilters.collaborators.queryParameters.filter },
        },
      },
    }
  );
  if (collaboratorsAffairsFilterRule != null) filterRules.push(collaboratorsAffairsFilterRule);
  return filterRules;
}
