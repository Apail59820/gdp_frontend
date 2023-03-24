import { GlobalFiltersModel } from '../../../models/GlobalFiltersModel';
import { compileFilter } from '../compileFilter';

export function compileGlobalFiltersToAffairsCollaboratorsFilter(
  _globalFilters: GlobalFiltersModel,
  additionalClients: string[] = []
) {
  const filterRules: any[] = [];
  //affairsUsers of projects
  const projectsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { affairs_id: { projects_id: { _in: _globalFilters.projects.list } } },
    { affairs_id: { projects_id: _globalFilters.projects.queryParameters.filter } }
  );
  if (projectsFilterRule != null) filterRules.push(projectsFilterRule);

  //AffairsUsers of affairs
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { affairs_id: { _in: _globalFilters.affairs.list } },
    { affairs_id: _globalFilters.affairs.queryParameters.filter }
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  //AffairsUsers linked to projects of company entities
  const companyEntitiesProjectsFilterRule = compileFilter(
    _globalFilters,
    'company_entities',
    { affairs_id: { projects_id: { company_entity: { _in: _globalFilters.company_entities.list } } } },
    { affairs_id: { projects_id: { company_entity: _globalFilters.company_entities.queryParameters.filter } } }
  );
  if (companyEntitiesProjectsFilterRule != null) filterRules.push(companyEntitiesProjectsFilterRule);

  //ProjectsUsers linked to affairs of company entities
  const companyEntitiesAffairsFilterRule = compileFilter(
    _globalFilters,
    'company_entities',
    { affairs_id: { company_entity: { _in: _globalFilters.company_entities.list } } },
    { affairs_id: { company_entity: _globalFilters.company_entities.queryParameters.filter } }
  );
  if (companyEntitiesAffairsFilterRule != null) filterRules.push(companyEntitiesAffairsFilterRule);

  //AffairsUsers of PythagoreAffaires
  const pythagoreFacturesFilterRule = compileFilter(
    _globalFilters,
    'pythagore_affaires',
    {
      affairs_id: {
        pythagore_ids: { pythagore_affaires_id: { _in: _globalFilters.pythagore_affaires.list } },
      },
    },
    {
      affairs_id: {
        pythagore_ids: { pythagore_affaires_id: _globalFilters.pythagore_affaires.queryParameters.filter },
      },
    }
  );
  if (pythagoreFacturesFilterRule != null) filterRules.push(pythagoreFacturesFilterRule);

  //AffairsUsers of files
  const filesFilterRule = compileFilter(
    _globalFilters,
    'files',
    { affairs_id: { projects_id: { files: { _in: _globalFilters.files.list } } } },
    { affairs_id: { projects_id: { files: _globalFilters.files.queryParameters.filter } } }
  );
  if (filesFilterRule != null) filterRules.push(filesFilterRule);

  //Clients of projects of these affairsUsers
  const clientsFilterRule = compileFilter(
    _globalFilters,
    'clients',
    {
      affairs_id: {
        projects_id: {
          projects_directus_users_clients_ids: {
            directus_users_id: { _in: Array.from(new Set([..._globalFilters.clients.list, ...additionalClients])) },
          },
        },
      },
    },
    undefined,
    additionalClients
  );
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);

  //AffairsUsers in collaborators list.
  //Note: I added affairsUsers that have common projects or affairs with theses.
  const collaboratorsClientsFilterRule = compileFilter(_globalFilters, 'collaborators', {
    _or: [
      { directus_users_id: { _in: _globalFilters.collaborators.list } },
      {
        affairs_id: {
          projects_id: {
            projects_directus_users_collaborators_ids: {
              directus_users_id: { _in: _globalFilters.collaborators.list },
            },
          },
        },
      },
      {
        affairs_id: {
          affairs_directus_users_ids: {
            directus_users_id: { _in: _globalFilters.collaborators.list },
          },
        },
      },
    ],
  });
  if (collaboratorsClientsFilterRule != null) filterRules.push(collaboratorsClientsFilterRule);
  return filterRules;
}

export function compileGlobalFiltersToProjectsCollaboratorsFilter(
  _globalFilters: GlobalFiltersModel,
  additionalClients: string[] = []
) {
  const filterRules: any[] = [];
  //ProjectsUsers of these projects
  const projectsFilterRule = compileFilter(
    _globalFilters,
    'projects',
    { projects_id: { _in: _globalFilters.projects.list } },
    { projects_id: _globalFilters.projects.queryParameters.filter }
  );
  if (projectsFilterRule != null) filterRules.push(projectsFilterRule);

  //ProjectsUsers of these affairs
  const affairsFilterRule = compileFilter(
    _globalFilters,
    'affairs',
    { projects_id: { affairs_ids: { _in: _globalFilters.affairs.list } } },
    { projects_id: { affairs_ids: _globalFilters.affairs.queryParameters.filter } }
  );
  if (affairsFilterRule != null) filterRules.push(affairsFilterRule);

  //ProjectsUsers linked to projects of company entities
  const companyEntitiesProjectsFilterRule = compileFilter(
    _globalFilters,
    'company_entities',
    { projects_id: { company_entity: { _in: _globalFilters.company_entities.list } } },
    { projects_id: { company_entity: _globalFilters.company_entities.queryParameters.filter } }
  );
  if (companyEntitiesProjectsFilterRule != null) filterRules.push(companyEntitiesProjectsFilterRule);

  //ProjectsUsers linked to affairs of company entities
  const companyEntitiesAffairsFilterRule = compileFilter(
    _globalFilters,
    'company_entities',
    { projects_id: { affairs_ids: { company_entity: { _in: _globalFilters.company_entities.list } } } },
    { projects_id: { affairs_ids: { company_entity: _globalFilters.company_entities.queryParameters.filter } } }
  );
  if (companyEntitiesAffairsFilterRule != null) filterRules.push(companyEntitiesAffairsFilterRule);

  //ProjectsUsers that contains affairs that are linked to these pythagore_affaires
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

  //ProjectsUsers that are linked to at least one of these files
  const filesFilterRule = compileFilter(
    _globalFilters,
    'files',
    { projects_id: { files: { _in: _globalFilters.files.list } } },
    { projects_id: { files: _globalFilters.files.queryParameters.filter } }
  );
  if (filesFilterRule != null) filterRules.push(filesFilterRule);

  //ProjectsUsers of projects of these clients
  const clientsFilterRule = compileFilter(
    _globalFilters,
    'clients',
    {
      projects_id: {
        projects_directus_users_clients_ids: {
          directus_users_id: { _in: Array.from(new Set([..._globalFilters.clients.list, ...additionalClients])) },
        },
      },
    },
    undefined,
    additionalClients
  );
  if (clientsFilterRule != null) filterRules.push(clientsFilterRule);
  //Collaborators in the list.
  //Note: I added ProjectsUsers of projects and affairs of collaborators in the list.
  const collaboratorsClientsFilterRule = compileFilter(_globalFilters, 'collaborators', {
    _or: [
      { directus_users_id: { _in: _globalFilters.collaborators.list } },
      {
        projects_id: {
          projects_directus_users_collaborators_ids: { directus_users_id: { _in: _globalFilters.collaborators.list } },
        },
      },
      {
        projects_id: {
          affairs_ids: {
            affairs_directus_users_ids: { directus_users_id: { _in: _globalFilters.collaborators.list } },
          },
        },
      },
    ],
  });
  if (collaboratorsClientsFilterRule != null) filterRules.push(collaboratorsClientsFilterRule);
  return filterRules;
}
