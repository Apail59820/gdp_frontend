import React, { useState } from 'react';
import { Empty, Form, Input, message, Modal, Select } from 'antd';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { UsCompanyEntityModel } from '../../../models/UserService/UsCompanyEntityModel';
import { Button } from 'projex-ui';
import { selectCompanyEntities } from '../../../store/reducers/companyEntitiesReducer';
import { useDispatch, useSelector } from 'react-redux';
import { selectClientsCompanyEntities } from '../../../store/reducers/clientsCompanyEntitiesReducer';
import { UsClientsCompanyEntitiesModel } from '../../../models/UserService/UsClientsCompanyEntitiesModel';
import styles from './CreateProjectForm.module.scss';
import { createGdpProject, updateGdpProject } from '../../../services/gestionDeProjets/GdpProjects';
import { messages } from '../../../constants/messages';
import { QueryParameters } from '../../../models/DirectusModel';
import {
  createUsClientCompanyEntityByName,
  getUsClientsCompanyEntities
} from '../../../services/userService/UsClientsCompanyEntities';
import { selectProjects, setProjects } from '../../../store/reducers/projectsReducer';
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";

type CreateProjectFormProps = {
  project?: Partial<GdpProjectsModel>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface FormProps {
  projectName: string;
  clientEntity: string;
  entity: number;
}

const CreateProjectForm = ({ project, isOpen, setIsOpen }: CreateProjectFormProps) => {
  const [isNewClient, setIsNewClient] = useState(false);
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const companyEntities: Partial<UsCompanyEntityModel>[] = useSelector(selectCompanyEntities);
  const [clientsCompanyEntities, setClientsCompanyEntities] = useState<Partial<UsClientsCompanyEntitiesModel>[]>(
    useSelector(selectClientsCompanyEntities)
  );

  let timeout: ReturnType<typeof setTimeout> | null;

  const newClientHandler = (clientName:string)=>{
    getUsClientsCompanyEntities({filter:{name:clientName}})
        .then(getEntity=>{
          if(isRequestSuccessful(getEntity.status)){
            if(getEntity?.data.length==0){
              createUsClientCompanyEntityByName(clientName)
                  .then(resCreate=>{
                    if(isRequestSuccessful(resCreate.status)){
                      message.success('Votre nouveau client est enregistré');
                    }
                  })
            }
          }
        })
  }
  const onFinish = async (values: FormProps) => {
    await newClientHandler(values.clientEntity);
    if (project && project.id) {
      updateGdpProject(project.id, {
        name: values.projectName,
        client_company_name: values.clientEntity,
        company_entity: values.entity,
      }).then((res) => {
        if (res.status === 200) {
          message.success(messages.general.success('La modification du projet', true, false));
        } else {
          message.error(messages.general.error());
        }
      });
    } else {
      const client_company = clientsCompanyEntities.find((entity) => entity.name === values.clientEntity);
      createGdpProject({
        name: values.projectName,
        client_company_name: values.clientEntity,
        company_entity: values.entity,
      }).then((res) => {
        if (res.status === 200 && res.data) {
          message.success(messages.general.success('La création du projet', true, false));
          dispatch(setProjects([...projects, res.data]));
          setIsOpen(false);
        } else {
          message.error(messages.general.error());
        }
      });
    }
  };

  const fetchData = async (
    getter: (queryParameters: QueryParameters) => any,
    queryParams: QueryParameters,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const getData = () => {
      getter(queryParams).then((res: { status: number; data: any }) => {
        if (res.status === 200 && res.data) {
          setter(res.data);
        }
      });
    };

    timeout = setTimeout(getData, 300);
  };

  return (
    <Modal
      open={isOpen}
      closable
      onCancel={() => setIsOpen(false)}
      title={`${project ? `Modifier le projet ${project.name}` : 'Créer un projet'}`}
      footer={null}
      destroyOnClose
    >
      <Form
        name={'createProjectForm'}
        autoComplete={'off'}
        layout={'vertical'}
        onFinish={onFinish}
        initialValues={{
          projectName: project?.name,
          clientEntity: project?.client_company_name,
          entity: project?.company_entity,
        }}
      >
        <Form.Item
          label={'Nom du projet'}
          name={'projectName'}
          id={'projectName'}
          rules={[
            {
              min: 1,
              max: 255,
              message: 'Veuillez entrer entre 1 et 255 caractères.',
            },
            { required: true, message: 'Veuillez entrer un nom de projet.' },
          ]}
        >
          <Input type={'text'} placeholder={'Entrez le nom du projet'} />
        </Form.Item>
        <Form.Item
            label={
                    <div style={{display:"flex", alignItems:"center"}}>
                        Nom du client
                        <Button small
                                onClick={()=>setIsNewClient(!isNewClient)}
                                style={"text"}
                        >
                          {isNewClient?'Ancien client':'Nouveau client ?'}
                        </Button>
                    </div>
            }
            name={'clientEntity'}
            id={'clientEntity'}
            rules={[
              {
                required: true,
                message: 'Veuillez selectionner une société cliente.',
              },
            ]}
        >
          {isNewClient?(
              <Input className={styles.inputNewClient}
                     placeholder={'Entrez le client de votre projet'} />
          ):(
              <Select
                  showSearch
                  filterOption={false}
                  placeholder={'Sélectionnez le client de votre projet'}
                  options={clientsCompanyEntities.map((entity: Partial<UsClientsCompanyEntitiesModel>) => {
                    return {
                      label: entity.name?.toUpperCase(),
                      value: entity.name,
                    };
                  })}
                  onSearch={(value) => {
                    if (value.length > 2) {
                      fetchData(
                          getUsClientsCompanyEntities,
                          {
                            filter: {
                              name: {
                                _starts_with: value,
                              },
                            },
                          },
                          setClientsCompanyEntities
                      );
                    }
                  }}
                  notFoundContent={
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Aucune société cliente trouvée.'} />
                  }
              />
          )}
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
            placeholder={"Sélectionnez l'entité liée à votre projet"}
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
            {project ? 'Modifier' : 'Créer'} le projet
          </Button>
          <Button small style={'text'} onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
        </footer>
      </Form>
    </Modal>
  );
};

export default CreateProjectForm;
