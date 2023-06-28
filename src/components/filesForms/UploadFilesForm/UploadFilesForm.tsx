import { useEffect, useState } from 'react';
import { Modal, Upload } from 'antd';
import styles from './UploadFilesForm.module.scss';
import Image from 'next/image';
import { Button, ShadowCard } from '@projex/ui';
import FilePropertiesForm from '../FilePropertiesForm/FilePropertiesForm';
import { GdpProjectsModel } from '../../../../models/GestionDeProjets/GdpProjectsModel';
import { GdpAffairModel } from '../../../../models/GestionDeProjets/GdpAffairModel';
import { GdpPhaseModel } from '../../../../models/GestionDeProjets/GdpPhaseModel';
import { updateGdpFile, uploadGdpFilesWithProgress } from '../../../../services/gestionDeProjets/GdpFiles';
import {
  GdpAssetDocumentEnum,
  GdpFilesModel,
  GdpFilesStatusEnum,
  GdpFileUsageEnum,
} from '../../../../models/GestionDeProjets/GdpFilesModel';
import { isRequestSuccessful } from '../../../../utils/isRequestSuccessful';
import { getGdpAffairs } from '../../../../services/gestionDeProjets/GdpAffairs';
import { getGdpAffairsPhases } from '../../../../services/gestionDeProjets/GdpPhases';
import FileInput from '../../FIleUpload/FileInput';

export type UploadFilesFormPropsType = {
  isOpen: boolean;
  mode: 'files' | 'images';
  setIsOpen: (isOpen: boolean) => void;
  project: Partial<GdpProjectsModel>;
  affair?: Partial<GdpAffairModel>;
  phase?: Partial<GdpPhaseModel>;
};

export enum UploadStatusEnum {
  UPLOADING = 'uploading',
  WAITING_FOR_UPLOAD = 'waiting_for_upload',
  DONE = 'done',
  ERROR = 'error',
  PENDING = 'pending',
}

export type fileItemType = {
  id: string;
  file: File;
  properties: Partial<GdpFilesModel>;
  uploadState: UploadStatusEnum;
};

/**
 * Form to upload files
 * @param isOpen - boolean to open or close the modal
 * @param mode - files or images
 * @param setIsOpen - function to set the isOpen state
 * @param project - project to which the files will be attached
 * @param affair  - affair to which the files will be attached
 * @param phase - phase to which the files will be attached
 */
export default function UploadFilesFormUploadFilesForm({
  isOpen,
  mode = 'files',
  setIsOpen,
  project,
  affair,
  phase,
}: UploadFilesFormPropsType) {
  const [fileList, setFileList] = useState<fileItemType[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ percent: number; fileId: string }[]>([]);
  const [showPropertiesFormOfFileIndex, setShowPropertiesFormOfFileIndex] = useState<number | undefined>();
  const [affairsOptions, setAffairsOptions] = useState<Partial<GdpAffairModel>[]>([]);
  const [phasesOptions, setPhasesOptions] = useState<Partial<GdpPhaseModel>[]>([]);

  /**
   * Update affairs and phases options when project changes.
   */
  useEffect(() => {
    if (project == undefined) return;
    getGdpAffairs({ filter: { projects_id: { _eq: project.id } } }).then((affairsResponse) => {
      if (isRequestSuccessful(affairsResponse.status) && affairsResponse.data && affairsResponse.data.length > 0) {
        const affairsIds = affairsResponse.data.map((affair) => affair.id);
        getGdpAffairsPhases({ filter: { affairs_id: { _in: affairsIds } } }).then((phasesResponse) => {
          if (isRequestSuccessful(phasesResponse.status) && phasesResponse.data) {
            setPhasesOptions(phasesResponse.data);
          }
        });
        setAffairsOptions(affairsResponse.data);
      }
    });
  }, [project]);

  /**
   * callback function called when file is uploading
   * @param progressEvent
   * @param fileUID UID of the file in the form
   */
  function onUploadProgress(progressEvent: ProgressEvent, fileUID: string) {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setUploadProgress([
      ...uploadProgress.filter((progressItem) => progressItem.fileId !== fileUID),
      {
        fileId: fileUID,
        percent: percentCompleted,
      },
    ]);
  }

  /**
   * check file properties and modal mode to deduce its usage.
   * @param file
   */
  function getFileUsage(file: fileItemType): GdpFileUsageEnum {
    const type = mode === 'files' ? 'file' : 'image';
    const itemLinked =
      file.properties.affair_id != undefined && file.properties.phase_id != undefined
        ? 'phases'
        : file.properties.affair_id != undefined
        ? 'affairs'
        : 'projects';
    return `${itemLinked}/${type}` as GdpFileUsageEnum;
  }

  const uploadOneFile = async (fileUID: string, _fileListTmp: fileItemType[]) => {
    const fileIndex = _fileListTmp.findIndex((fileItem) => fileItem.id === fileUID);
    setFileList(
      _fileListTmp.map((fileItem) => ({
        ...fileItem,
        uploadState: fileItem.id === fileUID ? UploadStatusEnum.UPLOADING : fileItem.uploadState,
      }))
    );
    const uploadResponse = await uploadGdpFilesWithProgress(
      [
        {
          data: _fileListTmp[fileIndex].file,
          properties: {
            filename_download: _fileListTmp[fileIndex].properties.filename_download,
            filesize: _fileListTmp[fileIndex].file.size,
            status: _fileListTmp[fileIndex].properties.status || GdpFilesStatusEnum.VISIBLE,
            usage: getFileUsage(_fileListTmp[fileIndex]),
            projects_id: _fileListTmp[fileIndex].properties.projects_id || project.id,
            affair_id: _fileListTmp[fileIndex].properties.affair_id || null,
            phase_id: _fileListTmp[fileIndex].properties.phase_id || null,
            is_cover: _fileListTmp[fileIndex].properties.is_cover || false,
            document_type: _fileListTmp[fileIndex].properties.document_type || GdpAssetDocumentEnum.UNKNOWN,
            //tags:, //tags de base en fonction du type
          },
        },
      ],
      (progressEvent) => onUploadProgress(progressEvent, fileUID)
    );
    setUploadProgress([...uploadProgress.filter((progressItem) => progressItem.fileId !== fileUID)]);
    if (isRequestSuccessful(uploadResponse.status)) {
      const updatedFileList = _fileListTmp.map((fileItem) => ({
        ...fileItem,
        properties: {
          ...fileItem.properties,
          id:
            fileItem.id === fileUID && (uploadResponse.data as Partial<GdpFilesModel>)?.id
              ? (uploadResponse.data as Partial<GdpFilesModel>)?.id
              : fileItem.properties.id,
        },
        uploadState: fileItem.id === fileUID ? UploadStatusEnum.DONE : fileItem.uploadState,
      }));
      setFileList(updatedFileList);
      return updatedFileList;
    } else {
      const updatedFileList = _fileListTmp.map((fileItem) => ({
        ...fileItem,
        uploadState: fileItem.id === fileUID ? UploadStatusEnum.ERROR : fileItem.uploadState,
      }));
      setFileList(updatedFileList);
      return updatedFileList;
    }
  };

  const handleUpload = async () => {
    setShowPropertiesFormOfFileIndex(undefined);
    const files = fileList.filter((fileItem) => fileItem.uploadState === UploadStatusEnum.PENDING);
    setFileList([
      ...fileList.map((fileItem) => ({
        ...fileItem,
        uploadState:
          fileItem.uploadState === UploadStatusEnum.PENDING
            ? UploadStatusEnum.WAITING_FOR_UPLOAD
            : fileItem.uploadState,
      })),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 500));
    let _fileList = [...fileList];
    for (let i = 0; i < files.length; i++) {
      _fileList = [...(await uploadOneFile(files[i].id, _fileList))];
    }
  };

  const handleCancel = () => {
    setFileList([]);
    setUploadProgress([]);
    setShowPropertiesFormOfFileIndex(undefined);
    setAffairsOptions([]);
    setPhasesOptions([]);
    setIsOpen(false);
  };

  async function onFilesUploadChange(files: FileList) {
    const newFileList = Array.from(files);
    setFileList([
      ...fileList,
      ...newFileList.map((file) => ({
        id: Math.floor(Math.random() * 1000000000).toString(),
        file: file,
        properties: {
          filename_download: file.name,
          projects_id: project.id,
          affair_id: affair?.id,
          phase_id: phase?.id,
          document_type: GdpAssetDocumentEnum.WRITTEN,
          status: GdpFilesStatusEnum.VISIBLE,
          is_cover: false,
        },
        uploadState: UploadStatusEnum.PENDING,
      })),
    ]);
  }

  function getOnlyModifiedProperties(newFile: fileItemType, oldFile: fileItemType): Partial<GdpFilesModel> {
    const modifiedProperties: Partial<GdpFilesModel> = {};
    if (newFile.properties.affair_id !== oldFile.properties.affair_id)
      modifiedProperties.affair_id = newFile.properties.affair_id;
    if (newFile.properties.phase_id !== oldFile.properties.phase_id)
      modifiedProperties.phase_id = newFile.properties.phase_id;
    if (newFile.properties.is_cover !== oldFile.properties.is_cover)
      modifiedProperties.is_cover = newFile.properties.is_cover;
    if (newFile.properties.status !== oldFile.properties.status) modifiedProperties.status = newFile.properties.status;
    if (newFile.properties.document_type !== oldFile.properties.document_type)
      modifiedProperties.document_type = newFile.properties.document_type;
    if (newFile.properties.filename_download !== oldFile.properties.filename_download)
      modifiedProperties.filename_download = newFile.properties.filename_download;
    return modifiedProperties;
  }

  async function onFilePropertiesChange(modifiedFile: fileItemType, fileIndex: number) {
    if (modifiedFile.uploadState === UploadStatusEnum.DONE) {
      if (modifiedFile.properties.id) {
        const modifiedProperties: Partial<GdpFilesModel> = getOnlyModifiedProperties(modifiedFile, fileList[fileIndex]);

        await updateGdpFile(modifiedFile.properties.id, modifiedProperties);
      }
    }
    const newFileList = [...fileList];
    newFileList[fileIndex] = modifiedFile;
    setFileList(newFileList);
    setShowPropertiesFormOfFileIndex(undefined);
  }

  function displayProgressBar(fileUID: string) {
    const fileProgress = uploadProgress.find((fileProgress) => fileProgress.fileId === fileUID);
    if (!fileProgress) return <></>;
    return (
      <div className={styles.FileItemProgressBar}>
        <div className={styles.FileItemProgressBarFilled} style={{ width: `${fileProgress.percent}%` }} />
      </div>
    );
  }

  function isUploadButtonDisabled() {
    return fileList.filter((fileItem) => fileItem.uploadState === UploadStatusEnum.PENDING).length === 0;
  }

  return (
    <Modal
      title={mode === 'files' ? 'Ajouter des fichiers' : 'Ajouter des images'}
      open={isOpen}
      closable
      onCancel={() => setIsOpen(false)}
      footer={null}
      destroyOnClose
      width={1000}
    >
      <div className={styles.FormContainer}>
        <div className={styles.UploadFilesSide}>
          {fileList.length > 0 && (
            <div className={styles.FileListContainer}>
              {fileList.map((fileItem, index) => (
                <ShadowCard width="192px" height="192px">
                  <div key={index} className={styles.FileItem} onClick={() => setShowPropertiesFormOfFileIndex(index)}>
                    <Image src={'/file.svg'} alt={'file icon'} width={48} height={77} />
                    <div className={styles.FileItemName}>{fileItem.file.name}</div>
                    {fileItem.uploadState === UploadStatusEnum.UPLOADING && displayProgressBar(fileItem.id)}
                  </div>
                </ShadowCard>
              ))}
            </div>
          )}
          <FileInput multiple={true} onChange={onFilesUploadChange} />
          <div className={styles.UploadActionsButtons}>
            <Button style="primary" onClick={handleUpload} disabled={isUploadButtonDisabled()}>
              Envoyer les fichiers
            </Button>
            <Button style="text_gray" onClick={handleCancel}>
              Fermer
            </Button>
          </div>
        </div>
        {showPropertiesFormOfFileIndex !== undefined && (
          <FilePropertiesForm
            mode={mode}
            file={fileList[showPropertiesFormOfFileIndex]}
            onConfirm={(newFileProperties) => onFilePropertiesChange(newFileProperties, showPropertiesFormOfFileIndex)}
            onCancel={() => setShowPropertiesFormOfFileIndex(undefined)}
            project={project}
            affair={affair}
            affairsOptions={affairsOptions}
            phasesOptions={phasesOptions}
            phase={phase}
          />
        )}
      </div>
    </Modal>
  );
}
