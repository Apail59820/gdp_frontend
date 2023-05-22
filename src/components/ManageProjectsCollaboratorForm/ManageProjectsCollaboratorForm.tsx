import React, { useEffect, useState } from 'react';
import { Form, message, Modal, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Button } from '@projex/ui';
import { MinusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectProjects } from '../../../store/reducers/projectsReducer';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import {
  createGdpProjectUserCollaborator,
  deleteGdpProjectsUsersCollaborators,
  getGdpProjectsUsersCollaborators,
} from '../../../services/gestionDeProjets/GdpProjectsUsersCollaborators';
import { getUsUsers } from '../../../services/userService/UsUsers';
import { UsUserModel } from '../../../models/UserService/UsUserModel';
import { selectUsers } from '../../../store/reducers/usersReducer';
import styles from './ManageProjectsCollaboratorForm.module.scss';
import { QueryParameters } from '../../../models/DirectusModel';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
};

const ManageProjectsCollaboratorForm = ({ isOpen, setIsOpen, projectId }: Props) => {
  const [form] = useForm();

  const [projects, setProjects] = useState(useSelector(selectProjects));
  const [users, setUsers] = useState<Partial<UsUserModel>[]>(useSelector(selectUsers));

  const [initalCollaborators, setInitialCollaborators] = useState<Partial<UsUserModel>[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Partial<string | undefined>[]>([]);

  let timeout: ReturnType<typeof setTimeout> | null;

  useEffect(() => {
    if (projects.filter((project) => project.id === projectId).length == 0) {
      getGdpProjectById(projectId).then((res) => {
        if (res.status === 200 && res.data) {
          setProjects([...projects, res.data]);
        }
      });
    }
    const project = projects.filter((project) => project.id === projectId)[0];
    const relationId: string[] = [];
    const userId: string[] = [];
    const tmpInitCollaborators: Partial<UsUserModel>[] = [];
    project?.projects_directus_users_collaborators_ids?.forEach((relation) => {
      if (typeof relation === 'string') {
        relationId.push(relation);
      } else {
        if (typeof relation.directus_users_id === 'string') {
          userId.push(relation.directus_users_id);
        } else {
          tmpInitCollaborators.push(relation.directus_users_id);
        }
      }
    });
    if (relationId && relationId.length > 0) {
      getGdpProjectsUsersCollaborators({ filter: { id: { _in: relationId } } }).then((res) => {
        if (res.status == 200 && res.data) {
          res.data.forEach((relation) => {
            if (typeof relation.directus_users_id === 'string') {
              userId.push(relation.directus_users_id);
            } else if (relation.directus_users_id) {
              tmpInitCollaborators.push(relation.directus_users_id);
            }
          });
        }
      });
    }
    if (userId.length > 0) {
      getUsUsers({ filter: { id: { _in: userId } } }).then((res) => {
        if (res.status == 200 && res.data) {
          setInitialCollaborators([...tmpInitCollaborators, ...res.data]);
        }
      });
    }
  }, [projects]);

  useEffect(() => {
    setUsers([...users, ...initalCollaborators.filter((collaborator) => !users.includes(collaborator))]);
    setSelectedUsers([...initalCollaborators.map((collaborator) => collaborator.id)]);
  }, [initalCollaborators]);

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
    const valuesToDelete = initalCollaborators.filter((collaborator) => {
      return !values.collaborators.find((value: any) => value.collaborator === collaborator.id);
    });
    const valuesToAdd = values.collaborators.filter((value: any) => {
      if (value.collaborator !== undefined) {
        return !initalCollaborators.find((collaborator) => value.collaborator === collaborator.id);
      }
    });
    const relationToRemove: number[] = [];
    const project = projects.filter((project) => project.id === projectId)[0];
    if (project) {
      project.projects_directus_users_collaborators_ids?.forEach((relation) => {
        if (typeof relation !== 'string') {
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
      if (relationToRemove.length > 0) {
        // Suppression des collaborateurs
        deleteGdpProjectsUsersCollaborators(relationToRemove);
      }
      if (valuesToAdd.length > 0) {
        // Ajout des collaborateurs
        createGdpProjectUserCollaborator(
          valuesToAdd.map((value: any) => ({
            projects_id: projectId,
            directus_users_id: value.collaborator,
            project_manager: false,
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
      open={isOpen}
      closable
      destroyOnClose={true}
      afterClose={() => {
        form.resetFields();
        setSelectedUsers(initalCollaborators.map((collaborator) => collaborator.id));
        setUsers([...initalCollaborators]);
      }}
      onCancel={() => setIsOpen(false)}
      title={"Gérer l'équipe"}
      footer={null}
    >
      <Form
        name={'manageProjectsCollaboratorForm'}
        form={form}
        autoComplete={'off'}
        layout={'vertical'}
        initialValues={{
          project: projectId,
        }}
        onFinish={onFinish}
      >
        <Form.Item label={'Projet'} name={'project'}>
          <Select
            disabled
            options={projects.map((project) => ({
              label: project.name,
              value: project.id,
            }))}
          />
        </Form.Item>
        <Form.List
          name={'collaborators'}
          initialValue={initalCollaborators.map((collaborateur) => ({ collaborator: collaborateur.id }))}
        >
          {(fields, { add, remove }) => (
            <>
              <p className={styles.customLabel}>Collaborateurs</p>
              {fields.map(({ key, name, ...restFields }) => (
                <div className={styles.formListItems} key={key}>
                  <Form.Item className={styles.formItem} {...restFields} name={[name, 'collaborator']}>
                    <Select
                      showSearch
                      showArrow={false}
                      filterOption={false}
                      placeholder={'Recherchez un collaborateur'}
                      options={users.map((user) => ({
                        label: `${user.first_name} ${user.last_name}`,
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
                                _and: [
                                  {
                                    _or: [
                                      { first_name: { _starts_with: value } },
                                      { last_name: { _starts_with: value } },
                                    ],
                                  },
                                  {
                                    role: {
                                      _eq: publicRuntimeConfig.ROLE_COLLABORATOR_ID,
                                    },
                                  },
                                ],
                              },
                            },
                            setUsers
                          );
                        }
                      }}
                      onChange={(value) => {
                        if (value) {
                          const tmp = form.getFieldValue('collaborators');
                          setSelectedUsers(tmp.map((collaborator: any) => collaborator.collaborator));
                        }
                      }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => {
                      remove(name);
                    }}
                  />
                </div>
              ))}
              <Form.Item>
                <Button small onClick={() => add()} style={'text'}>
                  Ajouter un collaborateur
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <footer className={styles.footer}>
          <Button small style={'primary'} htmlType={'submit'}>
            Enrergistrer
          </Button>
          <Button small onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
        </footer>
      </Form>
    </Modal>
  );
};

export default ManageProjectsCollaboratorForm;
