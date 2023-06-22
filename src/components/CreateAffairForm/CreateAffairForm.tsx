import React from 'react';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { Form, Input, message, Modal, Select } from 'antd';
import { Button } from '@projex/ui';
import styles from './CreateAffairForm.module.scss';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../../store/reducers/companyEntitiesReducer';
import { UsCompanyEntityModel } from '../../../models/UserService/UsCompanyEntityModel';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import { createGdpAffair, updateGdpAffair } from '../../../services/gestionDeProjets/GdpAffairs';
import { messages } from '../../../constants/messages';
import { isRequestSuccessful } from '../../../utils/isRequestSuccessful';

type props = {
  project: Partial<GdpProjectsModel>;
  affair?: Partial<GdpAffairModel>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type formValues = {
  projectName: string;
  affairName: string;
  entity: number;
};

const CreateAffairForm = ({ project, affair, isOpen, setIsOpen }: props) => {
  const companyEntities: Partial<UsCompanyEntityModel>[] = useSelector(selectCompanyEntities);

  async function createAffair(values: formValues) {
    if (project.id) {
      const response = await createGdpAffair({
        name: values.affairName,
        company_entity: values.entity,
        projects_id: project.id,
        affairs_phases: [],
      });
      if (isRequestSuccessful(response.status) && response.data) {
        message.success(messages.general.success());
        setIsOpen(false);
      } else message.error(messages.general.error());
    } else {
      message.error('Aucun ID de projet renseigné.');
    }
  }

  async function updateAffair(affairId: number, values: formValues) {
    const response = await updateGdpAffair(affairId, { name: values.affairName, company_entity: values.entity });
    if (isRequestSuccessful(response.status) && response.data) {
      message.success(messages.general.success());
      setIsOpen(false);
    } else message.error(messages.general.error());
  }

  const onSubmit = (values: formValues) => {
    if (affair && affair.id) updateAffair(affair.id, values);
    else createAffair(values);
  };

  return (
    <Modal
      open={isOpen}
      closable
      onCancel={() => setIsOpen(false)}
      title={`${affair ? `Modifier l'affaire ${affair.name}` : `Créer une affaire pour le projet ${project.name}`}`}
      footer={null}
      destroyOnClose
    >
      <Form
        name={'createAffairForm'}
        autoComplete={'off'}
        layout={'vertical'}
        onFinish={onSubmit}
        initialValues={{
          projectName: project.name,
          affairName: affair?.name,
          entity: typeof affair?.company_entity !== 'number' ? affair?.company_entity?.id : affair?.company_entity,
        }}
      >
        <Form.Item label={'Nom du projet'} name={'projectName'} id={'projectName'}>
          <Input type={'text'} disabled />
        </Form.Item>
        <Form.Item
          label={"Nom de l'affaire"}
          name={'affairName'}
          id={'affairName'}
          rules={[
            {
              min: 1,
              max: 255,
              message: 'Veuillez entrer entre 1 et 255 caractères.',
            },
            {
              required: true,
              message: 'Veuillez entrer le nom de votre affaire.',
            },
          ]}
        >
          <Input type={'text'} placeholder={'Entrez le nom de votre affaire'} />
        </Form.Item>
        <Form.Item
          label={'Entité'}
          name={'entity'}
          id={'entity'}
          rules={[
            {
              required: true,
              message: 'Veuillez sélectionner une entité.',
            },
          ]}
        >
          <Select
            placeholder={"Sélectionnez l'entité liée à votre affaire"}
            options={companyEntities.map((entity: Partial<UsCompanyEntityModel>) => {
              return {
                label: entity.name?.toUpperCase(),
                value: entity.id,
              };
            })}
          />
        </Form.Item>
        <footer className={styles.footer}>
          <Button small htmlType={'submit'}>
            Créer l&apos;affaire
          </Button>
          <Button small style={'text'} onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
        </footer>
      </Form>
    </Modal>
  );
};

export default CreateAffairForm;
