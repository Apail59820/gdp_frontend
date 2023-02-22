import { GlobalFiltersModel } from '../../../models/GlobalFiltersModel';
import { compileFilter } from '../compileFilter';

export function compileGlobalFiltersToPythagoreAffairesFilter(_globalFilters: GlobalFiltersModel) {
  // num_affaire.affairs_id.affairs_id.projects_id.*
  const filterRules: any[] = [];
  //factures linked to a project through affairs:
  const projectsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { affairs_id: { affairs_id: { projects_id: { _in: _globalFilters.projects.list } } } },
    {
      affairs_id: { affairs_id: { projects_id: { _in: _globalFilters.projects.queryParameters.filter } } },
    }
  );
  if (projectsFilterRule != null) filterRules.push(projectsFilterRule);

  //company_entities of pythagore_affairs
  const companyEntitiesFilterRule = compileFilter(_globalFilters, 'company_entities', {
    company_entities: [_globalFilters.pythagore_affaires.list],
  });
  if (companyEntitiesFilterRule != null) filterRules.push(companyEntitiesFilterRule);

  //factures of these affairs
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { affairs_id: { affairs_id: { _in: _globalFilters.affairs.list } } },
    { affairs_id: { affairs_id: { _in: _globalFilters.affairs.queryParameters.filter } } }
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  //factures
  const pythagoreAffairesFilterRule = compileFilter(
    _globalFilters,
    'pythagore_affaires',
    { num_affaire: { _in: _globalFilters.pythagore_affaires.list } },
    _globalFilters.pythagore_affaires.queryParameters.filter
  );
  if (pythagoreAffairesFilterRule != null) filterRules.push(pythagoreAffairesFilterRule);

  //factures that are linked to the same project as these files
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

  //Pythagore Factures that contains at least one of these clients
  const clientsFilterRule = compileFilter(
    _globalFilters,
    'clients',
    {
      affairs_id: {
        affairs_id: {
          projects_id: {
            projects_directus_users_clients_ids: { directus_users_id: { _in: _globalFilters.clients.list } },
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
    }
  );
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);

  //Pythagore Factures that contains at least one of these Collaborators
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

  //Pythagore Factures that contains at least one of these Collaborators in its affairs
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
