import React from 'react';
import styles from './FilesGridDisplay.module.scss';

import FileOrFolderCard from '../FilesCard/FileOrFolderCard';
import { GdpFilesModel } from '../../../models/GestionDeProjets/GdpFilesModel';
import { FolderType } from '../../FilesOfProjectPage/FilesOfProjectPage';

type FileItem = {
  file: Partial<GdpFilesModel>;
  type: 'file';
  onClick: () => void;
};

type FolderItem = {
  folder: FolderType;
  type: 'folder' | 'back';
  onClick: () => void;
};

type Props = {
  files: FileItem[];
  folders: FolderItem[];
};

const FilesGridDisplay = ({ files, folders }: Props) => {
  return (
    <div className={styles.filesGridDisplayContainer}>
      {folders.length > 0 && (
        <div className={styles.foldersContainer}>
          {folders.map((folder, index) => (
            <FileOrFolderCard key={index} asset={folder.folder} onClick={folder.onClick} type={folder.type} />
          ))}
        </div>
      )}
      <div className={styles.filesContainerWithTitle}>
        <h2>Fichiers</h2>
        <div className={styles.filesContainer}>
          {files.map((file, index) => (
            <FileOrFolderCard key={index} asset={file.file} onClick={file.onClick} type={file.type} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilesGridDisplay;
