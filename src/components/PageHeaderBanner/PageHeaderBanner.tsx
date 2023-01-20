import React from 'react';
import styles from './PageHeaderBanner.module.scss';
import { ProjectModel } from '../../../models/ProjectModel';
import MainMessage, { MainMessageProps } from './MainMessage/MainMessage';
import { CompanyEnum } from '../../../models/CompanyEnum';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';

type Props = Partial<MainMessageProps> & {
  title?: string;
};

const PageHeaderBanner = ({ project, title }: Props) => {
  const getColorByCompany = () => {
    switch (project?.company_entity) {
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
    <div className={`${styles.pageHeaderBanner} ${project?.company_entity ? getColorByCompany() : ''}`}>
      {project ? (
        <>
          <MainMessage project={project} />
          <img
            className={styles.logo}
            src={getImagesByCompany(project.company_entity).logo}
            alt={`Logo de ${project.company_entity}`}
          />
        </>
      ) : null}
      {!project && title ? <MainMessage project={{ name: title }} showImage={false} /> : null}
    </div>
  );
};

export default PageHeaderBanner;
