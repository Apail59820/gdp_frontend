import React from 'react';
import styles from './FilesCard.module.scss';
import { ShadowCard } from '@projex/ui';
import { AssetModel } from '../../../models/AssetModel';
import { AffairModel } from '../../../models/AffairModel';
import folderIcon from '../../../public/folder.svg';
import fileIcon from '../../../public/file.svg';

type Props = {
  asset?: AssetModel;
  affair?: AffairModel;
};

const FilesCard = ({ asset, affair }: Props) => {
  const getImage = () => {
    if (affair) return folderIcon;

    // TODO Si le fichier est une image, retourner l'image en question
    // if (['png', 'svg', 'jpg'].includes(asset?.type)) return;

    return fileIcon;
  };

  return (
    <ShadowCard>
      <div className={styles.filesCard}>
        <div className={styles.imageContainer}>
          <img src={getImage().src} alt="Icon" />
        </div>
        <span className={styles.title}>{asset?.title || affair?.name}</span>
      </div>
    </ShadowCard>
  );
};

export default FilesCard;
