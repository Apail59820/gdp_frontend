import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { QueryParameters } from '../../models/DirectusModel';
import { RetrieveClientsOfClientsCompanyEntities } from '../../src/RetrieveGlobalData/RetrieveClientsOfClientsCompanyEntities';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';
import FacturesPage from '../../src/FacturesPage/FacturesPage';
import { GdpPythagoreFactureModel } from '../../models/GestionDeProjets/GdpPythagoreFactureModel';
import { getGdpPythagoreFactures } from '../../services/gestionDeProjets/GdpPythagoreFactures';
import { compileGlobalFiltersToPythagoreFacturesFilter } from '../../src/RetrieveGlobalData/filterCompilers/pythagore_affaires';
import { selectPythagoreFactures, selectPythagoreFacturesCount } from '../../store/reducers/pythagoreFacturesReducer';
import ConfigureWidget from '../../src/components/ConfigureWidget/ConfigureWidget';
import BillingWidget from '../../src/components/BillingWidget/BillingWidget';
import ConfigureFacturationForm from '../../src/components/ConfigureFacturationForm/ConfigureFacturationForm';
import { GdpProjectsModel } from '../../models/GdPModels';

const { publicRuntimeConfig } = getConfig();

const Factures = () => {
  const globalFilters = useSelector(selectGlobalFilters);
  const globalFactures = useSelector(selectPythagoreFactures);
  const globalFacturesCount = useSelector(selectPythagoreFacturesCount);

  const [facturesQueryParameters, setFacturesQueryParameters] = useState<Omit<QueryParameters, 'limit' | 'offset'>>({});
  const [factures, setFactures] = useState<Partial<GdpPythagoreFactureModel>[]>(globalFactures);
  const [facturesCount, setFacturesCount] = useState<number | null>(null);
  const [lazyLoadingState, setLazyLoadingState] = useState<LazyLoadingStateType>({
    limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE,
    offset: 0,
    action: 'REPLACE',
  });

  const [isConfigureFacturationFormOpen, setIsConfigureFacturationFormOpen] = useState<boolean>(false);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});

  const [affairInvoices, setAffairInvoices] = useState<Partial<GdpPythagoreFactureModel>[]>([]);

  async function retrieveData() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToPythagoreFacturesFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (facturesQueryParameters.filter) filterRules.push(facturesQueryParameters.filter);
    const projectsResponse = await getGdpPythagoreFactures({
      ...globalFilters.pythagore_affaires.queryParameters, //TODO adapt filer from affairs to factures
      ...facturesQueryParameters,
      limit: lazyLoadingState.limit,
      offset: lazyLoadingState.offset,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
    });
    if (isRequestSuccessful(projectsResponse.status) && projectsResponse.data) {
      if (lazyLoadingState.action == 'REPLACE') setFactures(projectsResponse.data);
      else setFactures([...factures, ...projectsResponse.data]);
    }
  }

  async function retrieveCount() {
    const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
    const globalFilterRules = compileGlobalFiltersToPythagoreFacturesFilter(globalFilters, additionalClients);

    const filterRules = [];
    if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
    if (facturesQueryParameters.filter) filterRules.push(facturesQueryParameters.filter);
    const projectsCountResponse = await getGdpPythagoreFactures({
      ...globalFilters.projects.queryParameters,
      ...facturesQueryParameters,
      filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
      limit: undefined,
      offset: undefined,
      aggregate: { count: 'num_facture' },
    });
    if (isRequestSuccessful(projectsCountResponse.status) && projectsCountResponse.data)
      setFacturesCount(parseInt((projectsCountResponse.data as any)[0].count.num_facture));
  }

  useEffect(() => {
    if (Object.keys(facturesQueryParameters).length > 0 || lazyLoadingState.action !== 'REPLACE') retrieveData();
    else setFactures(globalFactures);
  }, [facturesQueryParameters, lazyLoadingState]);

  useEffect(() => {
    if (Object.keys(facturesQueryParameters).length > 0) retrieveCount();
    else setFacturesCount(globalFacturesCount);
  }, [facturesQueryParameters]);

  useEffect(() => {
    if (Object.keys(facturesQueryParameters).length == 0) setFactures(globalFactures);
  }, [globalFactures]);

  return (
    <>
      <ConfigureFacturationForm
        isOpen={isConfigureFacturationFormOpen}
        setIsOpen={setIsConfigureFacturationFormOpen}
        initProject={{}}
        initAffair={{}}
      />
      {factures.length > 0 ? (
        <FacturesPage
          files={factures}
          setSpecificFilters={setFacturesQueryParameters}
          filesCount={facturesCount}
          lazyLoadingState={lazyLoadingState}
          setLazyLoadingState={setLazyLoadingState}
        />
      ) : (
        <div style={{ padding: '1.5rem' }}>
          <BillingWidget
            invoices={affairInvoices}
            onConfigureBillingClick={() => setIsConfigureFacturationFormOpen(true)}
            displayConfigureButton={true}
          />
        </div>
      )}
    </>
  );
};

export default Factures;
