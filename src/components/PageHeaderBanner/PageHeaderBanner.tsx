import React, { useEffect, useMemo, useState, useRef } from 'react';
import styles from './PageHeaderBanner.module.scss';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import MainMessage from './MainMessage/MainMessage';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../../store/reducers/companyEntitiesReducer';
import { CompanyEnum } from '../../../models/UserService/UsCompanyEntityModel';

type Props = {
  data: Partial<GdpProjectsModel> | string;
};

const PageHeaderBanner = ({ data }: Props) => {
  const companyEntityLogoRef = useRef<HTMLImageElement>(null);
  const companyEntities = useSelector(selectCompanyEntities);
  const [projectCompanyEntity, setProjectCompanyEntity] = useState<string>('Entité inconnue');

  const getColorByCompany = useMemo(() => {
    switch (projectCompanyEntity) {
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
  }, [projectCompanyEntity]);

  // useEffect to fetch affair company entity
  useEffect(() => {
    if (typeof data === 'string') return;
    if (data.company_entity) {
      if (typeof data.company_entity === 'number') {
        const companyEntity = companyEntities.find((companyEntity) => companyEntity.id === data.company_entity);
        if (companyEntity && companyEntity.name) setProjectCompanyEntity(companyEntity.name);
        else setProjectCompanyEntity('Entité inconnue');
      } else {
        if (data.company_entity.name) setProjectCompanyEntity(data.company_entity.name);
        else setProjectCompanyEntity('Entité inconnue');
      }
    } else setProjectCompanyEntity('Entité inconnue');
  }, [companyEntities, data, companyEntityLogoRef.current?.clientWidth]);

  return (
    <div className={`${styles.pageHeaderBanner}  ${getColorByCompany}`}>
      {typeof data === 'string' ? (
        <MainMessage
          project={{ name: data }}
          showImage={false}
          resizeTitleProps={{
            entityLogoWidth: companyEntityLogoRef.current?.clientWidth as number,
          }}
        />
      ) : (
        <>
          <MainMessage
            project={data}
            onManageThumbnailClick={() => console.log('open modal ?')}
            resizeTitleProps={{
              entityLogoWidth: companyEntityLogoRef.current?.clientWidth as number,
            }}
          />
          <img
            ref={companyEntityLogoRef}
            className={styles.logo}
            data-logo-width={companyEntityLogoRef.current?.clientWidth}
            src={getImagesByCompany(projectCompanyEntity).logo}
            alt={`Logo de ${projectCompanyEntity}`}
          />
        </>
      )}
    </div>
  );
};
export default PageHeaderBanner;
