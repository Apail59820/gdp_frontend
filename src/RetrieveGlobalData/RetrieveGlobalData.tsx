import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { ReactNode, useCallback, useEffect } from 'react';
import { getGdpProjects } from '../../services/gestionDeProjets/GdpProjects';
import { GlobalFilterActionType, GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../../store/store';
import { selectProjects, setProjects } from '../../store/reducers/projectsReducer';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import { compileGlobalFiltersToProjectFilter } from './filterCompilers/projects';
import { compileGlobalFiltersToSatisfactionFilter } from './filterCompilers/satisfaction';
import { getGdpSatisfactions } from '../../services/gestionDeProjets/GdpAffairsSatisfaction';
import { selectSatisfactions, setSatisfactions } from '../../store/reducers/satisfactionReducer';
import { getGdpAffairs } from '../../services/gestionDeProjets/GdpAffairs';
import { selectAffairs, setAffairs } from '../../store/reducers/affairsReducer';
import { compileGlobalFiltersToAffairsFilter } from './filterCompilers/affairs';
import { selectPythagoreAffaires, setPythagoreAffaires } from '../../store/reducers/pythagoreFacturesReducer';
import { compileGlobalFiltersToPythagoreAffairesFilter } from './filterCompilers/pythagore_affaires';
import { getGdpPythagoreAffaires } from '../../services/gestionDeProjets/GdpPythagoreAffairs';
import { getGdpFiles } from '../../services/gestionDeProjets/GdpFiles';
import { selectFiles, setFiles } from '../../store/reducers/filesReducer';
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
  const users = useSelector(selectUsers);

  const updateProjects = useCallback(
    async (_globalFilters: GlobalFiltersModel) => {
      const filterRules = compileGlobalFiltersToProjectFilter(_globalFilters);
      const projectsResponse = await getGdpProjects({
        limit: '20',
        offset: '0',
        ..._globalFilters.projects.queryParameters,
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(projectsResponse.status) && projectsResponse.data) {
        if (_globalFilters.projects.action == GlobalFilterActionType.REPLACE)
          dispatch(setProjects(projectsResponse.data));
        else dispatch(setProjects([...projects, ...projectsResponse.data]));
      }
    },
    [dispatch, projects]
  );

  const updateSatisfaction = useCallback(
    async (_globalFilters: GlobalFiltersModel) => {
      const filterRules = compileGlobalFiltersToSatisfactionFilter(_globalFilters);
      const satisfactionResponse = await getGdpSatisfactions({
        limit: '20',
        offset: '0',
        ..._globalFilters.satisfaction.queryParameters,
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(satisfactionResponse.status) && satisfactionResponse.data) {
        if (_globalFilters.satisfaction.action == GlobalFilterActionType.REPLACE)
          dispatch(setSatisfactions(satisfactionResponse.data));
        else dispatch(setSatisfactions([...satisfaction, ...satisfactionResponse.data]));
      }
    },
    [dispatch, satisfaction]
  );
  const updateAffairs = useCallback(
    async (_globalFilters: GlobalFiltersModel) => {
      const filterRules = compileGlobalFiltersToAffairsFilter(_globalFilters);
      const affairsResponse = await getGdpAffairs({
        limit: '20',
        offset: '0',
        ..._globalFilters.affairs.queryParameters,
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(affairsResponse.status) && affairsResponse.data) {
        if (_globalFilters.affairs.action == GlobalFilterActionType.REPLACE) dispatch(setAffairs(affairsResponse.data));
        else dispatch(setAffairs([...affairs, ...affairsResponse.data]));
      }
    },
    [dispatch, affairs]
  );

  const updatePythagoreAffaires = useCallback(
    async (_globalFilters: GlobalFiltersModel) => {
      const filterRules = compileGlobalFiltersToPythagoreAffairesFilter(_globalFilters);
      const pythagoreAffairesResponses = await getGdpPythagoreAffaires({
        limit: '20',
        offset: '0',
        ..._globalFilters.pythagore_affaires.queryParameters,
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(pythagoreAffairesResponses.status) && pythagoreAffairesResponses.data) {
        if (_globalFilters.pythagore_affaires.action == GlobalFilterActionType.REPLACE)
          dispatch(setPythagoreAffaires(pythagoreAffairesResponses.data));
        else dispatch(setPythagoreAffaires([...factures, ...pythagoreAffairesResponses.data]));
      }
    },
    [dispatch, factures]
  );

  const updateFiles = useCallback(
    async (_globalFilters: GlobalFiltersModel) => {
      const filterRules = compileGlobalFiltersToFilesFilter(_globalFilters);
      const FilesResponses = await getGdpFiles({
        limit: '20',
        offset: '0',
        ..._globalFilters.pythagore_affaires.queryParameters,
        filter: { _or: filterRules },
      });
      if (isRequestSuccessful(FilesResponses.status) && FilesResponses.data) {
        if (_globalFilters.pythagore_affaires.action == GlobalFilterActionType.REPLACE)
          dispatch(setFiles(FilesResponses.data));
        else dispatch(setFiles([...files, ...FilesResponses.data]));
      }
    },
    [dispatch, files]
  );

  const updateUsers = useCallback(
    async (_globalFilters: GlobalFiltersModel) => {
      const clientsFilterRule = compileGlobalFiltersToClientsFilter(_globalFilters);
      const clientsListResponse = getGdpProjectsUsersClients({
        fields: 'directus_users_id',
        limit: _globalFilters.clients.queryParameters.limit || '20',
        offset: _globalFilters.clients.queryParameters.offset || '0',
        filter: { _or: clientsFilterRule },
      });

      const projectsCollaboratorsFilterRule = compileGlobalFiltersToProjectsCollaboratorsFilter(_globalFilters);
      const projectsCollaboratorsListResponse = getGdpProjectsUsersCollaborators({
        fields: 'directus_users_id',
        limit: _globalFilters.collaborators.queryParameters.limit || '20',
        offset: _globalFilters.collaborators.queryParameters.offset || '0',
        filter: { _or: projectsCollaboratorsFilterRule },
      });

      const affairsCollaboratorsFilterRule = compileGlobalFiltersToAffairsCollaboratorsFilter(_globalFilters);
      const affairsCollaboratorsListResponse = getGdpAffairsUsers({
        fields: 'directus_users_id',
        limit: _globalFilters.collaborators.queryParameters.limit || '20',
        offset: _globalFilters.collaborators.queryParameters.offset || '0',
        filter: { _or: affairsCollaboratorsFilterRule },
      });

      const usersList: string[] = [];
      const UsersListResponses = await Promise.all([
        clientsListResponse,
        projectsCollaboratorsListResponse,
        affairsCollaboratorsListResponse,
      ]);
      UsersListResponses.forEach((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          res.data.forEach((item: any) => {
            if (item.directus_users_id && !usersList.includes(item.directus_users_id))
              usersList.push(item.directus_users_id);
          });
        }
      });

      const UsersResponse =
        usersList.length > 0
          ? await getUsUsers({
              limit: _globalFilters.clients.queryParameters.limit || '20',
              offset: _globalFilters.clients.queryParameters.offset || '0',
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
      if (isRequestSuccessful(UsersResponse.status) && UsersResponse.data) {
        if (_globalFilters.clients.action == GlobalFilterActionType.REPLACE) dispatch(setUsers(UsersResponse.data));
        else dispatch(setUsers([...users, ...UsersResponse.data]));
      }
    },
    [dispatch, users]
  );

  useEffect(() => {
    updateProjects(globalFilters);
    updateSatisfaction(globalFilters);
    updateAffairs(globalFilters);
    updatePythagoreAffaires(globalFilters);
    updateFiles(globalFilters);
    updateUsers(globalFilters);
  }, [globalFilters]);

  return <>{children}</>;
}
