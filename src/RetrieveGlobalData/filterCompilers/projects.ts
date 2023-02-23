import { GlobalFiltersModel } from '../../../models/GlobalFiltersModel';
import { compileFilter } from '../compileFilter';

export function compileGlobalFiltersToProjectFilter(_globalFilters: GlobalFiltersModel) {
  const filterRules: any[] = [];
  //projects:
  const projectsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { id: { _in: _globalFilters.projects.list } },
    _globalFilters.projects.queryParameters.filter
  );
  if (projectsFilterRule != null) filterRules.push(projectsFilterRule);

  //projects of company_entities
  const companyEntitiesFilterRule = compileFilter(_globalFilters, 'company_entities', {
    company_entity: { _in: _globalFilters.company_entities.list },
  });
  if (projectsFilterRule != null) filterRules.push(companyEntitiesFilterRule);

  //affairs by projects of company_entities
  const companyEntitiesAffairsFilterRule = compileFilter(_globalFilters, 'company_entities', {
    affairs_id: { company_entity: _globalFilters.company_entities.list },
  });
  if (companyEntitiesAffairsFilterRule != null) filterRules.push(companyEntitiesAffairsFilterRule);

  //projects contains at least one of the affairs
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { affairs_ids: { _in: _globalFilters.affairs.list } },
    { affairs_ids: _globalFilters.affairs.queryParameters.filter }
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  //projects that contains affairs that are linked to these pythagore_affaires
  const pythagoreFacturesFilterRule = compileFilter(
    _globalFilters,
    'pythagore_affaires',
    {
      affairs_ids: {
        pythagore_ids: { pythagore_affaires_id: { _in: _globalFilters.pythagore_affaires.list } },
      },
    },
    {
      affairs_ids: {
        pythagore_ids: { pythagore_affaires_id: _globalFilters.pythagore_affaires.queryParameters.filter },
      },
    }
  );
  if (pythagoreFacturesFilterRule != null) filterRules.push(pythagoreFacturesFilterRule);

  //projects that contains at least one of these files
  const filesFilterRule = compileFilter(
    _globalFilters,
    'files',
    { files: { _in: _globalFilters.files.list } },
    { files: _globalFilters.files.queryParameters.filter }
  );
  if (filesFilterRule != null) filterRules.push(filesFilterRule);

  //satisfaction
  //je ne sais pas si ça a un sens ? De toute façon, on ne peut pas encore setup ce filtre

  //projects that contains at least one of these clients
  const clientsFilterRule = compileFilter(
    _globalFilters,
    'clients',
    {
      projects_directus_users_clients_ids: { directus_users_id: { _in: _globalFilters.clients.list } },
    },
    {
      projects_directus_users_clients_ids: { directus_users_id: _globalFilters.clients.queryParameters.filter },
    }
  );
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);

  //projects that contains at least one of these Collaborators
  const collaboratorsProjectsFilterRule = compileFilter(
    _globalFilters,
    'collaborators',
    {
      projects_directus_users_collaborators_ids: {
        directus_users_id: { _in: _globalFilters.collaborators.list },
      },
    },
    {
      projects_directus_users_collaborators_ids: {
        directus_users_id: _globalFilters.collaborators.queryParameters.filter,
      },
    }
  );
  if (collaboratorsProjectsFilterRule != null) filterRules.push(collaboratorsProjectsFilterRule);

  //projects that contains at least one of these Collaborators in its affairs
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
