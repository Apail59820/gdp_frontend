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
            let ids = JSON.parse(localStorage.getItem("autoGlobalFilters"));

            if(globalFilters?.projects?.list.includes(ids?.project_id)){
                let newFilter: GlobalFiltersModel = { ...globalFilters };
                newFilter.projects = { ...newFilter.projects };
                newFilter.affairs = { ...newFilter.affairs};

                newFilter.projects.list = [];

                if(ids.affair_id) newFilter.affairs.list = [];

                dispatch(setGlobalFilters(newFilter));
                localStorage.removeItem("autoGlobalFilters");
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
