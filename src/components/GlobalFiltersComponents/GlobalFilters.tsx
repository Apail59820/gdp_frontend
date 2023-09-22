import React, {useEffect} from 'react';
import styles from './GlobalFilters.module.scss';
import GlobalFiltersDataSelector from './GlobalFiltersDataSelector/GlobalFiltersDataSelector';
import {useDispatch, useSelector} from "react-redux";
import {selectGlobalFilters, setGlobalFilters} from "../../../store/reducers/globalFilterReducer";
import {GlobalFiltersModel} from "../../../models/GlobalFiltersModel"

const GlobalFilters = () => {

    const globalFilters = useSelector(selectGlobalFilters);
    const dispatch = useDispatch();

    useEffect(() => {
        if(localStorage.getItem("autoGlobalFilters") !== null){
            let projectId = parseInt(localStorage.getItem("autoGlobalFilters"), 10);

            if(globalFilters?.projects?.list.includes(projectId)){
                const newFilter: GlobalFiltersModel = { ...globalFilters };
                newFilter.projects = { ...newFilter.projects };
                newFilter.projects.list = [];

                dispatch(setGlobalFilters(newFilter));
            }
        }
    }, []);

  return (
    <div className={styles.filterBar}>
      <div className={styles.buttonContainer}>
        <GlobalFiltersDataSelector />
      </div>
    </div>
  );
};

export default GlobalFilters;
