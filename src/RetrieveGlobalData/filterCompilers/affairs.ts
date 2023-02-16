import { GlobalFiltersModel } from '../../../models/GlobalFiltersModel';
import { compileFilter } from '../compileFilter';

export function compileGlobalFiltersToAffairsFilter(_globalFilters: GlobalFiltersModel) {
  const filterRules: any[] = [];
  //affairs of projects
  const projectsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { projects_id: { _in: _globalFilters.projects.list } },
    { projects_id: { _in: _globalFilters.projects.queryParameters.filter } }
  );
  if (projectsFilterRule != null) filterRules.push(projectsFilterRule);

  //affairs
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { id: { _in: _globalFilters.affairs.list } },
    _globalFilters.affairs.queryParameters.filter
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  //affairs that are linked to these pythagore_affaires
  const pythagoreFacturesFilterRule = compileFilter(
    _globalFilters,
    'pythagore_factures',
    {
      pythagore_ids: { pythagore_affaires_id: { _in: _globalFilters.pythagore_factures.list } },
    },
    {
      pythagore_ids: { pythagore_affaires_id: _globalFilters.pythagore_factures.queryParameters.filter },
    }
  );
  if (pythagoreFacturesFilterRule != null) filterRules.push(pythagoreFacturesFilterRule);

  //affairs that contains at least one of these files, checked in projects
  const filesFilterRule = compileFilter(
    _globalFilters,
    'files',
    { projects_id: { files: { _in: _globalFilters.files.list } } },
    { projects_id: { files: _globalFilters.files.queryParameters.filter } }
  );
  if (filesFilterRule != null) filterRules.push(filesFilterRule);

  //satisfaction
  //je ne sais pas si ça a un sens ? De toute façon, on ne peut pas encore setup ce filtre

  //affairs that contains at least one of these clients
  const clientsFilterRule = compileFilter(
    _globalFilters,
    'clients',
    {
      projects_id: { projects_directus_users_clients_ids: { directus_users_id: { _in: _globalFilters.clients.list } } },
    },
    {
      projects_id: {
        projects_directus_users_clients_ids: { directus_users_id: _globalFilters.clients.queryParameters.filter },
      },
    }
  );
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);

  //affairs that contains at least one of these Collaborators in the Project
  const collaboratorsProjectsFilterRule = compileFilter(
    _globalFilters,
    'collaborators',
    {
      projects_id: {
        projects_directus_users_collaborators_ids: {
          directus_users_id: { _in: _globalFilters.collaborators.list },
        },
      },
    },
    {
      projects_id: {
        projects_directus_users_collaborators_ids: {
          directus_users_id: _globalFilters.collaborators.queryParameters.filter,
        },
      },
    }
  );
  if (collaboratorsProjectsFilterRule != null) filterRules.push(collaboratorsProjectsFilterRule);

  //affairs that contains at least one of these Collaborators
  const collaboratorsAffairsFilterRule = compileFilter(
    _globalFilters,
    'collaborators',
    {
      affairs_directus_users_ids: { directus_users_id: { _in: _globalFilters.collaborators.list } },
    },
    {
      affairs_directus_users_ids: { directus_users_id: _globalFilters.collaborators.queryParameters.filter },
    }
  );
  if (collaboratorsAffairsFilterRule != null) filterRules.push(collaboratorsAffairsFilterRule);
  return filterRules;
}
