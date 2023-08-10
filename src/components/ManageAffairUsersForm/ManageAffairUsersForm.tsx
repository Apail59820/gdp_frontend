import React, { useEffect, useState } from 'react';
import { Empty, Form, message, Modal, Select } from 'antd';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import { useSelector } from 'react-redux';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { Button } from '@projex/ui';
import { selectUsers } from '../../../store/reducers/usersReducer';
import getConfig from 'next/config';
import { MinusCircleOutlined } from '@ant-design/icons';
import styles from './ManageAffairUsersForm.module.scss';
import { UsUserModel } from '../../../models/UserService/UsUserModel';
import { getUsUsers } from '../../../services/userService/UsUsers';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import { QueryParameters } from '../../../models/DirectusModel';
import {
  createGdpAffairUsers,
  deleteGdpAffairUsers,
  getGdpAffairsUsers,
} from '../../../services/gestionDeProjets/GdpAffairsUsers';
import { GdpAffairsUsersModel } from '../../../models/GestionDeProjets/GdpAffairsUsersModel';
import {
  createGdpProjectUsersClients,
  deleteProjectsUsersClient,
} from '../../../services/gestionDeProjets/GdpProjectsUsersClients';

const { publicRuntimeConfig } = getConfig();

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

const ManageAffairUsersForm = ({ isOpen, setIsOpen, affair, userType }: ManageAffairUsersProps) => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState<Partial<GdpProjectsModel>[]>([]);
  const [affairs, setAffairs] = useState<Partial<GdpAffairModel>[]>([]);
  const [users, setUsers] = useState<Partial<UsUserModel>[]>(
    useSelector(selectUsers).filter(
      (user) => user.role === publicRuntimeConfig[UserRoles[userType as keyof typeof UserRoles]]
    )
  );
  const [affairUsers, setAffairUsers] = useState<Partial<UsUserModel>[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Partial<string | undefined>[]>([]);
  const [affairDirectusUsersId, setAffairDirectusUsersId] = useState<string[]>([]);

  let timeout: ReturnType<typeof setTimeout> | null;

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
            getGdpAffairsUsers({ filter: { id: { _eq: relation } } }).then((res) => {
              if (res.status === 200 && res.data) {
                res.data.forEach((relation) => {
                  const { directus_users_id } = relation;
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
              getGdpAffairsUsers({ filter: { id: { _eq: relation } } }).then((res) => {
                if (res.status === 200 && res.data) {
                  res.data.forEach((relation) => {
                    const { directus_users_id } = relation;
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
                  getGdpAffairsUsers({ filter: { id: { _eq: relation } } }).then((res) => {
                    if (res.status === 200 && res.data) {
                      const { directus_users_id } = res.data[0];
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
      getUsUsers({ filter: { id: { _in: affairDirectusUsersId } } }).then((res) => {
        if (res.status === 200 && res.data) {
          setAffairUsers(res.data);
          const diff = res.data?.filter(({ id: id1 }) => !users.some(({ id: id2 }) => id2 === id1));
          setUsers([...users, ...diff]);
        } else {
          console.error('Unable to fetch affair users.');
        }
      });
      setAffairDirectusUsersId([]);
    }
  }, [affairDirectusUsersId, users]);

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

  const onFinish = (values: any) => {
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
        deleteGdpAffairUsers(relationToRemove);
      }
      if (valuesToAdd.length > 0) {
        // Ajout des collaborateurs
        createGdpAffairUsers(
          valuesToAdd.map((value: any) => ({ affairs_id: affair.id, directus_users_id: value.user }))
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
        deleteProjectsUsersClient(relationToRemove);
      }
      if (valuesToAdd.length > 0) {
        // Ajout des clients
        createGdpProjectUsersClients(
          valuesToAdd.map((value: any) => ({
            projects_id: typeof affair.projects_id !== 'number' ? affair.projects_id?.id : affair.projects_id,
            directus_users_id: value.user,
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
  };

  return (
    <Modal
      title={`Gèrer l'équipe`}
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
        <Form.List name={'users'} initialValue={affairUsers.map((user) => ({ user: user.id }))}>
          {(fields, { add, remove }) => (
            <>
              <p className={styles.customLabel}>{userType}</p>
              {fields.map(({ key, name, ...restFields }) => (
                <div key={key} className={styles.formListItems}>
                  <Form.Item className={styles.formItem} {...restFields} name={[name, 'user']}>
                    <Select
                      showSearch
                      showArrow={false}
                      filterOption={false}
                      placeholder={'Sélectionnez un ' + userType}
                      options={users.map((user) => ({
                        label: user.first_name + ' ' + user.last_name,
                        value: user.id,
                        disabled: selectedUsers
                          .filter((user) => users.map((user) => user.id).includes(user))
                          .some((id) => id === user.id),
                      }))}
                      onSearch={(value) => {
                        if (value.length > 2) {
                          fetchData(
                            getUsUsers,
                            {
                              filter: {
                                _or: [{ first_name: { _starts_with: value } }, { last_name: { _starts_with: value } }],
                              },
                            },
                            setUsers
                          ).catch((err) => console.error(err));
                        }
                      }}
                      onChange={(value) => {
                        if (value) {
                          const tmp = form.getFieldValue('users');
                          setSelectedUsers(tmp.map((user: any) => user.responsable));
                        }
                      }}
                      notFoundContent={
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Aucun utilisateur trouvé'} />
                      }
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => {
                      const tmp = [...selectedUsers];
                      if (form.getFieldValue('users')[name]) {
                        const index = tmp.indexOf(form.getFieldValue('users')[name].responsable);
                        tmp.splice(index, 1);
                        setSelectedUsers(tmp);
                      }
                      remove(name);
                    }}
                  />
                </div>
              ))}
              <Form.Item>
                <Button small onClick={() => add()} style={'text'}>
                  Ajouter un {userType}
                </Button>
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
    </Modal>
  );
};

export default ManageAffairUsersForm;
