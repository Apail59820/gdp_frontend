import React from 'react';
import styles from './FilesGridDisplay.module.scss';

import FileOrFolderCard from '../FilesCard/FileOrFolderCard';
import { GdpFilesModel } from '../../../models/GestionDeProjets/GdpFilesModel';
import { FolderType } from '../../FilesOfProjectPage/FilesOfProjectPage';

export type GridFileItem = {
  file: Partial<GdpFilesModel>;
  type: 'file';
  onClick?: () => void;
  href?: string;
};

export type GridFolderItem = {
  folder: FolderType;
  type: 'folder' | 'back';
  onClick?: () => void;
  href?: string;
};

type Props = {
  files: GridFileItem[];
  folders: GridFolderItem[];
};

const FilesGridDisplay = ({ files, folders }: Props) => {
  return (
    <div className={styles.filesGridDisplayContainer}>
      {folders.length > 0 && (
        <div className={styles.foldersContainer}>
          {folders.map((folder, index) => (
            <FileOrFolderCard
              key={index}
              asset={folder.folder}
              onClick={folder.onClick}
              href={folder.href}
              type={folder.type}
            />
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className={styles.filesContainerWithTitle}>
          <h2>Fichiers</h2>
          <div className={styles.filesContainer}>
            {files.map((file, index) => (
              <FileOrFolderCard
                key={index}
                asset={file.file}
                onClick={file.onClick}
                href={file.href}
                type={file.type}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesGridDisplay;
