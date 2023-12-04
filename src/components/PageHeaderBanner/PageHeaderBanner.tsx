import React, { useEffect, useMemo, useState, useRef } from 'react';
import styles from './PageHeaderBanner.module.scss';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import MainMessage from './MainMessage/MainMessage';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../../store/reducers/companyEntitiesReducer';
import { CompanyEnum } from '../../../models/UserService/UsCompanyEntityModel';
import {GdpAffairModel} from "../../../models/GestionDeProjets/GdpAffairModel";
import affairId from "../../../pages/projects/[projectId]/affairs/[affairId]";
import {message} from "antd";
import {getGdpAffairs} from "../../../services/gestionDeProjets/GdpAffairs";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";

type Props = {
  data: Partial<GdpProjectsModel> | string;
  affair?: Partial<GdpAffairModel>;
};

const PageHeaderBanner = ({ data, affair }: Props) => {
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
    if (data.company_entity || affair?.company_entity) {
      if (typeof data.company_entity === 'number' || typeof affair.company_entity === 'number') {
        const companyEntity = companyEntities
            .find((companyEntity) => companyEntity.id === ((affair) ? affair.company_entity : data.company_entity));

        getGdpAffairs({ filter: { id: { _in: data.affairs_ids } } }).then((res) => {
          if (isRequestSuccessful(res.status) && res.data) {
            let affairs_company_entities: number[] = res.data.map(affair => affair.company_entity as number);

            if (new Set(affairs_company_entities).size >= 2) {
              setProjectCompanyEntity(CompanyEnum.GROUPE_PROJEX);
              return;
            }
          }

          if (companyEntity && companyEntity.name) {
            setProjectCompanyEntity(companyEntity.name);
          }
          else setProjectCompanyEntity('Entité inconnue');
        })
      } else {
        if (data.company_entity.name || affair.company_entity.name) setProjectCompanyEntity(affair ? affair.company_entity.name : data.company_entity.name);
        else setProjectCompanyEntity('Entité inconnue');
      }
    } else setProjectCompanyEntity('Entité inconnue');
  }, [companyEntities, data, affair, companyEntityLogoRef.current?.clientWidth]);


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
