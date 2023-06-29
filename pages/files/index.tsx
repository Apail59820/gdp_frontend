import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { QueryParameters } from '../../models/DirectusModel';
import { RetrieveClientsOfClientsCompanyEntities } from '../../src/RetrieveGlobalData/RetrieveClientsOfClientsCompanyEntities';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';
import { selectFiles, selectFilesCount } from '../../store/reducers/filesReducer';
import { GdpFilesModel } from '../../models/GestionDeProjets/GdpFilesModel';
import { compileGlobalFiltersToFilesFilter } from '../../src/RetrieveGlobalData/filterCompilers/files';
import { getGdpFiles } from '../../services/gestionDeProjets/GdpFiles';
import FilesPage from '../../src/FilesPage/FilesPage';

const { publicRuntimeConfig } = getConfig();

const Fichiers = () => {
  //global data
  const globalFilters = useSelector(selectGlobalFilters);
  const globalFiles = useSelector(selectFiles);
  const globalFilesCount = useSelector(selectFilesCount);

  //filtered data
  const [filesQueryParameters, setFilesQueryParameters] = useState<Omit<QueryParameters, 'limit' | 'offset'>>({});
  const [files, setFiles] = useState<Partial<GdpFilesModel>[]>(globalFiles);
  const [filesCount, setFilesCount] = useState<number | null>(null);
  const [lazyLoadingState, setLazyLoadingState] = useState<LazyLoadingStateType>({
    limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE,
    offset: 0,
    action: 'REPLACE',
  });

  async function retrieveData() {
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

  async function retrieveCount() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToFilesFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (filesQueryParameters.filter) filterRules.push(filesQueryParameters.filter);
    const filesCountResponse = await getGdpFiles({
      ...globalFilters.projects.queryParameters,
      ...filesQueryParameters,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
      limit: undefined,
      offset: undefined,
      aggregate: { count: 'id' },
    });
    if (filesCountResponse.ok && filesCountResponse.data)
      setFilesCount(parseInt((filesCountResponse.data as any)[0].count.id));
  }

  useEffect(() => {
    if (Object.keys(filesQueryParameters).length > 0 || lazyLoadingState.action !== 'REPLACE') retrieveData();
    else setFiles(globalFiles);
  }, [filesQueryParameters, lazyLoadingState]);

  useEffect(() => {
    if (Object.keys(filesQueryParameters).length > 0) retrieveCount();
    else setFilesCount(globalFilesCount);
  }, [filesQueryParameters]);

  useEffect(() => {
    if (Object.keys(filesQueryParameters).length == 0) setFiles(globalFiles);
  }, [globalFiles]);

  return (
    <FilesPage
      files={files}
      setSpecificFilters={setFilesQueryParameters}
      filesCount={filesCount}
      lazyLoadingState={lazyLoadingState}
      setLazyLoadingState={setLazyLoadingState}
    />
  );
};

export default Fichiers;
