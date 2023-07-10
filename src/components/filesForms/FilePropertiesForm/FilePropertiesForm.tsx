import { fileItemType, UploadStatusEnum } from '../UploadFilesForm/UploadFilesForm';
import { useEffect, useState } from 'react';
import styles from './FilePropertiesForm.module.scss';
import { Button, Input, Select } from '@projex/ui';
import { GdpAffairModel } from '../../../../models/GestionDeProjets/GdpAffairModel';
import { GdpPhaseModel } from '../../../../models/GestionDeProjets/GdpPhaseModel';
import { GdpProjectsModel } from '../../../../models/GestionDeProjets/GdpProjectsModel';
import { GdpFilesStatusEnum } from '../../../../models/GestionDeProjets/GdpFilesModel';
import { Switch } from 'antd';

type PropsTypes = {
  mode: 'files' | 'images';
  file: fileItemType;
  onConfirm: (value: fileItemType) => Promise<void>;
  onCancel?: () => void;
  project: Partial<GdpProjectsModel>;
  affair?: Partial<GdpAffairModel>;
  phase?: Partial<GdpPhaseModel>;
  affairsOptions: Partial<GdpAffairModel>[];
  phasesOptions: Partial<GdpPhaseModel>[];
};

export default function FilePropertiesForm({
  mode = 'files',
  file,
  onConfirm,
  onCancel,
  project,
  affair,
  phase,
  affairsOptions,
  phasesOptions,
}: PropsTypes) {
  const [FileTmp, setFileTmp] = useState<fileItemType>(file);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setFileTmp(file);
  }, [file]);

  function getFileSize(size: number | undefined): string {
    if (!size) return 'inconnue';
    const sizeInKo = size / 1000;
    if (sizeInKo < 1000) return `${sizeInKo} ko`;
    else return `${sizeInKo / 1000} Mo`;
  }

  /**
   * returns the file type to display.
   * @param name of the file with its extension
   */
  function getFileType(name: string) {
    const fileExtension = name.split('.').pop();
    if (!fileExtension) return 'inconnu';
    switch (fileExtension.toLowerCase()) {
      case 'pdf':
        return 'Document PDF';
      case 'doc':
      case 'docx':
        return 'Document Word';
      case 'xls':
      case 'xlsx':
        return 'Document Excel';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'Image';
      default:
        return 'inconnu';
    }
  }

  /**
   * returns the last modified date as "dd/mm/yyyy à hh/mm".
   * @param lastModified
   */
  function getLastModifiedDate(lastModified: Date) {
    const date = new Date(lastModified);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${day}/${month}/${year} à ${hours}h${minutes}`;
  }

  function getConfirmText(file: fileItemType) {
    switch (file.uploadState) {
      case UploadStatusEnum.UPLOADING:
        return 'Téléchargement en cours...';
      case UploadStatusEnum.DONE:
        return 'Modifier';
      case UploadStatusEnum.ERROR:
      case UploadStatusEnum.PENDING:
        return 'Confirmer';
    }
  }

  async function onConfirmButton() {
    setIsLoading(true);
    await onConfirm(FileTmp);
    setIsLoading(false);
  }

  if (!file) return <></>;
  return (
    <div className={styles.formContainer}>
      <h3>{FileTmp.properties.filename_download}</h3>
      <div className={styles.filesInformations}>
        <p>Taille: {getFileSize(FileTmp.file.size)}</p>
        <p>Type de fichier : {getFileType(FileTmp.file.name)}</p>
        <p>Modifié le : {getLastModifiedDate(FileTmp.file.lastModified as unknown as Date)}</p>
      </div>
      <div className={styles.filesInputsGroup}>
        <Input
          label="Renommer le fichier"
          value={FileTmp.properties.filename_download || ''}
          setValue={(value) =>
            setFileTmp({
              ...FileTmp,
              properties: { ...FileTmp.properties, filename_download: `${value}` },
            })
          }
          disabled={FileTmp.uploadState === UploadStatusEnum.PENDING}
        />
      </div>
      <div className={styles.filesInputsGroup}>
        <Input
          label="Associer à..."
          value={project.name || project.id || 'projet inconnu'}
          setValue={() => {}}
          disabled={true}
        />
        <Select
          displayNullOption={true}
          options={affairsOptions.map((affair) => ({ value: `${affair.id}`, text: affair.name as string }))}
          nullOptionText="Aucune Affaire"
          value={FileTmp.properties.affair_id != undefined ? `${FileTmp.properties.affair_id}` : ''}
          setValue={(value) =>
            setFileTmp({
              ...FileTmp,
              properties: { ...FileTmp.properties, affair_id: parseInt(value), phase_id: undefined },
            })
          }
          disabled={!!affair}
        />
        <Select
          displayNullOption={true}
          nullOptionText="Aucune Phase"
          options={phasesOptions
            .filter((phase) => phase.affairs_id != undefined && phase.affairs_id === FileTmp.properties.affair_id)
            .map((phase) => ({
              value: `${phase.id}`,
              text: phase.name as string,
            }))}
          value={FileTmp.properties.phase_id != undefined ? `${FileTmp.properties.phase_id}` : ''}
          setValue={(value) =>
            setFileTmp({
              ...FileTmp,
              properties: { ...FileTmp.properties, phase_id: parseInt(value) },
            })
          }
          disabled={!!phase}
        />
      </div>
      <div className={styles.filesIsPublishedContainer}>
        <Switch
          checked={FileTmp.properties.status == GdpFilesStatusEnum.VISIBLE}
          onChange={(value) => {
            setFileTmp({
              ...FileTmp,
              properties: {
                ...FileTmp.properties,
                status: value ? GdpFilesStatusEnum.VISIBLE : GdpFilesStatusEnum.HIDDEN,
              },
            });
          }}
        />
        <label>Publié</label>
      </div>
      <div className={styles.filesActionButtonsContainer}>
        <Button style="primary" onClick={onConfirmButton} disabled={isLoading}>
          {getConfirmText(FileTmp)}
        </Button>
        <Button style="text_gray" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
