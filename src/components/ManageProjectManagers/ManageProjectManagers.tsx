import { Form, message, Modal, Select } from 'antd';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { useSelector } from 'react-redux';
import { selectProjects } from '../../../store/reducers/projectsReducer';
import React, { useEffect, useState } from 'react';
import styles from './ManageProjectManagers.module.scss';
import { selectUsers } from '../../../store/reducers/usersReducer';
import { UsUserModel } from '../../../models/UserService/UsUserModel';
import {
  createGdpProjectUserCollaborators,
  deleteGdpProjectsUsersCollaborators,
  getGdpProjectsUsersCollaborators,
} from '../../../services/gestionDeProjets/GdpProjectsUsersCollaborators';
import { getUsUsers } from '../../../services/userService/UsUsers';
import { QueryParameters } from '../../../models/DirectusModel';
import { Button } from '@projex/ui';
import { GdpProjectsCollaboratorsModel } from '../../../models/GestionDeProjets/GdpProjectsCollaboratorsModel';
import getConfig from 'next/config';
import { MinusCircleOutlined } from '@ant-design/icons';

const { publicRuntimeConfig } = getConfig();

interface ManageProjectManagersProps {
  open: boolean;
  onClose: () => void;
  project: Partial<GdpProjectsModel>;
}

interface ManageProjectManagersFormValues {
  project: number;
  managers: { manager: string }[];
}

const ManageProjectManagers = ({ open, onClose, project }: ManageProjectManagersProps) => {
  const [form] = Form.useForm();
  const projects = useSelector(selectProjects);
  const users = useSelector(selectUsers);

  let timeout: ReturnType<typeof setTimeout> | null;

  const [initialRelations, setInitialRelations] = useState<Partial<GdpProjectsCollaboratorsModel>[]>([]);
  const [initialManagers, setInitialManagers] = useState<Partial<string | undefined>[]>([]);
  const [managers, setManagers] = useState<Partial<string | undefined>[]>([]);
  const [queriedUsers, setQueriedUsers] = useState<Partial<UsUserModel>[]>([]);

  const fetchData = async (
    getter: (queryParameters: QueryParameters) => any,
    queryParams: QueryParameters,
    setter: React.Dispatch<React.SetStateAction<any>>,
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

  useEffect(() => {
    if (project.projects_directus_users_collaborators_ids) {
      const relationsToInit: Partial<GdpProjectsCollaboratorsModel>[] = [];
      const relationsToFetch: number[] = [];
      const managersToFetch: string[] = [];
      const tmpManagers: Partial<UsUserModel>[] = [];
      project.projects_directus_users_collaborators_ids.forEach((relation) => {
        if (typeof relation === 'number') {
          relationsToFetch.push(relation);
        } else {
          if (relation.project_manager) {
            relationsToInit.push(relation);
            if (typeof relation.directus_users_id === 'string') {
              const user = users.find((user) => user.id === relation.directus_users_id);
              if (user) tmpManagers.push(user);
              else managersToFetch.push(relation.directus_users_id);
            } else {
              tmpManagers.push(relation.directus_users_id);
            }
          }
        }
      });
      if (relationsToFetch.length > 0) {
        getGdpProjectsUsersCollaborators({ filter: { id: { _in: relationsToFetch } } }).then((res) => {
          if (res.status === 200 && res.data) {
            setInitialRelations([...relationsToInit, ...res.data]);
            res.data.forEach((relation) => {
              if (relation.project_manager) {
                if (typeof relation.directus_users_id === 'string') {
                  const user = users.find((user) => user.id === relation.directus_users_id);
                  if (user) tmpManagers.push(user);
                  else managersToFetch.push(relation.directus_users_id);
                } else {
                  relation.directus_users_id && tmpManagers.push(relation.directus_users_id);
                }
              }
            });
          }
          if (managersToFetch.length > 0) {
            getUsUsers({ filter: { id: { _in: managersToFetch } } }).then((res) => {
              if (res.status === 200 && res.data) {
                const temp = [...tmpManagers, ...res.data].map((manager) => manager.id);
                setInitialManagers(temp);
                setManagers(temp);
                setQueriedUsers([...tmpManagers, ...res.data]);
              }
            });
          } else {
            const temp = tmpManagers.map((manager) => manager.id);
            setInitialManagers(temp);
            setManagers(temp);
            setQueriedUsers(tmpManagers);
          }
        });
      } else {
        const temp = tmpManagers.map((manager) => manager.id);
        setInitialRelations(relationsToInit);
        setInitialManagers(temp);
        setManagers(temp);
        setQueriedUsers(tmpManagers);
      }
    }
  }, [project.projects_directus_users_collaborators_ids, users]);

  const handleSubmit = (values: ManageProjectManagersFormValues) => {
    const managersToAdd: string[] = [];
    const managersToRemove: string[] = [];

    initialManagers.forEach((manager) => {
      if (!managers.includes(manager)) {
        manager && managersToRemove.push(manager);
      }
    });

    managers.forEach((manager) => {
      if (!initialManagers.includes(manager)) {
        manager && managersToAdd.push(manager);
      }
    });

    if (managersToAdd.length > 0) {
      type createFieldsToOmit = 'id' | 'show_notifications' | 'activities_id';
      const relationsToAdd: Omit<GdpProjectsCollaboratorsModel, createFieldsToOmit>[] = managersToAdd.map(
        (manager) => ({
          projects_id: values.project,
          directus_users_id: manager,
          project_manager: true,
        }),
      );
      createGdpProjectUserCollaborators(relationsToAdd).then((res) => {
        if (res.status === 200) {
          message.success('Les chefs de projet ont été ajoutés.');
          onClose();
        }
      });
    }
    if (managersToRemove.length > 0) {
      const relationsToRemove: number[] = [];
      initialRelations.forEach((relation) => {
        if (typeof relation.directus_users_id === 'string') {
          if (managersToRemove.includes(relation.directus_users_id) && relation.id) relationsToRemove.push(relation.id);
        } else if (relation.directus_users_id && relation.directus_users_id.id) {
          if (managersToRemove.includes(relation.directus_users_id.id) && relation.id)
            relationsToRemove.push(relation.id);
        }
      });
      deleteGdpProjectsUsersCollaborators(relationsToRemove).then((res) => {
        if (res.status === 204) {
          message.success('Les chefs de projet ont été supprimés.');
          onClose();
        }
      });
    }
  };

  return (
    <Modal open={open} closable onCancel={onClose} title={'Gèrer les chefs de projet.'} footer={null} destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          project: project.id,
          managers: managers.map((manager) => ({ manager: manager })),
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
        <Form.List name={'managers'}>
          {(fields, { add, remove }) => (
            <>
              <p className={styles.customLabel}>Chefs de projet</p>
              {fields.map(({ key, name, ...restFields }) => (
                <div key={key} className={styles.formListItems}>
                  <Form.Item className={styles.formItem} {...restFields} name={[name, 'manager']}>
                    <Select
                      showSearch
                      showArrow={false}
                      filterOption={false}
                      placeholder={'Sélectionnez un chef de projet'}
                      options={queriedUsers.map((user) => ({
                        label: `${user.first_name} ${user.last_name}`,
                        value: user.id,
                        disabled: managers.includes(user.id),
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
                                  { role: { _eq: publicRuntimeConfig.ROLE_COLLABORATOR_ID } },
                                ],
                              },
                            },
                            setQueriedUsers,
                          ).catch((err) => console.error(err));
                        }
                      }}
                      onChange={(value: string) => {
                        if (value) {
                          const tmp = form.getFieldValue('managers');
                          setManagers(tmp.map((manager: { manager: string }) => manager.manager));
                        }
                      }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => {
                      const tmp = [...managers];
                      if (form.getFieldValue('managers')[name]) {
                        const index = tmp.indexOf(form.getFieldValue('managers')[name].manager);
                        tmp.splice(index, 1);
                        setManagers(tmp);
                      }
                      remove(name);
                    }}
                  />
                </div>
              ))}
              <Form.Item>
                <Button small onClick={() => add()} style={'text'}>
                  Ajouter un chef de projet
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <footer className={styles.footer}>
          <Button small htmlType={'submit'}>
            Enregistrer
          </Button>
          <Button small style={'text'} onClick={onClose}>
            Annuler
          </Button>
        </footer>
      </Form>
    </Modal>
  );
};
export default ManageProjectManagers;
