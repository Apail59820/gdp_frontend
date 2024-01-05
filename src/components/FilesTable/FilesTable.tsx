import React, { useEffect, useState } from 'react';
import { GdpFilesModel } from '../../../models/GestionDeProjets/GdpFilesModel';
import { message, Modal, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import fileIcon from '../../../public/file.svg';
import folderIcon from '../../../public/folder.svg';
import infoIcon from '../../../public/circle-info.svg';
import downloadIcon from '../../../public/download.svg';
import deleteIcon from '../../../public/trash-can.svg';
import { DateTime, Interval } from 'luxon';
import styles from './FilesTable.module.scss';
import { Button } from 'projex-ui';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { useRouter } from 'next/router';
import { GdpPhaseModel } from '../../../models/GestionDeProjets/GdpPhaseModel';
import Link from 'next/link';
import { downloadGdPFile } from '../../../services/gestionDeProjets/GdpFiles';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../store/reducers/authReducer';
import getConfig from 'next/config';
import { selectAffairs } from '../../../store/reducers/affairsReducer';
import { selectProjects } from '../../../store/reducers/projectsReducer';

const { publicRuntimeConfig } = getConfig();

interface DataType extends Partial<GdpFilesModel> {
  key: React.Key;
  dataType: 'file' | 'project' | 'affair' | 'phase';
}

type props = {
  filesList: GdpFilesModel[];
};

const FilesTable = ({ filesList }: props) => {
  const router = useRouter();
  const { route } = router;

  const [data, setData] = useState<DataType[]>();

  const myUser = useSelector(selectUserProfile);

  const isClient = myUser && myUser.role === publicRuntimeConfig.ROLE_CLIENT_ID;

  // Mocked Data, les récupérer avec redux
  const affairs: Partial<GdpAffairModel>[] = useSelector(selectAffairs);
  const projects: Partial<GdpProjectsModel>[] = useSelector(selectProjects);

  enum displayType {
    'png' = 'Image PNG',
    'pdf' = 'Document PDF',
    'svg' = 'Image SVG',
    'jpg' = 'Image JPG',
    'zip' = 'Archive ZIP',
    'rar' = 'Archive RAR',
  }

  useEffect(() => {
    const tmp: DataType[] = [];
    filesList.map((file) => {
      tmp.push({ ...file, key: file.id, dataType: 'file' });
    });
    if (route.includes('phase')) {
      const phases: GdpPhaseModel[] = [];
      const affairId = router.query.affairId;
      const myAffair = affairs.find((affair) => affair.id.toString() == affairId);
      myAffair?.affairs_phases_ids?.forEach((affairPhase) => {
        if (typeof affairPhase !== 'number') phases.push(affairPhase);
      });
      phases.map((phase) => tmp.push({ key: phase.id, title: phase.name, dataType: 'phase', id: phase.id.toString() }));
    } else if (route.includes('affair')) {
      affairs.map((affair) =>
        tmp.push({ key: affair.id as number, title: affair.name, dataType: 'affair', id: affair.id?.toString() }),
      );
    } else if (route.includes('project')) {
      projects.map((project) =>
        tmp.push({ key: project.id as number, title: project.name, dataType: 'project', id: project.id?.toString() }),
      );
    }
    setData(tmp);
  }, []);

  const getImage = (data: DataType) => {
    if (data.dataType !== 'file') {
      return folderIcon;
    }
    // TODO Si le fichier est une image, retourner l'image en question
    return fileIcon;
  };

  function downloadFile(file: DataType) {
    if (file.id) {
      downloadGdPFile(file.id)
        .then((res) => {
          if (res.status === 200) {
            const w = window.open(res.data, '_blank');
            w && w.focus();
          } else {
            message.error('Une erreur est survenue.');
          }
        })
        .catch(() => {
          message.error('Une erreur est survenue.');
        });
    }
  }

  const showDeleteConfirm = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, file: DataType) => {
    Modal.confirm({
      title: `Êtes-vous sûr(e) de vouloir supprimer le fichier ${file?.filename_download} ?`,
      closable: true,
      maskClosable: true,
      footer: (
        <>
          <div className={styles.modalFooter}>
            <Button small onClick={() => Modal.destroyAll()}>
              Non
            </Button>
            <Button
              small
              style={'alert'}
              onClick={() => {
                Modal.destroyAll();
              }}
            >
              Oui, je veux supprimer ce fichier.
            </Button>
          </div>
        </>
      ),
    });
    e.stopPropagation();
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nom du fichier',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: DataType, b: DataType) => {
        if (!a.title || !b.title) return 0;
        if (a.title === b.title) return 0;
        return a.title > b.title ? 1 : -1;
      },

      render: (value, record) =>
        value ? (
          <Link
            className={styles.imageAndTitle}
            href={record.dataType !== 'file' ? `${route + '/' + record.dataType + '/' + record.id}` : ''}
          >
            <img src={getImage(record).src} alt="Logo" /> {value}
          </Link>
        ) : null,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a: DataType, b: DataType) => {
        if (!displayType[a.type as keyof typeof displayType] || !displayType[b.type as keyof typeof displayType])
          return 0;
        if (displayType[a.type as keyof typeof displayType] === displayType[b.type as keyof typeof displayType])
          return 0;
        return displayType[a.type as keyof typeof displayType] > displayType[b.type as keyof typeof displayType]
          ? 1
          : -1;
      },
      render: (value) => (value ? <span>{displayType[value as keyof typeof displayType] ?? 'Inconnu'}</span> : null),
    },
    {
      title: 'Date de mise en ligne',
      dataIndex: 'uploaded_on',
      key: 'uploaded_on',
      sorter: (a: DataType, b: DataType) => {
        if (!a.uploaded_on || !b.uploaded_on) return 0;
        return Interval.fromDateTimes(DateTime.fromISO(b.uploaded_on), DateTime.fromISO(a.uploaded_on)).length() > 0
          ? 1
          : -1;
      },

      render: (value) =>
        value ? <span>{DateTime.fromJSDate(value).setLocale('fr').toLocaleString(DateTime.DATE_FULL)}</span> : null,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (value, record) =>
        record.dataType == 'file' ? (
          <ul className={styles.list}>
            <li
              onClick={() => {
                downloadFile(record);
              }}
            >
              <Tooltip title={'Télécharger / Voir'}>
                <img src={downloadIcon.src} alt="Download icon" />
              </Tooltip>
            </li>
            <li>
              <Tooltip title={"Voir plus d'informations"}>
                <img src={infoIcon.src} alt="Info icon" />
              </Tooltip>
            </li>
            {!isClient && record.status === 'visible' && (
              <li onClick={(e) => showDeleteConfirm(e, record)}>
                <Tooltip title={'Supprimer'}>
                  <img src={deleteIcon.src} alt="Delete icon" />
                </Tooltip>
              </li>
            )}
          </ul>
        ) : null,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      locale={{
        triggerAsc: 'Trier de manière ascendante',
        triggerDesc: 'Trier de manière descendante',
        cancelSort: 'Ne pas trier',
      }}
    />
  );
};

export default FilesTable;
