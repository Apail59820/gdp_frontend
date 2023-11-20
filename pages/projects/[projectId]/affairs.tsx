import AffairsPage from "../../../src/AffairsPage/AffairsPage";
import {useEffect, useState} from "react";
import {GdpAffairModel} from "../../../models/GestionDeProjets/GdpAffairModel";
import {useSelector} from "react-redux";
import {selectAffairs, selectAffairsCount} from "../../../store/reducers/affairsReducer";
import {QueryParameters} from "../../../models/DirectusModel";
import {LazyLoadingStateType} from "../../../models/LazyLoadingStateType";
import getConfig from "next/config";
import {
    RetrieveClientsOfClientsCompanyEntities
} from "../../../src/RetrieveGlobalData/RetrieveClientsOfClientsCompanyEntities";
import {
    compileGlobalFiltersToPythagoreFacturesFilter
} from "../../../src/RetrieveGlobalData/filterCompilers/pythagore_affaires";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {getGdpAffairs} from "../../../services/gestionDeProjets/GdpAffairs";
import {selectGlobalFilters} from "../../../store/reducers/globalFilterReducer";
import {getGdpProjectById} from "../../../services/gestionDeProjets/GdpProjects";
import {useRouter} from "next/router";
import {getGdpPythagoreFactures} from "../../../services/gestionDeProjets/GdpPythagoreFactures";

const { publicRuntimeConfig } = getConfig();
const AffairsFromProject = () => {

    const router = useRouter();

    const globalAffairs = useSelector(selectAffairs);
    const globalAffairsCount = useSelector(selectAffairsCount);
    const globalFilters = useSelector(selectGlobalFilters);

    const projectId = parseInt(router.query.projectId as string);

    const [affairs, setAffairs] = useState<Partial<GdpAffairModel>[]>(globalAffairs);

    const [affairsQueryParameters, setAffairsQueryParameters] = useState<Omit<QueryParameters, 'limit' | 'offset'>>({});

    const [affairsCount, setAffairsCount] = useState<number | null>(null);


    const [lazyLoadingState, setLazyLoadingState] = useState<LazyLoadingStateType>({
        limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE,
        offset: 0,
        action: 'REPLACE',
    });

    async function retrieveData() {
        const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
        const globalFilterRules = compileGlobalFiltersToPythagoreFacturesFilter(globalFilters, additionalClients);

        const affairsToFetch: number[] = [];

        const filterRules = [];

        if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
        if (affairsQueryParameters.filter) filterRules.push(affairsQueryParameters.filter);

        getGdpProjectById(projectId).then(res => {
            if (isRequestSuccessful(res?.status)) {
                res?.data.affairs_ids.forEach(id => {
                    affairsToFetch.push(id);
                });
            }
        }).finally(() => {
            getGdpAffairs({...affairsQueryParameters,
                limit: lazyLoadingState.limit,
                offset: lazyLoadingState.offset,
                filter: filterRules.length > 0 ?
                    { _and: filterRules, id: {_in: affairsToFetch}} : {id: {_in: affairsToFetch}}}).then((projectsResponse
            ) => {
                if (isRequestSuccessful(projectsResponse.status) && projectsResponse.data) {
                    if (lazyLoadingState.action == 'REPLACE') setAffairs(projectsResponse.data);
                    else setAffairs([...affairs, ...projectsResponse.data]);
                }
            });
        });
    }

    async function retrieveCount() {
        const additionalClients = await RetrieveClientsOfClientsCompanyEntities(globalFilters);
        const globalFilterRules = compileGlobalFiltersToPythagoreFacturesFilter(globalFilters, additionalClients);

        const filterRules = [];
        if (globalFilterRules.length > 0) filterRules.push({ _or: globalFilterRules });
        if (affairsQueryParameters.filter) filterRules.push(affairsQueryParameters.filter);
        const projectsCountResponse = await getGdpAffairs({
            ...globalFilters.projects.queryParameters,
            ...affairsQueryParameters,
            filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
            limit: undefined,
            offset: undefined,
            aggregate: { count: 'id' },
        });
        if (isRequestSuccessful(projectsCountResponse.status) && projectsCountResponse.data)
            setAffairsCount(parseInt((projectsCountResponse.data as any)[0].count.id));
    }

    useEffect(() => {
        if (Object.keys(affairsQueryParameters).length > 0 || lazyLoadingState.action !== 'REPLACE') retrieveData();
        else setAffairs(globalAffairs);
    }, [affairsQueryParameters, lazyLoadingState]);

    useEffect(() => {
        if (Object.keys(affairsQueryParameters).length > 0) retrieveCount();
        else setAffairsCount(globalAffairsCount);
    }, [affairsQueryParameters]);

    useEffect(() => {
        if (Object.keys(affairsQueryParameters).length == 0) setAffairs(globalAffairs);
    }, [globalAffairs]);

    return (
        <>
                <AffairsPage files={affairs}
                             filesCount={affairsCount}
                             setSpecificFilters={setAffairsQueryParameters}
                             lazyLoadingState={lazyLoadingState}
                             setLazyLoadingState={setLazyLoadingState}
                             disableGlobalFilters={true}
                />
        </>
    );
};

export default AffairsFromProject;