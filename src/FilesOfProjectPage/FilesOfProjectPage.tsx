import React, { useEffect, useState, useRef } from 'react';
import styles from './FilesOfProjectPage.module.scss';
import { Button, Input, Select, ShadowCard } from '@projex/ui';
import { QueryParameters } from '../../models/DirectusModel';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../store/reducers/companyEntitiesReducer';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';

import { CompanyEnum } from '../../models/UserService/UsCompanyEntityModel';
import { GdpAssetDocumentEnum, GdpFilesModel, GdpFilesStatusEnum } from '../../models/GestionDeProjets/GdpFilesModel';
import DisplayOptionsController from '../components/DisplayOptionsController/DisplayOptionsController';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { GdpAffairModel } from '../../models/GestionDeProjets/GdpAffairModel';
import { GdpPhaseModel } from '../../models/GestionDeProjets/GdpPhaseModel';
import { useRouter } from 'next/router';
import FilesGridDisplay from '../components/FilesGridDisplay/FilesGridDisplay';
import { LoadingOutlined } from '@ant-design/icons';

const { publicRuntimeConfig } = getConfig();

type FilesFiltersType = {
  search: string;
  document_type: GdpAssetDocumentEnum | '';
  status: GdpFilesStatusEnum | '';
  company_entity: CompanyEnum | '';
};

type FilesLevelFilterType = {
  project: {
    id: number | string;
    name: string;
  };
  affair: {
    id: number | string;
    name: string;
  } | null;
  phase: {
    id: number | string;
    name: string;
  } | null;
};

export type FolderType = {
  id: number | string | null;
  name: string | null;
  type: 'affair' | 'phase' | 'back_to_projects' | 'back_to_affairs' | 'back_to_phases';
};

type Props = {
  project: Partial<GdpProjectsModel>;
  files: Partial<GdpFilesModel>[];
  filesCount: number | null;
  setSpecificFilters: (newFilters: QueryParameters) => void;
  lazyLoadingState: LazyLoadingStateType;
  setLazyLoadingState: (newState: LazyLoadingStateType) => void;
};

const FilesFiltersInitialState: FilesFiltersType = {
  search: '',
  document_type: '',
  status: '',
  company_entity: '',
};

//prevent search input to trigger multiple requests by cancelling requests while user is typing
let timerSearch: NodeJS.Timeout;

let isNewDataLoading = false;

const FilesOfProjectPage = ({
  project,
  files,
  setSpecificFilters,
  filesCount,
  lazyLoadingState,
  setLazyLoadingState,
}: Props) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [displayOption, setDisplayOption] = useState<string>('grid');
  const [FilesLevelFilter, setFilesLevelFilter] = useState<FilesLevelFilterType>({
    project: {
      id: project.id as number,
      name: project.name as string,
    },
    affair: null,
    phase: null,
  });

  const companyEntities = useSelector(selectCompanyEntities);
  const [filesFilters, setFilesFilters] = useState<FilesFiltersType>(FilesFiltersInitialState);

  //TODO fix loading states. L'affichage n'est pas fluide.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log('FilesLevelFilter', FilesLevelFilter);
  console.log('project', project);

  function updateSpecificFilters() {
    const filterRules: any[] = [];
    let search: string | undefined = undefined;
    if (filesFilters.search.length > 0) search = filesFilters.search;
    if (filesFilters.status !== '') filterRules.push({ status: { _eq: filesFilters.status } });
    if (filesFilters.document_type !== '') filterRules.push({ document_type: { _eq: filesFilters.document_type } });
    if (filesFilters.company_entity !== '')
      filterRules.push({
        _or: [
          {
            projects_id: { company_entity: { _eq: filesFilters.company_entity } },
          },
          {
            affair_id: { company_entity: { _eq: filesFilters.company_entity } },
          },
        ],
      });

    filterRules.push({ projects_id: { _eq: FilesLevelFilter.project.id } });
    if (FilesLevelFilter.affair != null && FilesLevelFilter.affair.id != null)
      filterRules.push({ affair_id: { _eq: FilesLevelFilter.affair.id } });
    else filterRules.push({ affair_id: { _null: true } });
    if (FilesLevelFilter.phase != null && FilesLevelFilter.phase.id != null)
      filterRules.push({ phase_id: { _eq: FilesLevelFilter.phase.id } });
    else filterRules.push({ phase_id: { _null: true } });

    const newFilters: QueryParameters = {
      search: search,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
    };
    setSpecificFilters(newFilters);
    setLazyLoadingState({ limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE, offset: 0, action: 'REPLACE' });
  }

  //Timeout to avoid too many requests
  useEffect(() => {
    clearTimeout(timerSearch);
    timerSearch = setTimeout(() => {
      updateSpecificFilters();
    }, 500);
  }, [filesFilters, FilesLevelFilter]);

  function onScrollEvent(event: Event) {
    if (pageRef && pageRef.current) {
      const page = pageRef.current;
      if (page.scrollTop + page.clientHeight >= page.scrollHeight - 400) {
        if (filesCount && files.length < filesCount && !isNewDataLoading) {
          //lazy Loading Specific
          isNewDataLoading = true;
          setLazyLoadingState({
            limit: lazyLoadingState.limit,
            offset: files.length,
            action: 'APPEND',
          });
          setTimeout(() => {
            isNewDataLoading = false;
          }, 1000);
        }
      }
    }
  }

  //lazy loading
  useEffect(() => {
    setIsLoading(false);
    if (pageRef && pageRef.current) pageRef.current.addEventListener('scroll', onScrollEvent);
    return () => {
      if (pageRef && pageRef.current) pageRef.current.removeEventListener('scroll', onScrollEvent);
    };
  }, [filesCount, files, lazyLoadingState]);

  function getFolders() {
    const folders: FolderType[] = [];
    if (FilesLevelFilter.affair == null) {
      folders.push({
        id: null,
        name: 'Retour',
        type: 'back_to_projects',
      });
      if (project.affairs_ids)
        folders.push(
          ...project.affairs_ids.map((affair) => ({
            id: (affair as GdpAffairModel).id,
            name: (affair as GdpAffairModel).name,
            type: 'affair' as 'affair',
          }))
        );
    } else if (FilesLevelFilter.phase == null) {
      folders.push({
        id: FilesLevelFilter.affair.id,
        name: 'Retour',
        type: 'back_to_affairs',
      });
      const affair = (project.affairs_ids as GdpAffairModel[]).find(
        (affair) => affair.id === (FilesLevelFilter.affair as { id: string | number; name: string }).id
      );
      if (affair)
        folders.push(
          ...(affair.affairs_phases_ids as GdpPhaseModel[]).map((phase) => ({
            id: (phase as GdpPhaseModel).id,
            name: (phase as GdpPhaseModel).name,
            type: 'phase' as 'phase',
          }))
        );
    } else {
      folders.push({
        id: FilesLevelFilter.phase.id,
        name: 'Retour',
        type: 'back_to_phases',
      });
    }
    return folders;
  }

  function onFolderClick(folder: FolderType) {
    setIsLoading(true);
    if (folder.type === 'back_to_projects') router.push('/files');
    if (folder.type === 'back_to_affairs')
      setFilesLevelFilter({
        project: FilesLevelFilter.project,
        affair: null,
        phase: null,
      });
    if (folder.type === 'back_to_phases')
      setFilesLevelFilter({
        project: FilesLevelFilter.project,
        affair: FilesLevelFilter.affair,
        phase: null,
      });
    if (folder.type === 'affair' && folder.id != null && folder.name != null) {
      setFilesLevelFilter({
        project: FilesLevelFilter.project,
        affair: {
          id: folder.id,
          name: folder.name,
        },
        phase: null,
      });
    }
    if (folder.type === 'phase' && folder.id != null && folder.name != null) {
      setFilesLevelFilter({
        project: FilesLevelFilter.project,
        affair: FilesLevelFilter.affair,
        phase: {
          id: folder.id,
          name: folder.name,
        },
      });
    }
  }

  return (
    <div className="page" ref={pageRef}>
      <div className={styles.projectsPage}>
        <h1 className={styles.title}>Fichiers</h1>
        <div className={styles.headAndFilters}>
          <div className={styles.InputContainer}>
            <Input
              label={'Rechercher un fichier'}
              value={filesFilters.search}
              setValue={(value) => setFilesFilters({ ...filesFilters, search: `${value}` })}
              large={false}
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par visibilité'}
              nullOptionText={'Tous les fichiers'}
              options={[
                { value: GdpFilesStatusEnum.VISIBLE, text: 'Partagé aux clients' },
                { value: GdpFilesStatusEnum.HIDDEN, text: 'Non partagé aux clients' },
              ]}
              value={filesFilters.status}
              setValue={(value) => setFilesFilters({ ...filesFilters, status: value as GdpFilesStatusEnum })}
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par type'}
              nullOptionText={'Tous les documents'}
              options={[
                { value: GdpAssetDocumentEnum.WRITTEN, text: 'Document écrit' },
                { value: GdpAssetDocumentEnum.GRAPHIC, text: 'Document graphique' },
                { value: GdpAssetDocumentEnum.UNKNOWN, text: 'Document inconnu' },
              ]}
              value={filesFilters.document_type}
              setValue={(value) => setFilesFilters({ ...filesFilters, document_type: value as GdpAssetDocumentEnum })}
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par Entité'}
              nullOptionText={'Toutes les entités'}
              options={companyEntities.map((entity) => ({ value: `${entity.id}`, text: entity.name || '' }))}
              value={filesFilters.company_entity}
              setValue={(value) => setFilesFilters({ ...filesFilters, company_entity: value as CompanyEnum })}
            />
          </div>
          <div className={styles.headItemContainer}>
            <Button
              style={'text_gray'}
              icon={<DeleteOutlined />}
              onClick={() => setFilesFilters(FilesFiltersInitialState)}
            >
              Réinitialiser les filtres
            </Button>
          </div>
          <div className={styles.headItemContainer}>
            <DisplayOptionsController currentOption={displayOption} setCurrentOption={setDisplayOption} />
          </div>
        </div>
        <div className={styles.content}>
          {displayOption === 'grid' ? (
            <FilesGridDisplay
              files={
                isLoading
                  ? []
                  : files.map((file) => ({
                      file: file,
                      onClick: () => console.log('Click'),
                      type: 'file',
                    }))
              }
              folders={getFolders().map((folder) => ({
                folder: folder,
                onClick: () => onFolderClick(folder),
                type: folder.name === 'Retour' ? 'back' : 'folder',
              }))}
            />
          ) : (
            <div>TABLE</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesOfProjectPage;
