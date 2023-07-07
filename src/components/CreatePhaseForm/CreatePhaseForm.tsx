import { Form, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import { GdpPhaseModel, GdpPhaseStatusEnum } from '../../../models/GestionDeProjets/GdpPhaseModel';
import { Button } from '@projex/ui';
import styles from './CreatePhaseForm.module.scss';
import {
  createGdpAffairPhase,
  deleteAffairsPhases,
  updateGdpAffairPhase,
} from '../../../services/gestionDeProjets/GdpPhases';
import { messages } from '../../../constants/messages';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { isRequestSuccessful } from '../../../utils/isRequestSuccessful';

type props = {
  project: Partial<GdpProjectsModel>;
  affair: Partial<GdpAffairModel>;
  isOpen: boolean;
  phase?: Partial<GdpPhaseModel>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type formValues = {
  projectName: string;
  affairName: string;
  name: string;
  status: GdpPhaseStatusEnum;
  description: string;
};

enum displayStatus {
  'ongoing' = 'En cours',
  'pending' = 'En attente',
  'completed' = 'Terminée',
}

const CreatePhaseForm = ({ project, affair, isOpen, phase, setIsOpen }: props) => {
  const statusOptions: GdpPhaseStatusEnum[] = Object.values(GdpPhaseStatusEnum);

  const showConfirmDelete = () => {
    if (phase) {
      Modal.confirm({
        title: "Supprimer l'étape",
        content: `Êtes-vous sûr de vouloir supprimer l'étape ${phase?.name} ?`,
        okText: 'Oui',
        cancelText: 'Non',
        okType: 'danger',
        icon: <WarningOutlined />,
        closable: true,
        maskClosable: true,
        footer: [
          <footer className={`${styles.footer} ${styles.confirmDelete}`}>
            <Button
              small
              style={'alert'}
              onClick={() => {
                deleteAffairsPhases([phase.id]).then((res) => {
                  if (res && !isRequestSuccessful(res.status)) {
                    message.error(messages.general.error());
                  } else {
                    message.success(messages.general.success());
                    setIsOpen(false);
                    Modal.destroyAll();
                  }
                });
              }}
            >
              Confirmer
            </Button>
            <Button small style={'secondary'} onClick={() => Modal.destroyAll()}>
              Annuler
            </Button>
          </footer>,
        ],
      });
    }
  };

  async function createAffairPhase(values: formValues) {
    const response = await createGdpAffairPhase({
      affairs_id: affair.id,
      name: values.name,
      status: values.status,
      description: values.description,
      order: affair.affairs_phases.length + 1,
    });
    if (isRequestSuccessful(response.status) && response.data) {
      message.success(messages.general.success());
      setIsOpen(false);
    } else message.error(messages.general.error());
  }

  async function updateAffairPhase(phaseId: number, values: formValues) {
    const response = await updateGdpAffairPhase(phaseId, {
      name: values.name,
      status: values.status,
      description: values.description,
    });
    if (isRequestSuccessful(response.status) && response.data) {
      message.success(messages.general.success());
      setIsOpen(false);
    } else message.error(messages.general.error());
  }

  const onSubmit = (values: formValues) => {
    if (phase) {
      console.warn('br phase');
      updateAffairPhase(phase.id, values);
    } else {
      console.warn('br affair');
      createAffairPhase(values);
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        closable
        onCancel={() => setIsOpen(false)}
        title={`${phase ? `Modiifer l'étape ${phase.name}` : `Créer une étape pour l'affaire ${affair.name}`}`}
        footer={null}
        destroyOnClose
      >
        <Form
          name={'createPhaseForm'}
          autoComplete={'off'}
          layout={'vertical'}
          onFinish={onSubmit}
          initialValues={{
            projectName: project.name,
            affairName: affair.name,
            name: phase?.name,
            status: phase?.status,
            description: phase?.description,
          }}
        >
          <Form.Item label={'Nom du projet'} name={'projectName'} id={'projectName'}>
            <Input disabled />
          </Form.Item>
          <Form.Item label={"Nom de l'affaire"} name={'affairName'} id={'affairName'}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Nom de l'étape"}
            name={'name'}
            id={'name'}
            rules={[
              {
                min: 1,
                max: 255,
                message: 'Veuillez entrer entre 1 et 255 caractères.',
              },
              {
                required: true,
                message: 'Veuillez entrer le nom de votre étape.',
              },
            ]}
          >
            <Input type={'text'} placeholder={'Entrez le nom de votre étape'} />
          </Form.Item>
          <Form.Item
            label={"État d'avancement"}
            name={'status'}
            id={'status'}
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner l'état de votre étape.",
              },
            ]}
          >
            <Select
              placeholder={"Selectionnez l'état de votre phase"}
              options={statusOptions.map((option: GdpPhaseStatusEnum) => {
                return { label: displayStatus[option], value: option };
              })}
            />
          </Form.Item>
          <Form.Item
            label={'Description'}
            name={'description'}
            id={'description'}
            rules={[
              {
                required: true,
                message: 'Veuillez entrer la description de votre étape.',
              },
            ]}
          >
            <Input.TextArea placeholder={'Entrez la description de votre étape'} />
          </Form.Item>
          <footer className={styles.footer}>
            <Button small htmlType={'submit'}>
              {phase ? `Modifier l'étape` : `Créer l'étape`}
            </Button>
            <Button small style={'text'} onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            {phase && (
              <span className={styles.span}>
                <Button
                  small
                  style={'alert'}
                  onClick={() => {
                    showConfirmDelete();
                  }}
                  icon={<DeleteOutlined />}
                >
                  Supprimer l&apos;étape
                </Button>
              </span>
            )}
          </footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreatePhaseForm;
