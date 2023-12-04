import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../../../../store/reducers/globalFilterReducer';
import { QueryParameters} from "../../../../../models/DirectusModel";
import { RetrieveClientsOfClientsCompanyEntities } from '../../../../../src/RetrieveGlobalData/RetrieveClientsOfClientsCompanyEntities';
import { isRequestSuccessful } from '../../../../../utils/isRequestSuccessful';
import { LazyLoadingStateType} from "../../../../../models/LazyLoadingStateType";
import getConfig from 'next/config';
import FacturesPage from '../../../../../src/FacturesPage/FacturesPage';
import { GdpPythagoreFactureModel } from '../../../../../models/GestionDeProjets/GdpPythagoreFactureModel';
import { getGdpPythagoreFactures } from '../../../../../services/gestionDeProjets/GdpPythagoreFactures';
import { compileGlobalFiltersToPythagoreFacturesFilter } from '../../../../../src/RetrieveGlobalData/filterCompilers/pythagore_affaires';
import { selectPythagoreFactures, selectPythagoreFacturesCount } from '../../../../../store/reducers/pythagoreFacturesReducer';
import BillingWidget from '../../../../../src/components/BillingWidget/BillingWidget';
import ConfigureFacturationForm from '../../../../../src/components/ConfigureFacturationForm/ConfigureFacturationForm';
import {GdpAffairModel, GdpProjectsModel} from '../../../../../models/GdPModels';
import {useRouter} from "next/router";
import {getGdpProjects} from "../../../../../services/gestionDeProjets/GdpProjects";
import {setProjects} from "../../../../../store/reducers/projectsReducer";
import {getGdpAffairs} from "../../../../../services/gestionDeProjets/GdpAffairs";
import {getGdpAffairsPythagoreAffairs} from "../../../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs";
import {selectAffairsPythagoreAffaires} from "../../../../../store/reducers/affairsPythagoreAffairesReducer";

const { publicRuntimeConfig } = getConfig();

const BillingsFromProject = () => {

    const router = useRouter();

    const projectId = parseInt(router.query.projectId as string);
    const affairId = parseInt(router.query.affairId as string);

    const globalFilters = useSelector(selectGlobalFilters);
    const globalFactures = useSelector(selectPythagoreFactures);
    const globalFacturesCount = useSelector(selectPythagoreFacturesCount);
    const affairsPythagoreAffaires = useSelector(selectAffairsPythagoreAffaires);

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
    const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});

    const [affairInvoices, setAffairInvoices] = useState<Partial<GdpPythagoreFactureModel>[]>([]);

    async function retrieveData() {
        const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
        const globalFilterRules = compileGlobalFiltersToPythagoreFacturesFilter(globalFilters, additionalClients);

        const filterRules = [];
        if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
        if (facturesQueryParameters.filter) filterRules.push(facturesQueryParameters.filter);
        const projectsResponse = await getGdpPythagoreFactures({
            ...globalFilters.pythagore_affaires.queryParameters,
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
        getGdpProjects({filter: {id: projectId}}).then((res) => {
            if(isRequestSuccessful(res.status) && res.data.length == 1) setProject(res.data[0]);
        });

        getGdpAffairs({filter: {id: affairId}}).then((res) => {
            if(isRequestSuccessful(res.status) && res.data.length == 1) setAffair(res.data[0]);
        })

    }, [projectId, affairId]);

    useEffect(() => {

        let affairsToAdd = [];
        for(const affairPythagoreAffaire of affairsPythagoreAffaires as any){
            for(const pythagoreAffaire of affairPythagoreAffaire){
                affairsToAdd.push(pythagoreAffaire.pythagore_affaires_id);
            }
        }

        if(!affairsToAdd.length){
            setAffairInvoices([]);
        } else {
            getGdpPythagoreFactures({filter:
                    { num_affaire: {
                            _in: affairsToAdd}
                    }}).then((res) => {
                if(isRequestSuccessful(res.status) && res?.data){
                    setAffairInvoices(res.data);
                }
            })
        }
    }, [affairsPythagoreAffaires]);

    useEffect(() => {
        if(affair){
            getGdpAffairsPythagoreAffairs({filter:{affairs_id: affair.id}}).then((affairsPythagoreRes) => {
                if(isRequestSuccessful(affairsPythagoreRes.status) && affairsPythagoreRes.data){
                    getGdpPythagoreFactures({filter: {num_affaire: {_in : affairsPythagoreRes.data.map(aff => aff.pythagore_affaires_id)}}})
                        .then(
                            (res) => {
                                if(isRequestSuccessful(res.status) && res.data){
                                    setAffairInvoices(res.data);
                                }
                            }
                        )
                }
            })
        }
    }, [affair]);

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
            <ConfigureFacturationForm isOpen={isConfigureFacturationFormOpen} setIsOpen={setIsConfigureFacturationFormOpen} initProject={project} initAffair={affair}/>
            {factures.length > 0 ? (
                <FacturesPage
                    files={factures}
                    setSpecificFilters={setFacturesQueryParameters}
                    filesCount={facturesCount}
                    lazyLoadingState={lazyLoadingState}
                    setLazyLoadingState={setLazyLoadingState}
                    disableGlobalFilters={true}
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

export default BillingsFromProject;
