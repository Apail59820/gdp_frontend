import React from 'react';
import styles from './PageHeaderBanner.module.scss';
import { GdpProjectModel } from '../../../models/GestionDeProjets/GdpProjectModel';
import MainMessage from './MainMessage/MainMessage';
import { CompanyEnum } from '../../../models/CompanyEnum';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { ProjectModel } from '../../../models/ProjectModel';

type Props = {
  project?: GdpProjectModel;
  title?: string;
  data: string | GdpProjectModel;
};

const PageHeaderBanner = ({ data }: Props) => {
  const getColorByCompany = () => {
    if (typeof data === 'string') return '';

    switch (data?.company_entity) {
      case CompanyEnum.AMEXIA:
        return styles.amexia;
      case CompanyEnum.DIAGOBAT:
        return styles.diagobat;
      case CompanyEnum.IMPERIUM:
        return styles.imperium;
      case CompanyEnum.PROBIM:
        return styles.probim;
      case CompanyEnum.PROJEX:
        return styles.projex;
      default:
        return styles.groupeProjex;
    }
  };

  return (
    <div
      className={`${styles.pageHeaderBanner} ${
        typeof data !== 'string' && data?.company_entity ? getColorByCompany() : ''
      }`}
    >
      {typeof data === 'string' ? (
        <MainMessage project={{ name: data }} showImage={false} />
      ) : (
        <>
          <MainMessage project={data} onManageThumbnailClick={() => console.log('open modal ?')} />
          <img
            className={styles.logo}
            src={getImagesByCompany(data.company_entity).logo}
            alt={`Logo de ${data.company_entity}`}
          />
        </>
      )}
    </div>
  );
};

export default PageHeaderBanner;
