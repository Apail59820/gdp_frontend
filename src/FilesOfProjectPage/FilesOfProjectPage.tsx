import React, { useEffect, useState, useRef } from 'react';
import styles from './FilesOfProjectPage.module.scss';
import { Button, Input, Select } from 'projex-ui';
import { QueryParameters } from '../../models/DirectusModel';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../store/reducers/companyEntitiesReducer';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import { DateTime } from 'luxon';
import getConfig from 'next/config';

import { CompanyEnum } from '../../models/UserService/UsCompanyEntityModel';
import { GdpAssetDocumentEnum, GdpFilesModel, GdpFilesStatusEnum } from '../../models/GestionDeProjets/GdpFilesModel';
import DisplayOptionsController from '../components/DisplayOptionsController/DisplayOptionsController';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { GdpAffairModel } from '../../models/GestionDeProjets/GdpAffairModel';
import { GdpPhaseModel } from '../../models/GestionDeProjets/GdpPhaseModel';
import { useRouter } from 'next/router';
import FilesGridDisplay, { GridFolderItem } from '../components/FilesGridDisplay/FilesGridDisplay';
import UploadFilesForm, {
  fileItemType,
  UploadStatusEnum,
} from '../components/filesForms/UploadFilesForm/UploadFilesForm';
import PageHeaderBanner from '../components/PageHeaderBanner/PageHeaderBanner';
import {Table} from 'antd';
import FolderIcon from '../../public/folder.svg';
import FileImageIcon from '../../public/file-image.svg';
import FileIcon from '../../public/file.svg';
import FileArrayLeftLong from '../../public/arrow-left-long.svg';
import Link from 'next/link';
import FilesInfo from "../components/FilesInfo/FilesInfo";

const { publicRuntimeConfig } = getConfig();

type FilesFiltersType = {
  search: string;
  document_type: GdpAssetDocumentEnum | '';
  status: GdpFilesStatusEnum | '';
  company_entity: CompanyEnum | '';
};

type FilesLevelFilterType = {
  project: Partial<GdpProjectsModel>;
  affair?: Partial<GdpAffairModel>;
  phase?: Partial<GdpPhaseModel>;
};

export type FolderType = {
  id: number | string | undefined | null;
  name: string | undefined | null;
  type: 'project' | 'affair' | 'phase' | 'back_to_projects' | 'back_to_affairs' | 'back_to_phases';
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
    project: project,
    affair: undefined,
    phase: undefined,
  });

  const companyEntities = useSelector(selectCompanyEntities);
  const [filesFilters, setFilesFilters] = useState<FilesFiltersType>(FilesFiltersInitialState);

  //TODO fix loading states. L'affichage n'est pas fluide.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [filesToUpdate, setFilesToUpdate] = useState<fileItemType[]>([]);

  function UpdateFiles(filesToUpdate: fileItemType[]) {
    setFilesToUpdate(filesToUpdate);
    setIsUploadModalOpen(true);
  }

  function onFileModalClose() {
    setFilesToUpdate([]);
    setIsEditing(false);
    setIsUploadModalOpen(false);
  }
  const [isFilesInfoModalOpen, setIsFilesInfoModalOpen] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<Partial<GdpFilesModel> | null>(null);
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
  }, [filesFilters, FilesLevelFilter, isUploadModalOpen]);

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

  function handleAddFile() {
    setIsUploadModalOpen(true);
    setIsEditing(false);
    setSelectedFile(null);
  }

  function onFileSelected(file : Partial<GdpFilesModel>) {
    setSelectedFile(file);
    setIsFilesInfoModalOpen(true);
  }

  //lazy loading
  useEffect(() => {
    setIsLoading(false);
    if (pageRef && pageRef.current) pageRef.current.addEventListener('scroll', onScrollEvent);
    return () => {
      if (pageRef && pageRef.current) pageRef.current.removeEventListener('scroll', onScrollEvent);
    };
  }, [filesCount, files, lazyLoadingState]);

  useEffect(() => {
    const { affairId } = router.query;
    if(project?.affairs_ids) {
      project.affairs_ids.forEach((affair) => {
        if(affair?.id == affairId){
          onFolderClick({
            id: (affair as GdpAffairModel).id,
            name: (affair as GdpAffairModel).name,
            type: 'affair' as 'affair',
          });
        }
      })
    }
  }, []);

  useEffect(() => {
    if(!isFilesInfoModalOpen){
      clearTimeout(timerSearch);
      timerSearch = setTimeout(() => {
        updateSpecificFilters();
      }, 500);
    }
  }, [isFilesInfoModalOpen]);

  useEffect(() => {
    if(isEditing){
          selectedFile.id &&
          UpdateFiles([
            {
              id: selectedFile.id,
              file: undefined,
              properties: selectedFile,
              uploadState: UploadStatusEnum.DONE,
            },
          ]);
    }
  }, [isEditing]);

  function getFolders(): GridFolderItem[] {
    const folders: GridFolderItem[] = [];
    if (FilesLevelFilter.affair == null) {
      folders.push({
        folder: {
          id: null,
          name: 'Retour',
          type: 'back_to_projects',
        },
        type: 'back',
        href: '/files',
      });
      if (project.affairs_ids)
        folders.push(
          ...project.affairs_ids.map((affair) => ({
            folder: {
              id: (affair as GdpAffairModel).id,
              name: (affair as GdpAffairModel).name,
              type: 'affair' as 'affair',
            },
            type: 'folder' as 'folder',
            onClick: () =>
              onFolderClick({
                id: (affair as GdpAffairModel).id,
                name: (affair as GdpAffairModel).name,
                type: 'affair' as 'affair',
              }),
          }))
        );
    } else if (FilesLevelFilter.phase == null) {
      folders.push({
        folder: {
          id: FilesLevelFilter.affair?.id,
          name: 'Retour',
          type: 'back_to_affairs',
        },
        type: 'back',
        onClick: () =>
          onFolderClick({
            id: FilesLevelFilter.affair?.id,
            name: 'Retour',
            type: 'back_to_affairs',
          }),
      });
      const affair = (project.affairs_ids as GdpAffairModel[]).find(
        (affair) => affair.id === (FilesLevelFilter.affair as { id: string | number; name: string }).id
      );
      if (affair?.affairs_phases_ids)
        folders.push(
          ...(affair.affairs_phases_ids as GdpPhaseModel[]).map((phase) => ({
            folder: {
              id: (phase as GdpPhaseModel).id,
              name: (phase as GdpPhaseModel).name,
              type: 'phase' as 'phase',
            },
            type: 'folder' as 'folder',
            onClick: () =>
              onFolderClick({
                id: (phase as GdpPhaseModel).id,
                name: (phase as GdpPhaseModel).name,
                type: 'phase' as 'phase',
              }),
          }))
        );
    } else {
      folders.push({
        folder: {
          id: FilesLevelFilter.phase?.id,
          name: 'Retour',
          type: 'back_to_phases',
        },
        type: 'back',
        onClick: () =>
          onFolderClick({
            id: FilesLevelFilter.phase?.id,
            name: 'Retour',
            type: 'back_to_phases',
          }),
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
        affair: undefined,
        phase: undefined,
      });
    if (folder.type === 'back_to_phases')
      setFilesLevelFilter({
        project: FilesLevelFilter.project,
        affair: FilesLevelFilter.affair,
        phase: undefined,
      });
    if (folder.type === 'affair' && folder.id != null && folder.name != null) {
      setFilesLevelFilter({
        project: FilesLevelFilter.project,
        affair: (project.affairs_ids as GdpAffairModel[])?.find((affair) => affair.id === folder.id),
        phase: undefined,
      });
    }
    if (folder.type === 'phase' && folder.id != null && folder.name != null) {
      setFilesLevelFilter({
        project: FilesLevelFilter.project,
        affair: FilesLevelFilter.affair,
        phase: (FilesLevelFilter.affair?.affairs_phases_ids as GdpPhaseModel[])?.find(
          (phase) => phase.id === folder.id
        ),
      });
    }
  }

  interface DataSourceItem {
    key: string | number | undefined;
    name: JSX.Element | JSX.Element[];
    type: string | null | undefined;
    uploaded_on: Date | string | undefined;
  }

  const columns = [
    {
      title: 'Nom du fichier',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Date de mise en ligne',
      dataIndex: 'uploaded_on',
      key: 'uploaded_on',
      sorter: (a: DataSourceItem, b: DataSourceItem) => {
        if (!a.uploaded_on || !b.uploaded_on) return 0;
        return a.uploaded_on < b.uploaded_on ? 1 : -1;
      },
    },
  ];

  let dataSource: DataSourceItem[] = [];

  if (displayOption === 'list') {
    dataSource = [
      ...files.map((file) => ({
        key: file.id,
        name: (
          <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
            <img src={file.type === 'image/png' ? FileImageIcon.src : FileIcon.src} width={20} height={20} alt="Icon" />
            <Link href={'#'} style={{ display: 'inline-flex', marginLeft: '8px' }} onClick={() => {onFileSelected(file);}}>{file?.title}</Link>
          </div>
        ),
        type: file.type,
        uploaded_on: DateTime.fromISO(file.uploaded_on as string)
          .setLocale('fr')
          .toLocaleString(),
      })),
    ];
    //TODO fix preview files table view mode.
    const folders = getFolders();
    if (folders) {
      dataSource = [
        ...folders.map((folder): DataSourceItem => {
          const linkProps: { href: string; onClick?: () => void } = { href: '' };
          const currentIcon = folder.type === 'back' ? FileArrayLeftLong : FolderIcon;
          if (folder.type === 'back' && folder.href && folder.href.length > 0) {
            linkProps.href = folder.href;
          } else {
            linkProps.href = `/projects/${project.id}/files`;
            linkProps.onClick = folder.onClick;
          }
          return {
            key: folder.folder.name as string,
            name: (
              <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
                <Link {...linkProps} style={{ display: 'flex' }}>
                  <img src={currentIcon?.src} width={22} height={22} alt="Icon" />
                  <span style={{ display: 'inline-flex', marginLeft: '8px' }}>{folder.folder.name}</span>
                </Link>
              </div>
            ),
            type: folder.folder.type
              .replace(/back_to_projects|back_to_affairs|back_to_phases/g, '')
              .replace('affair', 'affaire'),
            uploaded_on: DateTime.fromISO(project.date_created as any)
              .setLocale('fr')
              .toLocaleString(),
          };
        }),
        ...dataSource,
      ];
    }
  }
  return (
    <div className="page" ref={pageRef}>
      <div className={styles.projectsPage}>
        <PageHeaderBanner data={project} />
        <div className={styles.titleBar}>
          <h1 className={styles.title}>Fichiers</h1>
          <div className={styles.buttonAddFileContainer}>
            <Button style={'primary'} onClick={handleAddFile} small={true}>
              Ajouter un fichier
            </Button>
          </div>
        </div>
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
              icon={<DeleteOutlined  />}
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
                      onClick: () => onFileSelected(file),
                      type: 'file',
                    }))
              }
              folders={getFolders()}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              size={'large'}
              locale={{
                triggerAsc: 'Trier de manière ascendante',
                triggerDesc: 'Trier de manière descendante',
                cancelSort: 'Ne pas trier',
              }}
            />
          )}
        </div>
      </div>
      <UploadFilesForm
        isOpen={isUploadModalOpen}
        onClose={onFileModalClose}
        edit={isEditing}
        mode={'files'}
        fileItems={filesToUpdate}
        project={FilesLevelFilter.project}
        affair={FilesLevelFilter.affair}
        phase={FilesLevelFilter.phase}
      />
      <FilesInfo
          isOpen={isFilesInfoModalOpen}
          setIsOpen={setIsFilesInfoModalOpen}
          setEditButtonState={setIsEditing}
          file={selectedFile}
      />

    </div>
  );
};

export default FilesOfProjectPage;
