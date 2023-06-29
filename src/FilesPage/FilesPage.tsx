import React, { useEffect, useState, useRef } from 'react';
import styles from './FilesPage.module.scss';
import { Button, Input, Select } from '@projex/ui';
import { QueryParameters } from '../../models/DirectusModel';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../store/reducers/companyEntitiesReducer';
import GlobalFilters from '../components/GlobalFiltersComponents/GlobalFilters';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';
import {
  GdpPythagoreFactureModel,
  GdPPythagoreFactureReglement,
  GdPPythagoreFactureStatut,
} from '../../models/GestionDeProjets/GdpPythagoreFactureModel';
import BillingTable from '../components/BillingTable/BillingTable';
import { CompanyEnum } from '../../models/UserService/UsCompanyEntityModel';
import { GdpAssetDocumentEnum, GdpFilesModel, GdpFilesStatusEnum } from '../../models/GestionDeProjets/GdpFilesModel';
import DisplayOptionsController from '../components/DisplayOptionsController/DisplayOptionsController';

const { publicRuntimeConfig } = getConfig();

type FilesFiltersType = {
  search: string;
  document_type: GdpAssetDocumentEnum | '';
  status: GdpFilesStatusEnum | '';
  company_entity: CompanyEnum | '';
};

type Props = {
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

const FilesPage = ({ files, setSpecificFilters, filesCount, lazyLoadingState, setLazyLoadingState }: Props) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const [displayOption, setDisplayOption] = useState<string>('grid');

  const globalFilters = useSelector(selectGlobalFilters);
  const companyEntities = useSelector(selectCompanyEntities);
  const [filesFilters, setFilesFilters] = useState<FilesFiltersType>(FilesFiltersInitialState);

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
    const newFilters: QueryParameters = {
      search: search,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
    };
    setSpecificFilters(newFilters);
    setLazyLoadingState({ limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE, offset: 0, action: 'REPLACE' });
  }

  useEffect(() => {
    setFilesFilters(FilesFiltersInitialState);
    updateSpecificFilters();
  }, [globalFilters]);

  //Timeout to avoid too many requests
  useEffect(() => {
    clearTimeout(timerSearch);
    timerSearch = setTimeout(() => {
      updateSpecificFilters();
    }, 500);
  }, [filesFilters]);

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
    if (pageRef && pageRef.current) pageRef.current.addEventListener('scroll', onScrollEvent);
    return () => {
      if (pageRef && pageRef.current) pageRef.current.removeEventListener('scroll', onScrollEvent);
    };
  }, [filesCount, files, lazyLoadingState]);

  return (
    <div className="page" ref={pageRef}>
      <GlobalFilters />
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
            <div>
              {files.map((file) => (
                <div>{file.filename_download}</div>
              ))}
            </div>
          ) : (
            <div>TABLE</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
