import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { ReactNode, useCallback, useEffect } from 'react';
import { getGdpProjects } from '../../services/gestionDeProjets/GdpProjects';
import { GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../../store/store';
import { selectProjects, setProjects, setProjectsCount } from '../../store/reducers/projectsReducer';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import { compileGlobalFiltersToProjectFilter } from './filterCompilers/projects';
import { compileGlobalFiltersToSatisfactionFilter } from './filterCompilers/satisfaction';
import { getGdpSatisfactions } from '../../services/gestionDeProjets/GdpAffairsSatisfaction';
import { selectSatisfactions, setSatisfactions } from '../../store/reducers/satisfactionReducer';
import { getGdpAffairs } from '../../services/gestionDeProjets/GdpAffairs';
import { selectAffairs, setAffairs, setAffairsCount } from '../../store/reducers/affairsReducer';
import { compileGlobalFiltersToAffairsFilter } from './filterCompilers/affairs';
import {
  selectPythagoreAffaires,
  setPythagoreAffaires,
  setPythagoreAffairesCount,
} from '../../store/reducers/pythagoreFacturesReducer';
import { compileGlobalFiltersToPythagoreAffairesFilter } from './filterCompilers/pythagore_affaires';
import { getGdpPythagoreAffaires } from '../../services/gestionDeProjets/GdpPythagoreAffairs';
import { getGdpFiles } from '../../services/gestionDeProjets/GdpFiles';
import { selectFiles, setFiles, setFilesCount } from '../../store/reducers/filesReducer';
import { compileGlobalFiltersToFilesFilter } from './filterCompilers/files';
import { compileGlobalFiltersToClientsFilter } from './filterCompilers/clients';
import { getUsUsers } from '../../services/userService/UsUsers';
import { selectUsers, setUsers } from '../../store/reducers/usersReducer';
import { getGdpProjectsUsersClients } from '../../services/gestionDeProjets/GdpProjectsUsersClients';
import {
  compileGlobalFiltersToAffairsCollaboratorsFilter,
  compileGlobalFiltersToProjectsCollaboratorsFilter,
} from './filterCompilers/collaborators';
import { getGdpAffairsUsers } from '../../services/gestionDeProjets/GdpAffairsUsers';
import { getGdpProjectsUsersCollaborators } from '../../services/gestionDeProjets/GdpProjectsUsersCollaborators';
import { getUsCompanyEntities } from '../../services/userService/UsCompanyEntities';
import { selectCompanyEntities, setCompanyEntities } from '../../store/reducers/companyEntitiesReducer';
import {
  selectClientsCompanyEntities,
  setClientsCompanyEntities,
} from '../../store/reducers/clientsCompanyEntitiesReducer';
import { getUsClientsCompanyEntities } from '../../services/userService/UsClientsCompanyEntities';
import { RetrieveClientsOfClientsCompanyEntities } from './RetrieveClientsOfClientsCompanyEntities';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

type Props = {
  children: ReactNode;
};

export function RetrieveGlobalData({ children }: Props) {
  const dispatch = useDispatch();
  const globalFilters = useSelector<AppState, GlobalFiltersModel>(selectGlobalFilters);
  const projects = useSelector(selectProjects);
  const satisfaction = useSelector(selectSatisfactions);
  const affairs = useSelector(selectAffairs);
  const factures = useSelector(selectPythagoreAffaires);
  const files = useSelector(selectFiles);
  const companyEntities = useSelector(selectCompanyEntities);
  const users = useSelector(selectUsers);
  const clientsCompanyEntities = useSelector(selectClientsCompanyEntities);

  const updateProjects = useCallback(
    async (_globalFilters: GlobalFiltersModel, additionalClients: string[] = []) => {
      const filterRules = compileGlobalFiltersToProjectFilter(_globalFilters, additionalClients);

      const projectsResponse = await getGdpProjects({
        ..._globalFilters.projects.queryParameters,
        limit: publicRuntimeConfig.PROJECTS_GLOBAL_CHUNK_SIZE,
        offset: '0',
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(projectsResponse.status) && projectsResponse.data) {
        dispatch(setProjects(projectsResponse.data));
      }

      const projectsCountResponse = await getGdpProjects({
        ..._globalFilters.projects.queryParameters,
        limit: undefined,
        offset: undefined,
        aggregate: { count: 'id' },
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(projectsCountResponse.status) && projectsCountResponse.data)
        dispatch(setProjectsCount(parseInt((projectsCountResponse.data as any)[0].count.id)));
    },
    [dispatch, projects]
  );

  const updateSatisfaction = useCallback(
    async (_globalFilters: GlobalFiltersModel, additionalClients: string[] = []) => {
      const filterRules = compileGlobalFiltersToSatisfactionFilter(_globalFilters, additionalClients);
      const satisfactionResponse = await getGdpSatisfactions({
        ..._globalFilters.satisfaction.queryParameters,
        limit: publicRuntimeConfig.SATISFACTION_GLOBAL_CHUNK_SIZE,
        offset: '0',
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(satisfactionResponse.status) && satisfactionResponse.data)
        dispatch(setSatisfactions(satisfactionResponse.data));
    },
    [dispatch, satisfaction]
  );
  const updateAffairs = useCallback(
    async (_globalFilters: GlobalFiltersModel, additionalClients: string[] = []) => {
      const filterRules = compileGlobalFiltersToAffairsFilter(_globalFilters, additionalClients);
      const affairsResponse = await getGdpAffairs({
        ..._globalFilters.affairs.queryParameters,
        limit: publicRuntimeConfig.AFFAIRS_GLOBAL_CHUNK_SIZE,
        offset: '0',
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(affairsResponse.status) && affairsResponse.data) {
        dispatch(setAffairs(affairsResponse.data));
      }

      const affairsCountResponse = await getGdpAffairs({
        ..._globalFilters.affairs.queryParameters,
        limit: undefined,
        offset: undefined,
        aggregate: { count: 'id' },
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(affairsCountResponse.status) && affairsCountResponse.data)
        dispatch(setAffairsCount(parseInt((affairsCountResponse.data as any)[0].count.id)));
    },
    [dispatch, affairs]
  );

  const updatePythagoreAffaires = useCallback(
    async (_globalFilters: GlobalFiltersModel, additionalClients: string[] = []) => {
      const filterRules = compileGlobalFiltersToPythagoreAffairesFilter(_globalFilters, additionalClients);
      const pythagoreAffairesResponses = await getGdpPythagoreAffaires({
        limit: publicRuntimeConfig.FACTURES_GLOBAL_CHUNK_SIZE,
        offset: '0',
        ..._globalFilters.pythagore_affaires.queryParameters,
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(pythagoreAffairesResponses.status) && pythagoreAffairesResponses.data)
        dispatch(setPythagoreAffaires(pythagoreAffairesResponses.data));

      const pythagoreAffairesCountResponse = await getGdpPythagoreAffaires({
        ..._globalFilters.pythagore_affaires.queryParameters,
        limit: undefined,
        offset: undefined,
        aggregate: { count: 'numero_affaire' },
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(pythagoreAffairesCountResponse.status) && pythagoreAffairesCountResponse.data) {
        dispatch(
          setPythagoreAffairesCount(parseInt((pythagoreAffairesCountResponse.data as any)[0].count.numero_affaire))
        );
      }
    },
    [dispatch, factures]
  );

  const updateFiles = useCallback(
    async (_globalFilters: GlobalFiltersModel, additionalClients: string[] = []) => {
      const filterRules = compileGlobalFiltersToFilesFilter(_globalFilters, additionalClients);
      const FilesResponses = await getGdpFiles({
        ..._globalFilters.pythagore_affaires.queryParameters,
        limit: publicRuntimeConfig.FILES_GLOBAL_CHUNK_SIZE,
        offset: '0',
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(FilesResponses.status) && FilesResponses.data) dispatch(setFiles(FilesResponses.data));

      const FilesCountResponse = await getGdpFiles({
        ..._globalFilters.pythagore_affaires.queryParameters,
        limit: undefined,
        offset: undefined,
        aggregate: { count: 'id' },
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(FilesCountResponse.status) && FilesCountResponse.data) {
        dispatch(setFilesCount(parseInt((FilesCountResponse.data as any)[0].count.id)));
      }
    },
    [dispatch, files]
  );

  const updateUsersAndClientsCompanyEntities = useCallback(
    async (_globalFilters: GlobalFiltersModel, additionalClients: string[] = []) => {
      const clientsFilterRule = compileGlobalFiltersToClientsFilter(_globalFilters);
      const clientsListResponse = getGdpProjectsUsersClients({
        fields: 'directus_users_id',
        limit: publicRuntimeConfig.CLIENTS_GLOBAL_CHUNK_SIZE,
        offset: '0',
        filter: { _or: clientsFilterRule },
      });

      const projectsCollaboratorsFilterRule = compileGlobalFiltersToProjectsCollaboratorsFilter(
        _globalFilters,
        additionalClients
      );
      const projectsCollaboratorsListResponse = getGdpProjectsUsersCollaborators({
        fields: 'directus_users_id',
        limit: publicRuntimeConfig.COLLABORATORS_GLOBAL_CHUNK_SIZE,
        offset: '0',
        filter: { _or: projectsCollaboratorsFilterRule },
      });

      const affairsCollaboratorsFilterRule = compileGlobalFiltersToAffairsCollaboratorsFilter(
        _globalFilters,
        additionalClients
      );
      const affairsCollaboratorsListResponse = getGdpAffairsUsers({
        fields: 'directus_users_id',
        limit: publicRuntimeConfig.COLLABORATORS_GLOBAL_CHUNK_SIZE,
        offset: '0',
        filter: { _or: affairsCollaboratorsFilterRule },
      });

      const usersList: string[] = [];
      const UsersListResponses = await Promise.all([
        clientsListResponse,
        projectsCollaboratorsListResponse,
        affairsCollaboratorsListResponse,
      ]);
      const clientsArrays: string[] =
        isRequestSuccessful(UsersListResponses[0].status) && UsersListResponses[0].data
          ? UsersListResponses[0].data.map((item) => item.directus_users_id as string)
          : [];
      UsersListResponses.forEach((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          res.data.forEach((item) => {
            if (item.directus_users_id && !usersList.includes(item.directus_users_id as string))
              usersList.push(item.directus_users_id as string);
          });
        }
      });

      additionalClients.forEach((id) => {
        if (!usersList.includes(id)) usersList.push(id);
      });

      //update clientsCompanyEntities
      if (clientsArrays.length > 0 || _globalFilters.clients_company_entities.list.length > 0) {
        const orRules: any[] = [];
        if (clientsArrays.length > 0) orRules.push({ users: { directus_users_id: { _in: clientsArrays } } });
        if (_globalFilters.clients_company_entities.list.length > 0)
          orRules.push({ id: { _in: _globalFilters.clients_company_entities.list } });
        const clientsCompanyEntitiesResponse = await getUsClientsCompanyEntities({
          filter: {
            _or: orRules,
          },
        });
        if (isRequestSuccessful(clientsCompanyEntitiesResponse.status) && clientsCompanyEntitiesResponse.data)
          dispatch(setClientsCompanyEntities(clientsCompanyEntitiesResponse.data));
      }

      //update users
      const UsersResponse =
        usersList.length > 0
          ? await getUsUsers({
              limit: undefined,
              offset: undefined,
              filter: { id: { _in: usersList } },
              // filter: {
              //   _and: [
              //     { id: { _in: usersList } },
              //     {
              //       _or: [
              //         {
              //           _and: [{ role: { name: { _eq: 'client' } } }, _globalFilters.clients.queryParameters.filter],
              //         },
              //         {
              //           _and: [{ role: { name: { _neq: 'client' } } }, _globalFilters.collaborators.queryParameters.filter],
              //         },
              //       ],
              //     },
              //   ],
              // },
            })
          : { status: 200, data: [] };
      if (isRequestSuccessful(UsersResponse.status) && UsersResponse.data) dispatch(setUsers(UsersResponse.data));
    },
    [dispatch, users, clientsCompanyEntities]
  );

  const updateCompanyEntities = useCallback(
    async (_globalFilters: GlobalFiltersModel) => {
      const CompanyEntitiesResponses = await getUsCompanyEntities();
      if (isRequestSuccessful(CompanyEntitiesResponses.status) && CompanyEntitiesResponses.data) {
        if (_globalFilters.company_entities) dispatch(setCompanyEntities(CompanyEntitiesResponses.data));
        else dispatch(setCompanyEntities([...companyEntities, ...CompanyEntitiesResponses.data]));
      }
    },
    [dispatch, companyEntities]
  );

  function updateAll(additionalClients: string[] = []) {
    updateProjects(globalFilters, additionalClients);
    updateSatisfaction(globalFilters, additionalClients);
    updateAffairs(globalFilters, additionalClients);
    updatePythagoreAffaires(globalFilters, additionalClients);
    updateFiles(globalFilters, additionalClients);
    updateUsersAndClientsCompanyEntities(globalFilters, additionalClients);
  }

  useEffect(() => {
    //retrieve clients linked to clientsCompanyEntities
    RetrieveClientsOfClientsCompanyEntities(globalFilters).then((clients) => {
      updateAll(clients);
    });
  }, [globalFilters]);

  useEffect(() => {
    updateCompanyEntities(globalFilters);
  }, []);

  return <>{children}</>;
}
