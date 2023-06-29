import React, { useEffect, useState } from 'react';
import { QueryParameters } from '../../../../models/DirectusModel';
import { LazyLoadingStateType } from '../../../../models/LazyLoadingStateType';
import getConfig from 'next/config';
import { GdpFilesModel } from '../../../../models/GestionDeProjets/GdpFilesModel';
import { getGdpFiles } from '../../../../services/gestionDeProjets/GdpFiles';
import { useRouter } from 'next/router';
import FilesOfProjectPage from '../../../../src/FilesOfProjectPage/FilesOfProjectPage';
import { GdpProjectsModel } from '../../../../models/GdPModels';
import { getGdpProjectById } from '../../../../services/gestionDeProjets/GdpProjects';

const { publicRuntimeConfig } = getConfig();

const FilesOfProject = () => {
  const router = useRouter();
  const { projectId } = router.query;

  //filtered data
  const [project, setProject] = useState<Partial<GdpProjectsModel>>();
  const [filesQueryParameters, setFilesQueryParameters] = useState<Omit<QueryParameters, 'limit' | 'offset'>>({});
  const [files, setFiles] = useState<Partial<GdpFilesModel>[]>([]);
  const [filesCount, setFilesCount] = useState<number | null>(null);
  const [lazyLoadingState, setLazyLoadingState] = useState<LazyLoadingStateType>({
    limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE,
    offset: 0,
    action: 'REPLACE',
  });

  async function retrieveData() {
    const filterRules = [];
    if (filesQueryParameters.filter) filterRules.push(filesQueryParameters.filter);
    const filesResponse = await getGdpFiles({
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
    const filterRules = [];
    if (filesQueryParameters.filter) filterRules.push(filesQueryParameters.filter);
    const filesCountResponse = await getGdpFiles({
      ...filesQueryParameters,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
      limit: undefined,
      offset: undefined,
      aggregate: { count: 'id' },
    });
    if (filesCountResponse.ok && filesCountResponse.data)
      setFilesCount(parseInt((filesCountResponse.data as any)[0].count.id));
  }

  /**
   * Retrieve project data
   */
  useEffect(() => {
    if (projectId == null) return;
    const fields = ['*', 'affairs_ids.*', 'affairs_ids.affairs_phases_ids.*'].join(',');
    getGdpProjectById(parseInt(projectId as string), fields).then((response) => {
      if (response.ok && response.data) setProject(response.data);
    });
  }, [projectId]);

  useEffect(() => {
    retrieveData();
    // if (Object.keys(filesQueryParameters).length > 0 || lazyLoadingState.action !== 'REPLACE')
    // else setFiles([]);
  }, [filesQueryParameters, lazyLoadingState]);

  useEffect(() => {
    retrieveCount();
  }, [filesQueryParameters]);

  //redirect to /files if no projectId
  if (!projectId) {
    return null;
  }
  if (!project?.id) return null;
  return (
    <FilesOfProjectPage
      project={project}
      files={files}
      setSpecificFilters={setFilesQueryParameters}
      filesCount={filesCount}
      lazyLoadingState={lazyLoadingState}
      setLazyLoadingState={setLazyLoadingState}
    />
  );
};

export default FilesOfProject;
