import React, {useEffect, useState} from 'react';
import {Empty, Form, message, Modal, Popconfirm, Select} from 'antd';
import {GdpAffairModel} from '../../../models/GestionDeProjets/GdpAffairModel';
import {useSelector} from 'react-redux';
import {GdpProjectsModel} from '../../../models/GestionDeProjets/GdpProjectsModel';
import {Button} from 'projex-ui-dev';
import {selectUsers} from '../../../store/reducers/usersReducer';
import getConfig from 'next/config';
import {CheckCircleTwoTone, MinusCircleOutlined} from '@ant-design/icons';
import styles from './ManageAffairUsersForm.module.scss';
import {UsUserModel} from '../../../models/UserService/UsUserModel';
import {getUsUsers} from '../../../services/userService/UsUsers';
import {getGdpProjectById} from '../../../services/gestionDeProjets/GdpProjects';
import {
  createGdpAffairUsers,
  deleteGdpAffairUsers,
  getGdpAffairsUsers,
} from '../../../services/gestionDeProjets/GdpAffairsUsers';
import {GdpAffairsUsersModel} from '../../../models/GestionDeProjets/GdpAffairsUsersModel';
import {
  createGdpProjectUsersClients,
  deleteProjectsUsersClient,
} from '../../../services/gestionDeProjets/GdpProjectsUsersClients';
import CreateClientEntity from "../CreateClientEntity/CreateClientEntity";
import EditClientEntity from "../EditClientEntity/EditClientEntity";
import {getUsClientsCompanyEntitiesUsers} from "../../../services/userService/UsClientsCompanyEntitiesUsers";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {capitalize} from "../../../utils/capitalize";
import {getFullName} from "../../../utils/fullName";
import {AddClientEntity} from "../AddClientEntity/AddClientEntity";
import {getUsClientsCompanyEntities} from "../../../services/userService/UsClientsCompanyEntities";
import CreateClient from "../CreateClient/CreateClient";
import {GdpProjectsClientsModel} from "../../../models/GestionDeProjets/GdpProjectsClientsModel";

const {publicRuntimeConfig} = getConfig();

type ManageAffairUsersProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affair: Partial<GdpAffairModel>;
  userType: 'collaborator' | 'client';
};

enum UserRoles {
  'collaborator' = 'ROLE_COLLABORATOR_ID',
  'client' = 'ROLE_CLIENT_ID',
}

const ManageAffairUsersForm = ({isOpen, setIsOpen, affair, userType}: ManageAffairUsersProps) => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState<Partial<GdpProjectsModel>[]>([]);
  const [affairs, setAffairs] = useState<Partial<GdpAffairModel>[]>([]);
  const [users, setUsers] = useState<Partial<UsUserModel>[]>(
    useSelector(selectUsers).filter(
      (user) => user.role === publicRuntimeConfig[UserRoles[userType as keyof typeof UserRoles]]
    )
  );
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>();
  const [clientName, setClientName] = useState<string>();
  const [affairUsers, setAffairUsers] = useState<Partial<UsUserModel>[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Partial<string | undefined>[]>([]);
  const [affairDirectusUsersId, setAffairDirectusUsersId] = useState<string[]>([]);

  const [displayButton, setDisplayButton] = useState<Map<number, any>>(new Map());

  const [newEntity, setNewEntity] = useState<{user: string, entityName: string} | null>(null);
  const [selectedClientKey, setSelectedClientKey] = useState<number | undefined>(undefined);

  const [newClient, setNewClient] = useState<boolean>(false)
  let timeout: ReturnType<typeof setTimeout> | null;

  useEffect(() => {
    if (selectedClientKey !== undefined && newEntity) {
        const currDisplayBtn = displayButton.get(selectedClientKey);
        currDisplayBtn.button = (
            <Button small style={"text"} onClick={() => changeClientEntity(newEntity.user, 'modify', selectedClientKey)}>
              {newEntity.entityName}
            </Button>
        );

        displayButton.set(selectedClientKey, currDisplayBtn);
        setDisplayButton(new Map(displayButton));
        setNewEntity(null);
      }
  }, [newEntity, selectedClientKey]);


  useEffect(() => {
    const tmpAffairDirectusUsersId: string[] = [];
    if (affair.affairs_directus_users_ids && affair.affairs_directus_users_ids.length > 0) {
      if (userType === 'collaborator') {
        affair.affairs_directus_users_ids.forEach((relation) => {
          if (typeof relation !== 'number') {
            if (typeof relation.directus_users_id !== 'string') {
              relation.directus_users_id.id && tmpAffairDirectusUsersId.push(relation.directus_users_id.id);
            } else {
              tmpAffairDirectusUsersId.push(relation.directus_users_id);
            }
          } else {
            getGdpAffairsUsers({filter: {id: {_eq: relation}}}).then((res) => {
              if (res.status === 200 && res.data) {
                res.data.forEach((relation) => {
                  const {directus_users_id} = relation;
                  if (!directus_users_id) return;
                  if (typeof directus_users_id !== 'string') {
                    directus_users_id.id && tmpAffairDirectusUsersId.push(directus_users_id.id);
                  } else {
                    tmpAffairDirectusUsersId.push(directus_users_id);
                  }
                });
                setAffairDirectusUsersId(tmpAffairDirectusUsersId);
              }
            });
          }
        });
      } else {
        if (
          typeof affair.projects_id !== 'number' &&
          affair.projects_id &&
          affair.projects_id.projects_directus_users_clients_ids &&
          affair.projects_id.projects_directus_users_clients_ids.length > 0
        ) {
          affair.projects_id?.projects_directus_users_clients_ids.forEach((relation) => {
            if (typeof relation !== 'number') {
              if (typeof relation.directus_users_id !== 'string') {
                relation.directus_users_id.id && tmpAffairDirectusUsersId.push(relation.directus_users_id.id);
              } else {
                tmpAffairDirectusUsersId.push(relation.directus_users_id);
              }
            } else {
              getGdpAffairsUsers({filter: {id: {_eq: relation}}}).then((res) => {
                if (res.status === 200 && res.data) {
                  res.data.forEach((relation) => {
                    const {directus_users_id} = relation;
                    if (!directus_users_id) return;
                    if (typeof directus_users_id !== 'string') {
                      directus_users_id.id && tmpAffairDirectusUsersId.push(directus_users_id.id);
                    } else {
                      tmpAffairDirectusUsersId.push(directus_users_id);
                    }
                  });
                  setAffairDirectusUsersId(tmpAffairDirectusUsersId);
                }
              });
            }
          });
        } else if (affair.projects_id && typeof affair.projects_id === 'number') {
          getGdpProjectById(affair.projects_id).then((res) => {
            if (res.status === 200 && res.data && res.data.projects_directus_users_clients_ids) {
              res.data.projects_directus_users_clients_ids.forEach((relation) => {
                if (typeof relation !== 'number') {
                  if (typeof relation.directus_users_id !== 'string') {
                    relation.directus_users_id.id && tmpAffairDirectusUsersId.push(relation.directus_users_id.id);
                  } else {
                    tmpAffairDirectusUsersId.push(relation.directus_users_id);
                  }
                } else {
                  getGdpAffairsUsers({filter: {id: {_eq: relation}}}).then((res) => {
                    if (res.status === 200 && res.data) {
                      const {directus_users_id} = res.data[0];
                      if (!directus_users_id) return;
                      if (typeof directus_users_id !== 'string') {
                        directus_users_id.id && tmpAffairDirectusUsersId.push(directus_users_id.id);
                      } else {
                        tmpAffairDirectusUsersId.push(directus_users_id);
                      }
                      setAffairDirectusUsersId(tmpAffairDirectusUsersId);
                    }
                  });
                }
              });
            }
          });
        }
      }
    }
  }, [affair.affairs_directus_users_ids, affair.projects_id, userType]);


  const setMap = async(key, display, name?:number)=>{
    const clientId = form.getFieldValue('users')[name]?.user;
    let text: string = null;
    await getUsClientsCompanyEntitiesUsers({filter: {directus_users_id : clientId, is_current_job: true}, fields:'clients_company_entities_id'})
        .then(async (clientEntityRelationResponse) => {
          if(isRequestSuccessful(clientEntityRelationResponse.status)){
            if(clientEntityRelationResponse?.data.length == 1){
              let clientEntityData = clientEntityRelationResponse.data;
              await getUsClientsCompanyEntities({filter: {id: clientEntityData[0].clients_company_entities_id}}).then((entityRes) => {
                if(isRequestSuccessful(entityRes.status) && entityRes?.data.length == 1){
                  text = entityRes.data[0].name;
                }
              })
            }
          }
        })
        .finally(()=>{
          let value = {
            display: display,
            button: null //text? text: null
          }
          if(text){
            value.button = <Button small style={"text"} onClick={()=>changeClientEntity(clientId, 'modify', key)}>{text}</Button>
          } else {
            value.button =
                <Popconfirm title={"Voulez-vous créer une entité ou sélectionner une entité existante ?"}
                            okText={'Créer'} onConfirm={()=>changeClientEntity(clientId, 'create', key)}
                            cancelText={'Sélectionner'} onCancel={()=>changeClientEntity(clientId, 'add', key)}
                >
                  <Button small style={"text"}>Entité</Button>
                </Popconfirm>
          }

          displayButton.set(key, value)

          setDisplayButton(displayButton)
        })
  }
  const openModal= new Map<string, React.Dispatch<React.SetStateAction<boolean>>>();
  openModal.set('add', setIsAddOpen);  openModal.set('modify', setIsModifyOpen);  openModal.set('create', setIsCreateOpen)
  const changeClientEntity = async (clientId: string, modalType: string, key: number) => {
    let resUsName= await getUsUsers({filter:{id:clientId}});
    let usName:string = null;

    if(isRequestSuccessful(resUsName.status)){
       usName = getFullName(resUsName?.data[0])
       setClientName(usName)
    }

    setSelectedClientKey(key);

    openModal.get(modalType)(true);
  }

  useEffect(() => {
    setSelectedUsers(affairUsers.map((user) => user.id));
  }, [affairUsers]);

  useEffect(() => {
    if (affairs.filter((affair) => affair.id === affair.id).length === 0) {
      setAffairs([...affairs, affair]);
    }
  }, [affair, affairs]);

  useEffect(() => {
    const fetchProject = async (id: number) => {
      return await getGdpProjectById(id);
    };
    if (affair.projects_id !== undefined && typeof affair.projects_id !== 'number' && affair.projects_id.id) {
      const id = affair.projects_id.id;
      const tmp = projects.filter((project) => project.id === id);
      if (tmp.length === 0) {
        setProjects([...projects, affair.projects_id]);
      }
    } else {
      if (affair.projects_id !== undefined && typeof affair.projects_id === 'number') {
        const tmp = projects.filter((project) => project.id === affair.projects_id);
        if (tmp.length === 0) {
          fetchProject(affair.projects_id).then((res) => {
            if (res.status == 200 && res.data) {
              setProjects([...projects, res.data]);
            }
          });
        }
      }
    }
  }, [affair.projects_id, projects]);

  useEffect(() => {
    if (affairDirectusUsersId.length > 0) {
      getUsUsers({filter: {id: {_in: affairDirectusUsersId}}}).then((res) => {
        if (res.status === 200 && res.data) {
          setAffairUsers(res.data);
          const diff = res.data?.filter(({id: id1}) => !users.some(({id: id2}) => id2 === id1));
          setUsers([...users, ...diff]);
        } else {
          console.error('Unable to fetch affair users.');
        }
      });
      setAffairDirectusUsersId([]);
    }
  }, [affairDirectusUsersId, users]);
  const onFinish = async(values: any) => {
    const valuesToDelete = affairUsers.filter((user) => {
      return !values.users.find((value: any) => value.user === user.id);
    });
    const valuesToAdd = values.users.filter((value: any) => {
      if (value.user !== undefined) {
        return !affairUsers.find((user) => user.id === value.user);
      }
    });
    const initialRelation: any[] = [];
    const relationToRemove: number[] = [];
    const remainingRelations: GdpAffairsUsersModel[] = [];
    // Modification des collaborateurs
    if (userType === 'collaborator') {
      affair.affairs_directus_users_ids?.forEach((relation) => {
        if (typeof relation !== 'number') {
          initialRelation.push(relation);
          if (typeof relation.directus_users_id !== 'string') {
            const rduId = relation.directus_users_id;
            if (valuesToDelete.some((manager) => manager.id === rduId.id)) {
              relationToRemove.push(relation.id);
            }
          } else {
            if (valuesToDelete.some((manager) => manager.id === relation.directus_users_id)) {
              relationToRemove.push(relation.id);
            }
          }
        }
      });
      initialRelation.forEach((relation) => {
        if (!relationToRemove.some((id) => id === relation.id)) {
          remainingRelations.push(relation);
        }
      });
      if (valuesToDelete.length > 0 && remainingRelations.filter((relation) => relation.project_manager).length > 0) {
        // Suppression des collaborateurs
        await deleteGdpAffairUsers(relationToRemove);
      }
      if (valuesToAdd.length > 0) {
        // Ajout des collaborateurs
        createGdpAffairUsers(
          valuesToAdd.map((value: any) => ({affairs_id: affair.id, directus_users_id: value.user}))
        ).then((res) => {
          if (res.status === 200) {
            message.success(`Les modifications ont bien été prises en compte.`);
          } else {
            message.error(`Une erreur est survenue.`);
          }
        });
      }
    }
    // Modification des clients
    else if (userType === 'client') {
      if (typeof affair.projects_id !== 'number') {
        affair.projects_id?.projects_directus_users_clients_ids.forEach((relation) => {
          if (typeof relation !== 'number') {
            initialRelation.push(relation.id);
            if (typeof relation.directus_users_id !== 'string') {
              const rduId = relation.directus_users_id;
              if (valuesToDelete.some((manager) => manager.id === rduId.id)) {
                relationToRemove.push(relation.id);
              }
            } else {
              if (valuesToDelete.some((manager) => manager.id === relation.directus_users_id)) {
                relationToRemove.push(relation.id);
              }
            }
          }
        });
      }
      if (valuesToDelete.length > 0) {
        // Suppression des clients
        await deleteProjectsUsersClient(relationToRemove);
      }
      if (valuesToAdd.length > 0) {
        // Ajout des clients
        await createGdpProjectUsersClients(
          valuesToAdd.map((value: any) => ({
            projects_id: typeof affair.projects_id !== 'number' ? affair.projects_id?.id : affair.projects_id,
            directus_users_id: value.user,
            affairs_id: affair.id
          }))
        ).then((res) => {
          if (res.status === 200) {
            message.success(`Les modifications ont bien été prises en compte.`);
          } else {
            message.error(`Une erreur est survenue.`);
          }
        });
      }
    }

    setIsOpen(false);
  };

  return (
    <Modal
      title={`Gérer l'équipe`}
      open={isOpen}
      closable
      onCancel={() => setIsOpen(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        name={'manageAffairUser'}
        autoComplete={'off'}
        layout={'vertical'}
        form={form}
        onFinish={onFinish}
        initialValues={{
          project: typeof affair.projects_id !== 'number' ? affair.projects_id?.id : affair.projects_id,
          affair: affair.id,
        }}
      >
        <Form.Item label={'Projet'} name={'project'} id={'project'}>
          <Select
            disabled
            options={projects.map((project) => ({
              label: project.name,
              value: project.id,
            }))}
          />
        </Form.Item>
        <Form.Item label={'Affaire'} name={'affair'} id={'affair'}>
          <Select
            disabled
            options={affairs.map((affair) => ({
              label: affair.name,
              value: affair.id,
            }))}
          />
        </Form.Item>
        <Form.List name={'users'} initialValue={affairUsers.map((user) => ({user: user.id}))}>
          {(fields, {add, remove}) => (
              <>
                <p className={styles.customLabel}>{(userType == 'collaborator') ? 'collaborateur' : 'client'}</p>
                {fields.map(({key, name, ...restFields}) => (
                    <>
                      <div className={styles.entityButton}>{displayButton.get(key)?.display && displayButton.get(key).button}</div>
                      <div key={key} className={styles.formListItems}>
                        <Form.Item className={styles.formItem} {...restFields} name={[name, 'user']}>
                          <Select
                              size={'large'}
                              showSearch
                              allowClear
                              menuItemSelectedIcon={<CheckCircleTwoTone rev={undefined} twoToneColor={'#3FB1C9'}/>}
                              filterOption={false}
                              placeholder={'Sélectionnez un ' + (userType == 'collaborator') ? 'collaborateur' : 'client'}
                              options={users.map((user) => ({
                                label: getFullName(user),
                                value: user.id,
                                disabled: selectedUsers
                                    .filter((user) => users.map((user) => user.id).includes(user))
                                    .some((id) => id === user.id),
                              }))}
                              onSearch={(value) => {
                                if (value.length > 2) {
                                  let roleToSeek = (userType == 'collaborator') ? publicRuntimeConfig.ROLE_COLLABORATOR_ID : publicRuntimeConfig.ROLE_CLIENT_ID;
                                  getUsUsers({
                                    filter: {
                                      _and:[
                                        {_or: [{first_name: {_starts_with: value}}, {last_name: {_starts_with: value}}, {email: {_starts_with: value}}]},
                                        {role: roleToSeek}
                                      ],
                                    },
                                  }).then((res) => {
                                    if (isRequestSuccessful(res.status) && res.data.length) {
                                      const existingUserIds = new Set(users.map(user => user.id));
                                      const newSearchResults = res.data.filter(searchResult => !existingUserIds.has(searchResult.id));
                                      setUsers([...users, ...newSearchResults]);
                                    }
                                  }).catch((err) => console.error(err))
                                }
                              }}
                              onChange={async (value) => {
                                if (value) {
                                  setCurrentUser(value);
                                  const user = users.filter(user=>user.id===currentUser)[0]
                                  if(user) {
                                    const userName = capitalize(user.first_name) +' '+ capitalize(user.last_name);
                                    setClientName(userName);
                                  }

                                  await setMap(key, true, name)
                                  const tmp = form.getFieldValue('users');
                                  setSelectedUsers(tmp.map((user: any) => user));
                                }
                              }}
                              notFoundContent={
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Aucun utilisateur trouvé'}/>
                              }
                          />
                        </Form.Item>

                        <MinusCircleOutlined
                            rev={undefined} style={{color:'#B7011A'}}
                            onClick={() => {
                              const tmp = [...selectedUsers];
                              if (form.getFieldValue('users')[name]) {
                                const index = tmp.indexOf(form.getFieldValue('users')[name]);
                                tmp.splice(index, 1);
                                setSelectedUsers(tmp);
                              }
                              remove(name);
                              setMap(key, false)
                            }}
                        />
                      </div>
                    </>
                ))}
                <Form.Item>
                  <div style={{display:'flex'}}>
                    <Button small onClick={() => add()} style={'text'}>
                      Ajouter un {(userType == 'collaborator') ? 'collaborateur' : 'client'}
                    </Button>
                    <Button small style={"text"} onClick={()=>setIsCreateClientOpen(true)}>
                      Créer un client
                    </Button>
                  </div>
                </Form.Item>
              </>
          )}
        </Form.List>
        <footer className={styles.footer}>
          <Button small htmlType={'submit'}>
            Enregistrer
          </Button>
          <Button small style={'text'} onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
        </footer>
      </Form>
      <CreateClientEntity isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} setNewEntity={setNewEntity} client={currentUser}/>
      <EditClientEntity isModifyOpen={isModifyOpen} setIsModifyOpen={setIsModifyOpen} clientName={clientName} setNewEntity={setNewEntity} clientId={currentUser}/>
      <AddClientEntity isAddOpen={isAddOpen} setIsAddOpen={setIsAddOpen} clientName={clientName} setNewEntity={setNewEntity} clientId={currentUser} />
      <CreateClient  isOpen={isCreateClientOpen} setIsOpen={setIsCreateClientOpen} />
    </Modal>
  );
};

export default ManageAffairUsersForm;
