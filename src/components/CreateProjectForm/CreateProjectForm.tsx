import React, {useEffect, useState} from 'react';
import { Empty, Form, Input, message, Modal, Select } from 'antd';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { UsCompanyEntityModel } from '../../../models/UserService/UsCompanyEntityModel';
import { Button } from 'projex-ui-dev';
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
import {sliceModelItem} from "../../../utils/array";


type CreateProjectFormProps = {
  project?: Partial<GdpProjectsModel>;
  setProject?: React.Dispatch<React.SetStateAction<Partial<GdpProjectsModel>>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface FormProps {
  projectName: string;
  clientEntity?: string;
  clientEntityNew?: string;
  entity: number;
}

export enum GdpCreateProjectFormEnum {
  CREATE = 'create',
  UPDATE = 'update',
}

const CreateProjectForm = ({ project, setProject, isOpen, setIsOpen }: CreateProjectFormProps) => {
  const [isNewClient, setIsNewClient] = useState(false);
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const companyEntities: Partial<UsCompanyEntityModel>[] = useSelector(selectCompanyEntities);
  const [clientsCompanyEntities, setClientsCompanyEntities] = useState<Partial<UsClientsCompanyEntitiesModel>[]>(
    useSelector(selectClientsCompanyEntities)
  );
  let timeout: ReturnType<typeof setTimeout> | null;

  const updateProject = async (project: Partial<GdpProjectsModel>, values: FormProps) => {
    return await updateGdpProject(project.id, {
      name: values.projectName,
      client_company_name: values.clientEntity ? values.clientEntity : values.clientEntityNew,
      company_entity: values.entity,
    }).then((res) => {
      if (isRequestSuccessful(res.status) && res.data) {
        message.success(messages.general.success('La modification du projet', true, false));
        dispatch(setProjects(sliceModelItem<GdpProjectsModel>(projects, project.id, {...project, ...res.data})));
        if(typeof setProject == 'function') {
          setProject(res.data);
        }
        setIsOpen(false);
      } else {
        message.error(messages.general.error());
      }
    });
  };

  const createProject = async (values: FormProps) => {
    return await createGdpProject({
      name: values.projectName,
      client_company_name: values.clientEntity ? values.clientEntity : values.clientEntityNew,
      company_entity: values.entity,
    }).then((res) => {
      if (isRequestSuccessful(res.status) && res.data) {
        message.success(messages.general.success('La création du projet', true, false));
        dispatch(setProjects([...projects, res.data]));
        setIsOpen(false);
      } else {
        message.error(messages.general.error());
      }
    });
  };
  const createNewClientEntity = async (clientEntityNew:string, values: FormProps, action?: GdpCreateProjectFormEnum)=> {
    return await getUsClientsCompanyEntities({
          filter: {
            name: {
              _starts_with: clientEntityNew
            }
          }
        }).then(clientEntity=> {
          if(isRequestSuccessful(clientEntity.status) && clientEntity.data.length > 0 || clientEntity.data.length === 0){
            const clientEntityList = clientEntity.data;
            const isClientEntityExist = clientEntityList.some((key) => key?.name === clientEntityNew);
            if(isClientEntityExist) {
              return message.error(`Le client ${clientEntityNew} existe déjà !`);
            }
            Modal.confirm({
              title: `Voulez-vous créer le client ${clientEntityNew} ?`,
              closable: true,
              maskClosable: true,
              footer: (
                  <>
                    <p>La création de ce client irréversible, souhaitez vous continuer ?</p>
                    <div className={styles.modalFooter} style={{display:'flex'}}>
                      <Button
                          small
                          style={'alert'}
                          onClick={ async () => {
                            await createUsClientCompanyEntityByName(clientEntityNew)
                                .then(async createdClientEntity=> {
                                  if(isRequestSuccessful(createdClientEntity.status) && createdClientEntity.data){
                                    message.success(`Votre nouveau client ${clientEntityNew} est enregistré !`);
                                    if(action === GdpCreateProjectFormEnum.UPDATE || !action) await updateProject(project, values);
                                    if(action === GdpCreateProjectFormEnum.CREATE) await createProject(values);
                                  } else {
                                    message.error(`Impossible d\'enregitrer le client ${clientEntityNew} !`);
                                  }
                                }).finally(()=> {
                                  Modal.destroyAll()
                                  setIsOpen(false);
                                });
                          }}
                      >
                        Créer le client {clientEntityNew}
                      </Button>
                      <Button small style={'text'} onClick={() => Modal.destroyAll()}>
                        Annuler
                      </Button>
                    </div>
                  </>
              ),
            });
          }
        });
  }
  const onFinish = async (values: FormProps) => {
    const valuesKeys = Object.keys(values);
    const isClientEntityNewExist = valuesKeys.some((key) => key === 'clientEntityNew');

    if (project && project.id) {
      if(isClientEntityNewExist && values.clientEntityNew) {
        await createNewClientEntity(values.clientEntityNew.toLowerCase(), values, GdpCreateProjectFormEnum.UPDATE);
      } else {
        await updateProject(project, values);
      }
    } else {
      if(isClientEntityNewExist && values.clientEntityNew) {
        await createNewClientEntity(values.clientEntityNew.toLowerCase(), values, GdpCreateProjectFormEnum.CREATE);
      } else {
        await createProject(values);
      }
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
          clientEntity: project?.client_company_name?.toUpperCase(),
          clientEntityNew: '',
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
        { isNewClient ? (
          <Form.Item
              label={
                <div style={{display:"flex", alignItems:"center"}}>
                  Nom du client
                  <Button small
                          onClick={()=>setIsNewClient(!isNewClient)}
                          style={"text"}
                  >
                    {isNewClient?'Client existant ?':'Il s\'agit d\'un nouveau client ?'}
                  </Button>
                </div>
              }
              name={'clientEntityNew'}
              id={'clientEntityNew'}
              rules={[
                {
                  required: true,
                  message: 'Veuillez selectionner une société cliente.',
                },
              ]}
          >
            <Input type={'text'} placeholder={'Entrez le nom du client'} />
          </Form.Item>
        ) : (
          <Form.Item
              label={
                <div style={{display:"flex", alignItems:"center"}}>
                  Nom du client
                  <Button small
                          onClick={()=>setIsNewClient(!isNewClient)}
                          style={"text"}
                  >
                    {isNewClient?'Client existant':'Il s\'agit d\'un nouveau client ?'}
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
          </Form.Item>
          )
        }
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
