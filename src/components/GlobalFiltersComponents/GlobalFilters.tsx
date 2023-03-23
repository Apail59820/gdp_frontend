import React from 'react';
import styles from './GlobalFilters.module.scss';
import GlobalFiltersDataSelector from './GlobalFiltersDataSelector/GlobalFiltersDataSelector';

const GlobalFilters = () => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.buttonContainer}>
        <GlobalFiltersDataSelector />
      </div>
    </div>
  );
};

export default GlobalFilters;
