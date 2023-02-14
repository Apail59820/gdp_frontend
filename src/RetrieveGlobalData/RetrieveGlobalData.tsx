import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { ReactNode, useCallback, useEffect } from 'react';
import { getGdpProjects } from '../../services/gestionDeProjets/GdpProjects';
import { GlobalFilterActionType, GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../../store/store';
import { selectProjects, setProjects } from '../../store/reducers/projectsReducer';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import { compileGlobalFiltersToProjectFilter } from './filterCompilers/projects';

type Props = {
  children: ReactNode;
};

export function RetrieveGlobalData({ children }: Props) {
  const dispatch = useDispatch();
  const globalFilters = useSelector<AppState, GlobalFiltersModel>(selectGlobalFilters);
  const projects = useSelector(selectProjects);

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

  useEffect(() => {
    updateProjects(globalFilters);
  }, [globalFilters, updateProjects]);

  return <>{children}</>;
}
