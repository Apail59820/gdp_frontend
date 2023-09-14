import React, { useEffect, useState, useRef, ReactNode } from 'react';
import styles from './FilesPage.module.scss';
import { Button, Input, Select } from 'projex-ui';
import { QueryParameters } from '../../models/DirectusModel';
import { DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../store/reducers/companyEntitiesReducer';
import GlobalFilters from '../components/GlobalFiltersComponents/GlobalFilters';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';
import { CompanyEnum } from '../../models/UserService/UsCompanyEntityModel';
import { GdpAssetDocumentEnum, GdpFilesModel, GdpFilesStatusEnum } from '../../models/GestionDeProjets/GdpFilesModel';
import DisplayOptionsController from '../components/DisplayOptionsController/DisplayOptionsController';
import { GdpProjectsModel, GdpProjectStatusEnum } from '../../models/GestionDeProjets/GdpProjectsModel';
import { Switch, Table } from 'antd';
import FilesGridDisplay from '../components/FilesGridDisplay/FilesGridDisplay';
import FolderIcon from '../../public/folder.svg';
import FileIcon from '../../public/file.svg';
import FileImageIcon from '../../public/file-image.svg';
import Link from 'next/link';
import { DateTime } from "luxon";
import FilesInfo from "../components/FilesInfo/FilesInfo";
const { publicRuntimeConfig } = getConfig();

type FilesFiltersType = {
  search: string;
  document_type: GdpAssetDocumentEnum | '';
  status: GdpFilesStatusEnum | '';
  company_entity: CompanyEnum | '';
};

type ProjectsFiltersType = {
  name: string;
  status: GdpProjectStatusEnum | '';
  company_entity: CompanyEnum | '';
};

const FilesFiltersInitialState: FilesFiltersType = {
  search: '',
  document_type: '',
  status: '',
  company_entity: '',
};

const projectsFiltersInitialState: ProjectsFiltersType = {
  name: '',
  status: GdpProjectStatusEnum.ACTIVE,
  company_entity: '',
};

type Props = {
  projects: Partial<GdpProjectsModel>[];
  files: Partial<GdpFilesModel>[];
  projectsCount: number | null;
  filesCount: number | null;
  setSpecificProjectsFilters: (newFilters: QueryParameters) => void;
  setSpecificFilesFilters: (newFilters: QueryParameters) => void;
  lazyLoadingState: LazyLoadingStateType;
  setLazyLoadingState: (newState: LazyLoadingStateType) => void;
};

//prevent search input to trigger multiple requests by cancelling requests while user is typing
let timerSearch: NodeJS.Timeout;

let isNewDataLoading = false;

const FilesPage = ({
  projects,
  files,
  setSpecificFilesFilters,
  setSpecificProjectsFilters,
  projectsCount,
  filesCount,
  lazyLoadingState,
  setLazyLoadingState,
}: Props) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const [organizePerProjects, setOrganizePerProjects] = useState<boolean>(false);

  const [displayOption, setDisplayOption] = useState<string>('grid');

  const globalFilters = useSelector(selectGlobalFilters);
  const companyEntities = useSelector(selectCompanyEntities);

  const [filesFilters, setFilesFilters] = useState<FilesFiltersType>(FilesFiltersInitialState);
  const [projectsFilters, setProjectsFilters] = useState<ProjectsFiltersType>(projectsFiltersInitialState);

  const [isFilesInfoModalOpen, setIsFilesInfoModalOpen] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<Partial<GdpFilesModel> | null>(null);
  function updateSpecificFilters() {
    updateSpecificFilesFilters();
    updateSpecificProjectsFilters();
  }

  function updateSpecificFilesFilters() {
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
    const newFilters: QueryParameters = {
      search: search,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
    };
    setSpecificFilesFilters(newFilters);
    setLazyLoadingState({ limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE, offset: 0, action: 'REPLACE' });
  }

  function updateSpecificProjectsFilters() {
    const filterRules: any[] = [];
    if (projectsFilters.name.length > 0) filterRules.push({ name: { _contains: projectsFilters.name } });
    if (projectsFilters.status !== '') filterRules.push({ status: projectsFilters.status });
    if (projectsFilters.company_entity !== '') filterRules.push({ company_entity: projectsFilters.company_entity });
    setSpecificProjectsFilters(filterRules.length > 0 ? { filter: { _and: filterRules } } : {});
    setLazyLoadingState({ limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE, offset: 0, action: 'REPLACE' });
  }

  function resetFilters() {
    setFilesFilters(FilesFiltersInitialState);
    setProjectsFilters(projectsFiltersInitialState);
    updateSpecificFilters();
  }

  useEffect(() => {
    resetFilters();
  }, [globalFilters]);

  //Timeout to avoid too many requests
  useEffect(() => {
    clearTimeout(timerSearch);
    timerSearch = setTimeout(() => {
      updateSpecificFilesFilters();
    }, 500);
  }, [filesFilters]);

  useEffect(() => {
    clearTimeout(timerSearch);
    timerSearch = setTimeout(() => {
      updateSpecificProjectsFilters();
    }, 500);
  }, [projectsFilters]);

  function onScrollEvent(event: Event) {
    if (pageRef && pageRef.current) {
      const page = pageRef.current;
      if (page.scrollTop + page.clientHeight >= page.scrollHeight - 400) {
        if (
          ((organizePerProjects && projectsCount && projects.length < projectsCount) ||
            (!organizePerProjects && filesCount && files.length < filesCount)) &&
          !isNewDataLoading
        ) {
          //lazy Loading Specific
          isNewDataLoading = true;
          setLazyLoadingState({
            limit: lazyLoadingState.limit,
            offset: projects.length,
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
    if (pageRef && pageRef.current) pageRef.current.addEventListener('scroll', onScrollEvent);
    return () => {
      if (pageRef && pageRef.current) pageRef.current.removeEventListener('scroll', onScrollEvent);
    };
  }, [projectsCount, projects, lazyLoadingState]);

  interface DataSourceItem {
    key: string | number | undefined;
    name: JSX.Element;
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

  if (!organizePerProjects) {
    dataSource = [
      ...files.map((file) => ({
        key: file.id,
        name: (
          <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
            <img src={file.type === 'image/png' ? FileImageIcon.src : FileIcon.src} width={20} height={20} alt="Icon" />
            <span style={{ display: 'inline-flex', marginLeft: '8px' }}>{file.title}</span>
          </div>
        ),
        type: file.type,
        uploaded_on: DateTime.fromISO(file.uploaded_on as string)
          .setLocale('fr')
          .toLocaleString(),
      })),
    ];
  }

  if (organizePerProjects) {
    dataSource = [
      ...projects.map((project) => ({
        key: project.id as number,
        name: (
          <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
            <Link href={`/projects/${project.id}/files`} style={{ display: 'flex' }}>
              <img src={FolderIcon.src} width={22} height={22} alt="Icon" />
              <span style={{ display: 'inline-flex', marginLeft: '8px' }}>{project.name}</span>
            </Link>
          </div>
        ),
        type: 'projet',
        uploaded_on: DateTime.fromISO(project.date_created as any)
          .setLocale('fr')
          .toLocaleString(),
      })),
    ];
  }

  return (
    <div className="page" ref={pageRef}>
      <GlobalFilters />
      <div className={styles.projectsPage}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>Fichiers</h1>
          <div className={styles.buttonAddFileContainer}>
            <Switch checked={organizePerProjects} onChange={setOrganizePerProjects} />
            <label>Organiser par projets</label>
          </div>
        </div>
        <div className={styles.headAndFilters}>
          {organizePerProjects ? (
            <>
              <div className={styles.InputContainer}>
                <Input
                  label={'Rechercher un projet'}
                  value={projectsFilters.name}
                  setValue={(value) => setProjectsFilters({ ...projectsFilters, name: `${value}` })}
                  large={false}
                />
              </div>
              <div className={styles.InputContainer}>
                <Select
                  label={'Filtrer par statut'}
                  nullOptionText={'Tous les statuts'}
                  options={[
                    { value: GdpProjectStatusEnum.ACTIVE, text: GdpProjectStatusEnum.ACTIVE },
                    { value: GdpProjectStatusEnum.ARCHIVED, text: GdpProjectStatusEnum.ARCHIVED },
                    { value: GdpProjectStatusEnum.DELETED, text: GdpProjectStatusEnum.DELETED },
                  ]}
                  value={projectsFilters.status}
                  setValue={(value) =>
                    setProjectsFilters({
                      ...projectsFilters,
                      status: value as GdpProjectStatusEnum,
                    })
                  }
                />
              </div>
              <div className={styles.InputContainer}>
                <Select
                  label={'Filtrer par Entité'}
                  nullOptionText={'Toutes les entités'}
                  options={companyEntities.map((entity) => ({ value: `${entity.id}`, text: entity.name || '' }))}
                  value={projectsFilters.company_entity}
                  setValue={(value) => setProjectsFilters({ ...projectsFilters, company_entity: value as CompanyEnum })}
                />
              </div>
            </>
          ) : (
            <>
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
                  setValue={(value) =>
                    setFilesFilters({ ...filesFilters, document_type: value as GdpAssetDocumentEnum })
                  }
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
            </>
          )}
          <div className={styles.headItemContainer}>
            <Button style={'text_gray'} icon={<DeleteOutlined rev={undefined} />} onClick={resetFilters}>
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
                organizePerProjects
                  ? []
                  : files.map((file) => ({
                      file: file,
                      type: 'file',
                      onClick: () => setIsFilesInfoModalOpen(true),
                    }))
              }
              folders={
                !organizePerProjects
                  ? []
                  : projects.map((project) => ({
                      folder: {
                        id: project.id,
                        name: project.name,
                        type: 'project',
                      },
                      type: 'folder',
                      href: `/projects/${project.id}/files`,
                    }))
              }
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
      <FilesInfo
          isOpen={isFilesInfoModalOpen}
          setIsOpen={setIsFilesInfoModalOpen}
          file={selectedFile}
      />
    </div>
  );
};

export default FilesPage;
