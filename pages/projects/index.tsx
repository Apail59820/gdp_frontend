import React, { useEffect, useState } from 'react';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { useSelector } from 'react-redux';
import { selectProjects } from '../../store/reducers/projectsReducer';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { QueryParameters } from '../../models/DirectusModel';
import { RetrieveClientsOfClientsCompanyEntities } from '../../src/RetrieveGlobalData/RetrieveClientsOfClientsCompanyEntities';
import { compileGlobalFiltersToProjectFilter } from '../../src/RetrieveGlobalData/filterCompilers/projects';
import { getGdpProjects } from '../../services/gestionDeProjets/GdpProjects';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import ProjectsPage from '../../src/ProjectsPage/ProjectsPage';

const Projects = () => {
  const globalFilters = useSelector(selectGlobalFilters);
  const globalProjects = useSelector(selectProjects);
  const [projectsQueryParameters, setProjectsQueryParameters] = useState<QueryParameters>({});
  const [projects, setProjects] = useState<Partial<GdpProjectsModel>[]>(globalProjects);

  async function retrieveData() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToProjectFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (projectsQueryParameters.filter) filterRules.push(projectsQueryParameters.filter);
    const projectsResponse = await getGdpProjects({
      limit: '20',
      offset: '0',
      ...globalFilters.projects.queryParameters,
      ...projectsQueryParameters,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
    });
    if (isRequestSuccessful(projectsResponse.status) && projectsResponse.data) setProjects(projectsResponse.data);
  }

  useEffect(() => {
    if (Object.keys(projectsQueryParameters).length > 0) retrieveData();
    else setProjects(globalProjects);
  }, [projectsQueryParameters]);

  useEffect(() => {
    if (Object.keys(projectsQueryParameters).length == 0) setProjects(globalProjects);
  }, [globalProjects]);

  return <ProjectsPage projects={projects} setSpecificFilters={setProjectsQueryParameters} />;
};

export default Projects;
