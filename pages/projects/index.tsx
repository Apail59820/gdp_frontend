import React, { useEffect, useState } from 'react';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { useSelector } from 'react-redux';
import { selectProjects, selectProjectsCount } from '../../store/reducers/projectsReducer';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { QueryParameters } from '../../models/DirectusModel';
import { RetrieveClientsOfClientsCompanyEntities } from '../../src/RetrieveGlobalData/RetrieveClientsOfClientsCompanyEntities';
import { compileGlobalFiltersToProjectFilter } from '../../src/RetrieveGlobalData/filterCompilers/projects';
import { getGdpProjects } from '../../services/gestionDeProjets/GdpProjects';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import ProjectsPage from '../../src/ProjectsPage/ProjectsPage';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const Projects = () => {
  const globalFilters = useSelector(selectGlobalFilters);
  const globalProjects = useSelector(selectProjects);
  const globalProjectsCount = useSelector(selectProjectsCount);

  const [projectsQueryParameters, setProjectsQueryParameters] = useState<Omit<QueryParameters, 'limit' | 'offset'>>({});
  const [projects, setProjects] = useState<Partial<GdpProjectsModel>[]>(globalProjects);
  const [projectsCount, setProjectsCount] = useState<number | null>(null);
  const [lazyLoadingState, setLazyLoadingState] = useState<LazyLoadingStateType>({
    limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE,
    offset: 0,
    action: 'REPLACE',
  });

  async function retrieveData() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToProjectFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (projectsQueryParameters.filter) filterRules.push(projectsQueryParameters.filter);
    const projectsResponse = await getGdpProjects({
      ...globalFilters.projects.queryParameters,
      ...projectsQueryParameters,
      limit: lazyLoadingState.limit,
      offset: lazyLoadingState.offset,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
    });
    if (isRequestSuccessful(projectsResponse.status) && projectsResponse.data) {
      if (lazyLoadingState.action == 'REPLACE') setProjects(projectsResponse.data);
      else setProjects([...projects, ...projectsResponse.data]);
    }
  }

  async function retrieveCount() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToProjectFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (projectsQueryParameters.filter) filterRules.push(projectsQueryParameters.filter);
    const projectsCountResponse = await getGdpProjects({
      ...globalFilters.projects.queryParameters,
      ...projectsQueryParameters,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
      limit: undefined,
      offset: undefined,
      aggregate: { count: 'id' },
    });
    if (isRequestSuccessful(projectsCountResponse.status) && projectsCountResponse.data) {
      setProjectsCount(parseInt((projectsCountResponse.data as any)[0].count.id));
    }
  }

  useEffect(() => {
    if (Object.keys(projectsQueryParameters).length > 0 || lazyLoadingState.action !== 'REPLACE') retrieveData();
    else setProjects(globalProjects);
  }, [projectsQueryParameters, lazyLoadingState]);

  useEffect(() => {
    if (Object.keys(projectsQueryParameters).length > 0) retrieveCount();
    else setProjectsCount(globalProjectsCount);
  }, [projectsQueryParameters]);

  useEffect(() => {
    if (Object.keys(projectsQueryParameters).length == 0) setProjects(globalProjects);
  }, [globalProjects]);

  return (
    <ProjectsPage
      projects={projects}
      setSpecificFilters={setProjectsQueryParameters}
      projectsCount={projectsCount}
      lazyLoadingState={lazyLoadingState}
      setLazyLoadingState={setLazyLoadingState}
    />
  );
};

export default Projects;
