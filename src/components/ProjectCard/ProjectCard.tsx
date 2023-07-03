import React, { useEffect, useState } from 'react';
import styles from './ProjectCard.module.scss';
import { ShadowCard } from '@projex/ui';
import type { GdpProjectsModel } from '../../../models/GdPModels';
import { capitalize } from '../../../utils/capitalize';
import defaultImage from '../../../public/default-affair-image.png';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { getUsCompanyEntity } from '../../../services/userService/UsCompanyEntities';
import Link from 'next/link';
import { getGdpFile } from '../../../services/gestionDeProjets/GdpFiles';
import { isRequestSuccessful } from '../../../utils/isRequestSuccessful';
import getConfig from 'next/config';
import { Tooltip } from 'antd';

const { publicRuntimeConfig } = getConfig();

type Props = {
  project: Partial<GdpProjectsModel>;
  projectManagerName: string;
};

function addNewlines(input: string): string {
  const chunkSize = 24;
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return input.match(regex)?.join('\n') || '';
}

function countLines(input: string): number {
  if (input.length === 0) {
    return 0;
  }
  const lines = input.split('\n');
  return lines.filter((line) => line.trim().length > 0).length;
}

const ProjectCard = ({ project, projectManagerName }: Props) => {
  const { name, client_company_name, affairs_ids, company_entity, image } = project;
  const [companyEntityName, setCompanyEntityName] = useState<string | null>(null);
  const [projectImage, setProjectImage] = useState<string | undefined>('');
  const [isNameTooLong, setIsNameTooLong] = useState(false);

  useEffect(() => {
    if (image) {
      getGdpFile(image, undefined)
        .then(({ status, data }) => {
          if (isRequestSuccessful(status)) setProjectImage(data as string);
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  useEffect(() => {
    if (countLines(addNewlines(name as string)) >= 2) setIsNameTooLong(true);
    if (typeof company_entity === 'number' && company_entity) {
      getUsCompanyEntity(company_entity as number, '*').then((res) => {
        if (isRequestSuccessful(res?.status)) setCompanyEntityName(res?.data?.name as string);
      });
    }
  }, [project, company_entity, name]);

  return (
    <ShadowCard>
      <div className={styles.projectCard}>
        <img
          className={styles.image}
          src={projectImage || defaultImage.src}
          alt={`Image illustrant le projet ${project.name}`}
        />
        <section className={styles.content}>
          <h4 className={styles.title}>
            {isNameTooLong ? (
              <span className={styles.longName}>
                <Tooltip title={name}>{name ? capitalize(name) : '/'}</Tooltip>
              </span>
            ) : (
              <span>{name ? capitalize(name) : '/'}</span>
            )}
          </h4>
          <span>{client_company_name ? capitalize(client_company_name) : companyEntityName}</span>
          <span>{projectManagerName ? `${projectManagerName}`.toString().toUpperCase() : '(Aucun manager)'}</span>
          {affairs_ids?.length ? (
            <span>
              {affairs_ids?.length} affaire{affairs_ids.length > 1 ? 's' : ''}
            </span>
          ) : null}
          {companyEntityName && (
            <div className={styles.logoContainer}>
              <Link href={`${publicRuntimeConfig.USER_SERVICE_URL}/entity/${companyEntityName}`}>
                <img className={styles.logo} src={getImagesByCompany(companyEntityName as string).logo} alt="Logo" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </ShadowCard>
  );
};

export default ProjectCard;
