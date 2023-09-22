import React, {useState} from 'react';
import fileIcon from '../../../public/file.svg';
import styles from './PreviewFilesList.module.scss';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { ShadowCard } from 'projex-ui';
import { GdpFilesModel } from '../../../models/GestionDeProjets/GdpFilesModel';
import Image from 'next/image';
import FilesInfo from "../FilesInfo/FilesInfo";


export type PreviewFilesListProps = {
  files: Partial<GdpFilesModel>[];
  max?: number;
  allFilesPageHref?: string;
};

const PreviewFilesList = ({ files, max = 4, allFilesPageHref }: PreviewFilesListProps) => {
  const count = files.length;

  const [isFilesInfoModalOpen, setIsFilesInfoModalOpen] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<Partial<GdpFilesModel> | null>(null)
  const getImage = () => {
    // TODO Si le fichier est une image, retourner l'image en question
    // if (['png', 'svg', 'jpg'].includes(asset?.type)) return;

    return fileIcon;
  };

  const onFileClicked = (file : Partial<GdpFilesModel>) => {
    setIsFilesInfoModalOpen(true);
    setSelectedFile(file);
  }
  enum displayType {
    'image/png' = 'Image PNG',
    'application/pdf' = 'Document PDF',
    'image/svg+xml' = 'Image SVG',
    'image/jpeg' = 'Image JPG / JPEG',
    'application/zip' = 'Archive ZIP',
    'application/x-rar-compressed' = 'Archive RAR',
  }

  return (
      <>
        <ShadowCard>
          <div className={styles.container}>
            <ul className={styles.assetsContainer}>
              {[...files].slice(0, max).map(({ title, uploaded_on, type }, index) => (
                  <li className={styles.assetContainer} key={index}>
                    <div className={styles.imgAndTitle}>
                      <div className={styles.imageContainer}>
                        <Image src={getImage().src} fill alt="Icon" className={styles.image} />
                      </div>
                      <span className={styles.title} onClick={() => {onFileClicked(files[index])}}>{title}</span>
                    </div>
                    {type && (
                        <span className={styles.type}>{displayType[type as keyof typeof displayType] ?? 'Inconnu'}</span>
                    )}
                    {uploaded_on && (
                        <span className={styles.uploadDate}>
                      {DateTime.fromISO(uploaded_on).setLocale('fr').toLocaleString()}
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
        <FilesInfo
            isOpen={isFilesInfoModalOpen}
            setIsOpen={setIsFilesInfoModalOpen}
            file={selectedFile}
        />
      </>
  );
};

export default PreviewFilesList;
