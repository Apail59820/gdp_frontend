import React, { useEffect, useState } from 'react';
import { Form, message, Modal, Select } from 'antd';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import getConfig from 'next/config';
import { UsUserModel } from '../../../models/UserService/UsUserModel';
import { getUsUsers } from '../../../services/userService/UsUsers';
import { messages } from '../../../constants/messages';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Button } from '@projex/ui';
import styles from './ManageAffairManagerForm.module.scss';
import { updateAffairUsers } from '../../../services/gestionDeProjets/GdpAffairsUsers';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import { QueryParameters } from '../../../models/DirectusModel';

const { publicRuntimeConfig } = getConfig();

type ManageAffairManagerFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affair: Partial<GdpAffairModel>;
};

const ManageAffairManagerForm = ({ isOpen, setIsOpen, affair }: ManageAffairManagerFormProps) => {
  const [form] = Form.useForm();

  const [projects, setProjects] = useState<Partial<GdpProjectsModel>[]>([]);
  // const projects: Partial<GdpProjectsModel>[] = useSelector(selectProjects);
  const [affairs, setAffairs] = useState<Partial<GdpAffairModel>[]>([]);
  // const affairs: Partial<GdpAffairModel>[] = useSelector(selectAffairs);

  const [affairUsers, setAffairUsers] = useState<Partial<UsUserModel>[]>([]);
  const [affairManagers, setAffairManagers] = useState<Partial<UsUserModel>[]>([]);

  const [selectedAffairManager, setSelectedAffairManager] = useState<string[]>([]);

  let timeout: ReturnType<typeof setTimeout> | null;

  const initialAffairManagerList: string[] = [];
  const affairDirectusUsersId: string[] = [];
  affair.affairs_directus_users_ids?.forEach((relation) => {
    if (typeof relation !== 'number') {
      if (typeof relation.directus_users_id !== 'string') {
        affairDirectusUsersId.push(relation.directus_users_id.id);
        if (relation.project_manager) initialAffairManagerList.push(relation.directus_users_id.id);
      } else {
        affairDirectusUsersId.push(relation.directus_users_id);
        if (relation.project_manager) initialAffairManagerList.push(relation.directus_users_id);
      }
    }
  });

  function arrayEquals(a: Array<any>, b: Array<any>) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
  }

  const onFinish = (values: any) => {
    const affairManagerToRemove = affairManagers.filter((manager) => {
      return !values.managers.some((manager2: any) => manager2.responsable === manager.id);
    });
    const relationIdToRemove: number[] = [];
    affair.affairs_directus_users_ids?.forEach((relation) => {
      if (typeof relation !== 'number') {
        if (typeof relation.directus_users_id !== 'string') {
          const rduId = relation.directus_users_id;
          if (affairManagerToRemove.some((manager) => manager.id === rduId.id)) {
            relationIdToRemove.push(relation.id);
          }
        } else {
          if (affairManagerToRemove.some((manager) => manager.id === relation.directus_users_id)) {
            relationIdToRemove.push(relation.id);
          }
        }
      }
    });
    const affairManagerToAdd = values.managers.filter((manager: any) => {
      if (manager.responsable !== undefined) {
        return !affairManagers.some((manager2) => manager2.id === manager.responsable);
      }
    });
    const relationIdToAdd: number[] = [];
    affair.affairs_directus_users_ids?.forEach((relation) => {
      if (typeof relation !== 'number') {
        if (typeof relation.directus_users_id !== 'string') {
          const rduId = relation.directus_users_id;
          if (affairManagerToAdd.some((manager: { responsable: string }) => manager.responsable === rduId.id)) {
            relationIdToAdd.push(relation.id);
          }
        } else {
          if (
            affairManagerToAdd.some(
              (manager: { responsable: string }) => manager.responsable === relation.directus_users_id
            )
          ) {
            relationIdToAdd.push(relation.id);
          }
        }
      }
    });
    if (relationIdToRemove.length > 0) {
      updateAffairUsers({ keys: relationIdToRemove, data: { project_manager: false } }).then((res) => {
        if (res.status === 200) {
          message.success(messages.general.success("La modification des responsables d'affaire", true, false));
        } else {
          message.error(messages.general.error());
        }
      });
    }
    if (affairManagerToAdd.length > 0) {
      updateAffairUsers({ keys: relationIdToAdd, data: { project_manager: true } }).then((res) => {
        if (res.status === 200) {
          message.success(messages.general.success("La modification des responsables d'affaire", true, false));
        } else {
          message.error(messages.general.error());
        }
      });
    }
  };

  useEffect(() => {
    if (!arrayEquals(selectedAffairManager, initialAffairManagerList)) {
      setSelectedAffairManager(initialAffairManagerList);
    }
  }, []);

  useEffect(() => {
    if (affair) {
      if (!affairs.includes(affair)) setAffairs([...affairs, affair]);
      if (affair.projects_id) {
        if (typeof affair.projects_id === 'number') {
          getGdpProjectById(affair.projects_id).then((res) => {
            if (res.status === 200 && res.data) {
              if (!projects.includes(res.data)) setProjects([...projects, res.data]);
            }
          });
        } else {
          if (!projects.includes(affair.projects_id)) setProjects([...projects, affair.projects_id]);
        }
      }
    }
    if (affairDirectusUsersId.length > 0) {
      getUsUsers({ filter: { id: { _in: affairDirectusUsersId } } }).then((res) => {
        if (res.status === 200 && res.data) {
          setAffairUsers(res.data);
          const tmpAMList: Partial<UsUserModel>[] = [...affairManagers];
          res.data.forEach((user) => {
            if (initialAffairManagerList.includes(user.id as string)) tmpAMList.push(user);
          });
          setAffairManagers(tmpAMList);
        } else {
          message.error(messages.fetchData.error("les utilisateurs liés à l'affaire."));
        }
      });
    }
  }, []);

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
      title={"Gèrer les responsables d'affaire"}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        form={form}
        name={'manageAffairManager'}
        autoComplete={'off'}
        layout={'vertical'}
        onFinish={onFinish}
        initialValues={{
          project: typeof affair.projects_id === 'number' ? affair.projects_id : affair.projects_id?.id,
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
        <Form.List name={'managers'} initialValue={affairManagers.map((user) => ({ responsable: user.id }))}>
          {(fields, { add, remove }) => (
            <>
              <p className={styles.customLabel}>Responsables d&apos;affaire</p>
              {fields.map(({ key, name, ...restFields }) => (
                <div className={styles.formListItems} key={key}>
                  <Form.Item className={styles.formItem} {...restFields} name={[name, 'responsable']}>
                    <Select
                      showSearch
                      showArrow={false}
                      filterOption={false}
                      placeholder={'Recherchez un utilisateur'}
                      options={affairUsers
                        .filter((user) => user.role === publicRuntimeConfig.ROLE_COLLABORATOR_ID)
                        .map((user) => ({
                          label: user.first_name + ' ' + user.last_name,
                          value: user.id,
                          disabled: selectedAffairManager
                            .filter((id) => affairUsers.map((user) => user.id).includes(id))
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
                                  { role: { _eq: publicRuntimeConfig.ROLE_COLLABORATOR_ID } },
                                ],
                              },
                            },
                            setAffairUsers
                          ).catch((err) => {
                            console.error(err);
                          });
                        }
                      }}
                      onChange={(value) => {
                        if (value) {
                          const tmp = form.getFieldValue('managers');
                          setSelectedAffairManager(tmp.map((user: any) => user.responsable));
                        }
                      }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <Form.Item>
                <Button small onClick={() => add()} style={'text'}>
                  Ajouter un responsable d&apos;affaire
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

export default ManageAffairManagerForm;
