import React from 'react';
import { AssetModel } from '../../../models/AssetModel';
import fileIcon from '../../../public/file.svg';
import styles from './PreviewFilesList.module.scss';
import { DateTime } from 'luxon';
import Link from 'next/link';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';

type props = { assetsList: AssetModel[]; linkToAllAssets?: string };

const PreviewFilesList = ({ assetsList, linkToAllAssets }: props) => {
  const count = assetsList.length;
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

  return assetsList.length > 0 ? (
    <div className={styles.container}>
      <div className={styles.assetsContainer}>
        {[...assetsList].slice(0, 4).map(({ title, uploaded_on, type }, index) => (
          <div className={styles.assetContainer} key={index}>
            <div className={styles.imgAndTitle}>
              <img src={getImage().src} alt="Icon" />
              <b>{title}</b>
            </div>
            {type && <span>{displayType[type as keyof typeof displayType] ?? 'Inconnu'}</span>}
            {uploaded_on && <span>{DateTime.fromISO(uploaded_on).toLocaleString(DateTime.DATE_FULL)}</span>}
          </div>
        ))}
      </div>
      {count > 4 && (
        <Link href={linkToAllAssets ?? '/files'} className={styles.moreFiles}>
          + {count - 4} autres fichiers
        </Link>
      )}
    </div>
  ) : (
    <ConfigureWidget
      descriptionText={"Vous n'avez aucun fichier."}
      buttonText={'Ajouter un fichier'}
      onClick={() => console.log('Open Modal to add file')}
    />
  );
};

export default PreviewFilesList;
