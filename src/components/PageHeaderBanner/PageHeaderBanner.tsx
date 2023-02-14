import React from 'react';
import styles from './PageHeaderBanner.module.scss';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import MainMessage from './MainMessage/MainMessage';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';

type Props = {
  data: any;
  // data: string | Partial<GdpProjectsModel>;
};

const PageHeaderBanner = ({ data }: Props) => {
  const getColorByCompany = () => {
    if (typeof data === 'string') return '';

    // switch (data?.company_entity) {
    // case CompanyEnum.AMEXIA:
    //   return styles.amexia;
    // case CompanyEnum.DIAGOBAT:
    //   return styles.diagobat;
    // case CompanyEnum.IMPERIUM:
    //   return styles.imperium;
    // case CompanyEnum.PROBIM:
    //   return styles.probim;
    // case CompanyEnum.PROJEX:
    //   return styles.projex;
    // default:
    return styles.groupeProjex;
    // };
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
            src={getImagesByCompany(typeof data.company_entity === 'string' ? data.company_entity['name'] : '').logo}
            alt={`Logo de ${data.company_entity}`}
          />
        </>
      )}
    </div>
  );
};
export default PageHeaderBanner;
