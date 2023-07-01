import React from 'react';
import styles from './FilesCard.module.scss';
import { ShadowCard } from '@projex/ui';
import { GdpFilesModel } from '../../../models/GestionDeProjets/GdpFilesModel';
import FolderIcon from '../../../public/folder.svg';
import ArrowLeftLong from '../../../public/arrow-left-long.svg';
import FileIcon from '../../../public/file.svg';
import { FolderType } from '../../FilesOfProjectPage/FilesOfProjectPage';

interface PropsInterface {
  key: number;
  type: 'file' | 'folder' | 'back';
  onClick: () => void;
}

interface PropsFile extends PropsInterface {
  asset: Partial<GdpFilesModel>;
  type: 'file';
}

interface PropsFolder extends PropsInterface {
  asset: FolderType;
  type: 'folder' | 'back';
}

const FileOrFolderCard = ({ asset, type, onClick }: PropsFile | PropsFolder) => {
  const getImage = () => {
    if (type === 'folder') return FolderIcon;
    if (type === 'back') return ArrowLeftLong;

    // TODO Si le fichier est une image, retourner l'image en question
    // if (['png', 'svg', 'jpg'].includes(asset?.type)) return;

    return FileIcon;
  };

  const title = type === 'file' ? asset?.title : asset?.name;

  return (
    <div className={styles.fileCard} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={getImage().src} alt="Icon" />
      </div>
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default FileOrFolderCard;
