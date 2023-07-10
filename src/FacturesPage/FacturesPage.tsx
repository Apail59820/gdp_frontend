import React, { useEffect, useState, useRef } from 'react';
import styles from './Factures.module.scss';
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

const { publicRuntimeConfig } = getConfig();

type FacturesFiltersType = {
  search: string;
  etat: GdPPythagoreFactureReglement | '';
  statut: GdPPythagoreFactureStatut | '';
  company_entity: CompanyEnum | '';
};

type Props = {
  files: Partial<GdpPythagoreFactureModel>[];
  filesCount: number | null;
  setSpecificFilters: (newFilters: QueryParameters) => void;
  lazyLoadingState: LazyLoadingStateType;
  setLazyLoadingState: (newState: LazyLoadingStateType) => void;
};

const FacturesFiltersInitialState: FacturesFiltersType = {
  search: '',
  statut: '',
  etat: '',
  company_entity: '',
};

//prevent search input to trigger multiple requests by cancelling requests while user is typing
let timerSearch: NodeJS.Timeout;

let isNewDataLoading = false;

const FacturesPage = ({ files, setSpecificFilters, filesCount, lazyLoadingState, setLazyLoadingState }: Props) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const globalFilters = useSelector(selectGlobalFilters);
  const companyEntities = useSelector(selectCompanyEntities);
  const [facturesFilters, setFacturesFilters] = useState<FacturesFiltersType>(FacturesFiltersInitialState);

  function updateSpecificFilters() {
    const filterRules: any[] = [];
    let search: string | undefined = undefined;
    //Pour search : Il faudrait remplacer certains textes comme "Non réglée" par "nonreglee" pour faciliter la recherche.
    if (facturesFilters.search.length > 0) search = facturesFilters.search;
    if (facturesFilters.statut !== '') filterRules.push({ statut_facture: { _eq: facturesFilters.statut } });
    if (facturesFilters.etat !== '') filterRules.push({ etatreglt_facture: { _eq: facturesFilters.etat } });
    if (facturesFilters.company_entity !== '')
      filterRules.push({
        _or: [
          {
            num_affaire: {
              affairs_id: {
                affairs_id: { projects_id: { company_entity: { _eq: facturesFilters.company_entity } } },
              },
            },
          },
          {
            num_affaire: {
              affairs_id: { affairs_id: { company_entity: { _eq: facturesFilters.company_entity } } },
            },
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
    setFacturesFilters(FacturesFiltersInitialState);
    updateSpecificFilters();
  }, [globalFilters]);

  //Timeout to avoid too many requests
  useEffect(() => {
    clearTimeout(timerSearch);
    timerSearch = setTimeout(() => {
      updateSpecificFilters();
    }, 500);
  }, [facturesFilters]);

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
        <h1 className={styles.title}>Toutes les factures</h1>
        <div className={styles.headAndFilters}>
          <div className={styles.InputContainer}>
            <Input
              label={'Rechercher une facture'}
              value={facturesFilters.search}
              setValue={(value) => setFacturesFilters({ ...facturesFilters, search: `${value}` })}
              large={false}
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par statut'}
              nullOptionText={'Tous les statuts'}
              options={[
                { value: GdPPythagoreFactureStatut.NON_ECHUE, text: GdPPythagoreFactureStatut.NON_ECHUE },
                { value: GdPPythagoreFactureStatut.ECHUE, text: GdPPythagoreFactureStatut.ECHUE },
              ]}
              value={facturesFilters.statut}
              setValue={(value) =>
                setFacturesFilters({ ...facturesFilters, statut: value as GdPPythagoreFactureStatut })
              }
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par états'}
              nullOptionText={'Tous les états'}
              options={[
                { value: GdPPythagoreFactureReglement.REGLEE, text: GdPPythagoreFactureReglement.REGLEE },
                { value: GdPPythagoreFactureReglement.NON_REGLEE, text: GdPPythagoreFactureReglement.NON_REGLEE },
                {
                  value: GdPPythagoreFactureReglement.REGLEMENT_PARTIEL,
                  text: GdPPythagoreFactureReglement.REGLEMENT_PARTIEL,
                },
              ]}
              value={facturesFilters.etat}
              setValue={(value) =>
                setFacturesFilters({ ...facturesFilters, etat: value as GdPPythagoreFactureReglement })
              }
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par Entité'}
              nullOptionText={'Toutes les entités'}
              options={companyEntities.map((entity) => ({ value: `${entity.id}`, text: entity.name || '' }))}
              value={facturesFilters.company_entity}
              setValue={(value) => setFacturesFilters({ ...facturesFilters, company_entity: value as CompanyEnum })}
            />
          </div>
          <div className={styles.headItemContainer}>
            <Button
              style={'text_gray'}
              icon={<DeleteOutlined />}
              onClick={() => setFacturesFilters(FacturesFiltersInitialState)}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
        <div className={styles.content}>
          <BillingTable factures={files} />
        </div>
      </div>
    </div>
  );
};

export default FacturesPage;
