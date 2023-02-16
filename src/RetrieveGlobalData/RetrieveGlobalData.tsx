import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { ReactNode, useCallback, useEffect } from 'react';
import { getGdpProjects } from '../../services/gestionDeProjets/GdpProjects';
import { GlobalFilterActionType, GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../../store/store';
import { selectProjects, setProjects } from '../../store/reducers/projectsReducer';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import { compileGlobalFiltersToProjectFilter } from './filterCompilers/projects';
import { getGdpAffairs } from '../../services/gestionDeProjets/GdpAffairs';
import { selectAffairs, setAffairs } from '../../store/reducers/affairsReducer';
import { compileGlobalFiltersToAffairsFilter } from './filterCompilers/affairs';

type Props = {
  children: ReactNode;
};

export function RetrieveGlobalData({ children }: Props) {
  const dispatch = useDispatch();
  const globalFilters = useSelector<AppState, GlobalFiltersModel>(selectGlobalFilters);
  const projects = useSelector(selectProjects);
  const affairs = useSelector(selectAffairs);

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

  useEffect(() => {
    updateProjects(globalFilters);
    updateAffairs(globalFilters);
  }, [globalFilters]);

  return <>{children}</>;
}
