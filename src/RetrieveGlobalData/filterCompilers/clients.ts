import { GlobalFiltersModel } from '../../../models/GlobalFiltersModel';
import { compileFilter } from '../compileFilter';

export function compileGlobalFiltersToClientsFilter(_globalFilters: GlobalFiltersModel) {
  const filterRules: any[] = [];
  //projets that contains at least one of the clients
  const projectsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { projects_id: { _in: _globalFilters.projects.list } },
    { projects_id: _globalFilters.projects.queryParameters.filter }
  );
  if (projectsFilterRule != null) filterRules.push(projectsFilterRule);

  //clients contains at least one of the affairs
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { projects_id: { affairs_ids: { _in: _globalFilters.affairs.list } } },
    { projects_id: { affairs_ids: _globalFilters.affairs.queryParameters.filter } }
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  //clients that contains affairs that are linked to these pythagore_affaires
  const pythagoreFacturesFilterRule = compileFilter(
    _globalFilters,
    'pythagore_affaires',
    {
      projects_id: {
        affairs_ids: {
          pythagore_ids: { pythagore_affaires_id: { _in: _globalFilters.pythagore_affaires.list } },
        },
      },
    },
    {
      projects_id: {
        affairs_ids: {
          pythagore_ids: { pythagore_affaires_id: _globalFilters.pythagore_affaires.queryParameters.filter },
        },
      },
    }
  );
  if (pythagoreFacturesFilterRule != null) filterRules.push(pythagoreFacturesFilterRule);

  //clients that contains at least one of these files
  const filesFilterRule = compileFilter(
    _globalFilters,
    'files',
    { projects_id: { files: { _in: _globalFilters.files.list } } },
    { projects_id: { files: _globalFilters.files.queryParameters.filter } }
  );
  if (filesFilterRule != null) filterRules.push(filesFilterRule);

  //Clients of the list. We can't apply filters in this database
  const clientsFilterRule = compileFilter(_globalFilters, 'clients', {
    directus_users_id: { _in: _globalFilters.clients.list },
  });
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);

  //clients of projects of these collaborators
  const collaboratorsClientsFilterRule = compileFilter(_globalFilters, 'collaborators', {
    projects_id: {
      projects_directus_users_collaborators_ids: {
        directus_users_id: { _in: _globalFilters.collaborators.list },
      },
    },
  });
  if (collaboratorsClientsFilterRule != null) filterRules.push(collaboratorsClientsFilterRule);

  //clients that contains at least one of these Collaborators in its affairs
  const collaboratorsAffairsFilterRule = compileFilter(_globalFilters, 'collaborators', {
    projects_id: {
      affairs_ids: { affairs_directus_users_ids: { directus_users_id: { _in: _globalFilters.collaborators.list } } },
    },
  });
  if (collaboratorsAffairsFilterRule != null) filterRules.push(collaboratorsAffairsFilterRule);
  return filterRules;
}
