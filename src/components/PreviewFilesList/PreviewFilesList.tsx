import React from 'react';
import fileIcon from '../../../public/file.svg';
import styles from './PreviewFilesList.module.scss';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { ShadowCard } from '@projex/ui';
import { GdpFilesModel } from '../../../models/GestionDeProjets/GdpFilesModel';

export type PreviewFilesListProps = {
  files: GdpFilesModel[];
  max?: number;
  allFilesPageHref?: string;
};

const PreviewFilesList = ({ files, max = 4, allFilesPageHref }: PreviewFilesListProps) => {
  const count = files.length;
  const getImage = () => {
    // TODO Si le fichier est une image, retourner l'image en question
    // if (['png', 'svg', 'jpg'].includes(asset?.type)) return;

    return fileIcon;
  };

  enum displayType {
    'png' = 'Image PNG',
    'pdf' = 'Document PDF',
    'svg' = 'Image SVG',
    'jpg' = 'Image JPG',
    'zip' = 'Archive ZIP',
    'rar' = 'Archive RAR',
  }

  return (
    <ShadowCard>
      <div className={styles.container}>
        <ul className={styles.assetsContainer}>
          {[...files].slice(0, max).map(({ title, uploaded_on, type }, index) => (
            <li className={styles.assetContainer} key={index}>
              <div className={styles.imgAndTitle}>
                <div className={styles.imageContainer}>
                  <img src={getImage().src} alt="Icon" />
                </div>
                <span className={styles.title}>{title}</span>
              </div>
              {type && (
                <span className={styles.type}>{displayType[type as keyof typeof displayType] ?? 'Inconnu'}</span>
              )}
              {uploaded_on && (
                <span className={styles.uploadDate}>
                  {DateTime.fromISO('uploaded_on').setLocale('fr').toLocaleString(DateTime.DATE_FULL)}
                </span>
              )}
            </li>
          ))}
        </ul>
        {count > max && (
          <Link href={allFilesPageHref ?? '/files'} className={styles.moreFiles}>
            + {count - max} autres fichiers
          </Link>
        )}
      </div>
    </ShadowCard>
  );
};

export default PreviewFilesList;
