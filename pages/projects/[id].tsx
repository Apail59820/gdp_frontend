import React from 'react';
import { CompanyEnum } from '../../models/CompanyEnum';
import { ProjectModel } from '../../models/ProjectModel';
import PageHeaderBanner from '../../src/components/PageHeaderBanner/PageHeaderBanner';
import styles from '../../styles/Project.module.scss';

const PROJECT_BY_ID: ProjectModel = {
  id: '1',
  name: 'Nom du projet',
  client_company_name: 'Nom du client',
  client_info: undefined,
  address: undefined,
  zip_code: undefined,
  city: undefined,
  country: undefined,
  image: 'ok',
  status: undefined,
  project_type: undefined,
  company_entity: CompanyEnum.PROJEX,
  affairs: undefined,
};

const Project = () => {
  return (
    <>
      <PageHeaderBanner project={PROJECT_BY_ID} />
      <div className={styles.projectPage}>Project</div>
    </>
  );
};

export default Project;
