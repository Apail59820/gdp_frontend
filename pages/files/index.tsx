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
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';
import FilesPage from '../../src/FilesPage/FilesPage';
import { GdpFilesModel } from '../../models/GestionDeProjets/GdpFilesModel';
import { selectFiles, selectFilesCount } from '../../store/reducers/filesReducer';
import { compileGlobalFiltersToFilesFilter } from '../../src/RetrieveGlobalData/filterCompilers/files';
import { getGdpFiles } from '../../services/gestionDeProjets/GdpFiles';

const { publicRuntimeConfig } = getConfig();

const Files = () => {
  const globalFilters = useSelector(selectGlobalFilters);
  const globalProjects = useSelector(selectProjects);
  const globalProjectsCount = useSelector(selectProjectsCount);

  const globalFiles = useSelector(selectFiles);
  const globalFilesCount = useSelector(selectFilesCount);

  const [projectsQueryParameters, setProjectsQueryParameters] = useState<Omit<QueryParameters, 'limit' | 'offset'>>({});
  const [projects, setProjects] = useState<Partial<GdpProjectsModel>[]>(globalProjects);
  const [projectsCount, setProjectsCount] = useState<number | null>(globalProjectsCount);

  const [filesQueryParameters, setFilesQueryParameters] = useState<Omit<QueryParameters, 'limit' | 'offset'>>({});
  const [files, setFiles] = useState<Partial<GdpFilesModel>[]>(globalFiles);
  const [filesCount, setFilesCount] = useState<number | null>(globalFilesCount);

  const [lazyLoadingState, setLazyLoadingState] = useState<LazyLoadingStateType>({
    limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE,
    offset: 0,
    action: 'REPLACE',
  });

  async function retrieveData() {
    retrieveDataProjects();
    retrieveDataFiles();
  }
  async function retrieveCount() {
    retrieveCountProjects();
    retrieveCountFiles();
  }

  async function retrieveDataFiles() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToFilesFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (filesQueryParameters.filter) filterRules.push(filesQueryParameters.filter);
    const filesResponse = await getGdpFiles({
      ...globalFilters.files.queryParameters,
      ...filesQueryParameters,
      limit: lazyLoadingState.limit,
      offset: lazyLoadingState.offset,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
    });
    if (filesResponse.ok && filesResponse.data) {
      if (lazyLoadingState.action == 'REPLACE') setFiles(filesResponse.data);
      else setFiles([...files, ...filesResponse.data]);
    }
  }
  async function retrieveDataProjects() {
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

  async function retrieveCountFiles() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToFilesFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (filesQueryParameters.filter) filterRules.push(filesQueryParameters.filter);
    const filesCountResponse = await getGdpFiles({
      ...globalFilters.files.queryParameters,
      ...filesQueryParameters,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
      limit: undefined,
      offset: undefined,
      aggregate: { count: 'id' },
    });
    if (filesCountResponse.ok && filesCountResponse.data) {
      setFilesCount(parseInt((filesCountResponse.data as any)[0].count.id));
    }
  }
  async function retrieveCountProjects() {
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
    else {
      setProjects(globalProjects);
      setFiles(globalFiles);
    }
  }, [projectsQueryParameters, lazyLoadingState]);

  useEffect(() => {
    if (Object.keys(projectsQueryParameters).length > 0) retrieveCount();
    else {
      setProjectsCount(globalProjectsCount);
      setFilesCount(globalFilesCount);
    }
  }, [projectsQueryParameters]);

  useEffect(() => {
    if (Object.keys(projectsQueryParameters).length == 0) {
      setProjects(globalProjects);
      setFiles(globalFiles);
    }
  }, [globalProjects]);

  return (
    <FilesPage
      files={files}
      projects={projects}
      setSpecificProjectsFilters={setProjectsQueryParameters}
      setSpecificFilesFilters={setFilesQueryParameters}
      projectsCount={projectsCount}
      filesCount={filesCount}
      lazyLoadingState={lazyLoadingState}
      setLazyLoadingState={setLazyLoadingState}
    />
  );
};

export default Files;
