// /!\ Ce composant n'existe plus sur la maquette

import React, { ImgHTMLAttributes, ReactNode } from 'react';
import styles from './InformationsSection.module.scss';
import defaultImage from '../../../public/default-project-image.png';
import { CompanyEnum } from '../../../../models/CompanyEnum';
import { capitalize } from '../../../../utils/capitalize';

type Props = {
  // TODO revoir les props
  informations: {
    image?: ImgHTMLAttributes<HTMLImageElement>;
    clientName: string;
    projetManager: string;
    numberOfAffairs?: number;
    company: CompanyEnum;
  };
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const InformationsSection = ({ informations, onButtonClick }: Props) => {
  // TODO
  const CURRENT_USER_CAN_EDIT = true;
  const IS_AN_AFFAIR = false;

  const renderInfo = (info: { label: string; data: string | number }): ReactNode => (
    <li className={styles.info}>
      {info.label} : <span className={styles.data}>{info.data}</span>
    </li>
  );

  return (
    <section className={styles.informationsSection}>
      <img
        className={styles.image}
        src={informations.image ? informations.image.src : defaultImage.src}
        alt={`Image représentant ${IS_AN_AFFAIR ? "l'affaire" : 'le projet'}`}
      />

      <ul className={styles.text}>
        <>
          <h3 className={styles.title}>Informations {IS_AN_AFFAIR ? "de l'affaire" : 'du projet'}</h3>
          {[
            {
              label: 'Client',
              data: capitalize(informations.clientName) || '/',
            },
            {
              label: 'Chef de projet',
              data: capitalize(informations.projetManager) || '/',
            },
            !IS_AN_AFFAIR
              ? {
                  label: 'Affaires en cours',
                  data: informations.numberOfAffairs || '/',
                }
              : null,
            {
              label: 'Entité',
              data: informations.company.toUpperCase() || '/',
            },
          ].map((info) => {
            if (info) return renderInfo(info);
            else return <></>;
          })}
        </>
      </ul>
      {CURRENT_USER_CAN_EDIT ? (
        // TODO
        <button className={styles.editButton} onClick={onButtonClick}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5 10.5C13.2188 10.5 13 10.75 13 11V14.5C13 15.0625 12.5312 15.5 12 15.5H2C1.4375 15.5 1 15.0625 1 14.5V4.5C1 3.96875 1.4375 3.5 2 3.5H5.5C5.75 3.5 6 3.28125 6 3C6 2.75 5.75 2.5 5.5 2.5H1.96875C0.875 2.5 0 3.40625 0 4.5V14.5C0 15.625 0.875 16.5 1.96875 16.5H11.9375C13.0312 16.5 13.9062 15.625 13.9062 14.5L14 11C14 10.75 13.75 10.5 13.5 10.5ZM15.5312 1.84375L14.6562 0.96875C14.375 0.65625 14 0.5 13.5938 0.5C13.2188 0.5 12.8438 0.65625 12.5312 0.96875L5.0625 8.4375C4.78125 8.71875 4.59375 9.0625 4.5 9.46875L4 12.0625C3.9375 12.3125 4.125 12.5312 4.34375 12.5312C4.375 12.5312 4.40625 12.5 4.4375 12.5L7.03125 12C7.4375 11.9062 7.78125 11.7188 8.0625 11.4375L15.5312 3.96875C16.125 3.375 16.125 2.40625 15.5312 1.84375ZM7.34375 10.7188C7.21875 10.8438 7.03125 10.9375 6.84375 10.9688L5.15625 11.3125L5.5 9.65625C5.53125 9.46875 5.625 9.28125 5.78125 9.15625L11.3438 3.5625L12.9375 5.15625L7.34375 10.7188ZM14.8438 3.25L13.625 4.46875L12.0312 2.875L13.25 1.65625C13.375 1.53125 13.5312 1.53125 13.5938 1.53125C13.6875 1.53125 13.8438 1.53125 13.9688 1.65625L14.8438 2.53125C14.9688 2.65625 15 2.8125 15 2.90625C15 2.96875 14.9688 3.125 14.8438 3.25Z"
              fill="#002559"
            />
          </svg>
        </button>
      ) : null}
    </section>
  );
};

export default InformationsSection;
