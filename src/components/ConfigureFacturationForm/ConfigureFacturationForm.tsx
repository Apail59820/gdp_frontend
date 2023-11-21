import React, { useEffect, useState } from 'react';
import { Empty, Form, message, Modal, Select } from 'antd';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import {useDispatch, useSelector} from 'react-redux';
import { selectProjects } from '../../../store/reducers/projectsReducer';
import { Button } from 'projex-ui';
import styles from './ConfigureFacturationForm.module.scss';
import { MinusCircleOutlined } from '@ant-design/icons';
import { GdpAffairsPythagoreAffairesModel } from '../../../models/GestionDeProjets/GdpAffairsPythagoreAffairesModel';
import {
  createGdpAffairPythagoreAffair,
  deleteGdpAffairPythagoreAffair,
  getGdpAffairsPythagoreAffairs,
} from '../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs';
import { messages } from '../../../constants/messages';
import { QueryParameters } from '../../../models/DirectusModel';
import { getGdpProjects } from '../../../services/gestionDeProjets/GdpProjects';
import { getGdpAffairs } from '../../../services/gestionDeProjets/GdpAffairs';
import { selectAffairs } from '../../../store/reducers/affairsReducer';
import { GdpPythagoreAffaireModel } from '../../../models/GestionDeProjets/GdpPythagoreAffaireModel';
import { getGdpPythagoreAffaires } from '../../../services/gestionDeProjets/GdpPythagoreAffairs';
import {
  selectAffairsPythagoreAffaires,
  setAffairsPythagoreAffaires
} from "../../../store/reducers/affairsPythagoreAffairesReducer";
import {getGdpPythagoreFactures} from "../../../services/gestionDeProjets/GdpPythagoreFactures";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";

type ConfigureFacturationFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initProject?: Partial<GdpProjectsModel>;
  initAffair?: Partial<GdpAffairModel>;
};

const ConfigureFacturationForm = ({ isOpen, setIsOpen, initProject, initAffair }: ConfigureFacturationFormProps) => {
  const [form] = Form.useForm();

  const affairsPythagoreAffaires = useSelector(selectAffairsPythagoreAffaires);

  const [projects, setProjects] = useState<Partial<GdpProjectsModel>[]>(useSelector(selectProjects));
  const [projectId, setProjectId] = useState<number | undefined>(initProject?.id);
  const [affairs, setAffairs] = useState<Partial<GdpAffairModel>[]>(useSelector(selectAffairs));
  const [affairId, setAffairId] = useState<number | undefined>(initAffair?.id);

  const [tmpPythagoreAffairs, setTmpPythagoreAffairs] = useState<Partial<GdpPythagoreAffaireModel>[]>([]);
  const [pythagoreAffairs, setPythagoreAffairs] = useState<Partial<GdpPythagoreAffaireModel>[]>([]);

  const [initPythagoreAffairs, setInitPythagoreAffairs] = useState<string[]>([]);
  const [selectedPythagoreAffairs, setSelectedPythagoreAffairs] = useState<string[]>([]);

  const dispatch = useDispatch();

  let timeout: ReturnType<typeof setTimeout> | null;

  useEffect(() => {
    initAffair && initAffair.id && setAffairId(initAffair.id);
  }, [initAffair]);

  useEffect(() => {
    if (initProject) {
      if (!projects.includes(initProject)) {
        setProjects([...projects, initProject]);
      }
    }
    if (initAffair) {
      if (!affairs.includes(initAffair)) {
        setAffairs([...affairs, initAffair]);
      }
    }
  }, [affairs, initAffair, initProject, projects]);

  useEffect(() => {
    if (initProject) {
      setProjectId(initProject.id);
    }
  }, [initProject]);

  // Ce useEffect nous permet de ne récupérer que les affaires pythagores qui n'ont pas d'affaire associée
  useEffect(() => {
    const tmp = [...tmpPythagoreAffairs].filter((pythagoreAffaire) => pythagoreAffaire.affairs_id?.length === 0);
    setPythagoreAffairs([...pythagoreAffairs, ...tmp]);
  }, [tmpPythagoreAffairs]);

  useEffect(() => {
    setSelectedPythagoreAffairs(initPythagoreAffairs);
  }, [initPythagoreAffairs]);

  useEffect(() => {
    if (!initAffair) {
      setAffairs([]);
      setAffairId(undefined);
      form.setFieldValue('affairId', undefined);
      if (projects.filter((project) => project.id === projectId).length > 0) {
        const currentProject = projects.filter((project) => project.id === projectId)[0];

        const fetchAffairs = async (tmpIdAffairs: number[]) => {
          return await getGdpAffairs({ filter: { id: { _in: tmpIdAffairs } } });
        };

        const tmpAffairs: GdpAffairModel[] = [];
        const tmpIdAffairs: number[] = [];
        currentProject?.affairs_ids?.forEach((affair) => {
          if (typeof affair !== 'number') {
            tmpAffairs.push(affair);
          } else {
            tmpIdAffairs.push(affair);
          }
        });

        if (tmpIdAffairs.length > 0) {
          fetchAffairs(tmpIdAffairs).then((res) => {
            if (res.status === 200 && res.data) {
              setAffairs([...tmpAffairs, ...res.data]);
            } else {
              setAffairs(tmpAffairs);
            }
          });
        }
      }
    }
  }, [projectId, projects]);

  useEffect(() => {
    setInitPythagoreAffairs([]);
    setPythagoreAffairs([]);
    form.setFieldValue('pythagoreAffaire', []);
    const fetchAffairsPythagoreAffaires = async (tmpIdAffairs: number[]) => {
      return await getGdpAffairsPythagoreAffairs({ filter: { id: { _in: tmpIdAffairs } } });
    };

    if (affairs.filter((affair) => affair.id === affairId).length > 0) {
      const currentAffair = affairs.filter((affair) => affair.id === affairId)[0];
      const tmpPythagoreAffairs: string[] = [];
      const tmpPythagoreAffairsIds: number[] = [];
      currentAffair?.pythagore_ids?.forEach((pythagoreId) => {
        if (typeof pythagoreId !== 'number') {
          if (typeof pythagoreId.pythagore_affaires_id === 'string') {
            tmpPythagoreAffairs.push(pythagoreId.pythagore_affaires_id);
          } else {
            tmpPythagoreAffairs.push(pythagoreId.pythagore_affaires_id.numero_affaire);
          }
        } else {
          tmpPythagoreAffairsIds.push(pythagoreId);
        }
      });
      if (tmpPythagoreAffairsIds.length > 0) {
        fetchAffairsPythagoreAffaires(tmpPythagoreAffairsIds).then((res) => {
          if (res.status === 200 && res.data) {
            res.data.forEach((pythagoreAffaire) => {
              if (pythagoreAffaire.pythagore_affaires_id) {
                if (typeof pythagoreAffaire.pythagore_affaires_id === 'string') {
                  tmpPythagoreAffairs.push(pythagoreAffaire.pythagore_affaires_id);
                } else {
                  tmpPythagoreAffairs.push(pythagoreAffaire.pythagore_affaires_id.numero_affaire);
                }
              }
            });
          }
        });
      }
      if (tmpPythagoreAffairs.length > 0) {
        getGdpPythagoreAffaires({ filter: { numero_affaire: { _in: tmpPythagoreAffairs } } }).then((res) => {
          if (res.status === 200 && res.data) {
            setPythagoreAffairs(res.data);
          }
        });
      }
      setInitPythagoreAffairs(tmpPythagoreAffairs);
      form.setFieldValue(
        'pythagoreAffaire',
        tmpPythagoreAffairs.map((pythagoreAffaire) => ({ affaire: pythagoreAffaire }))
      );
    }
  }, [affairId]);

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
    const initAffairsPythagoreAffairs: GdpAffairsPythagoreAffairesModel[] = [];
    if (affairs.filter((affair) => affair.id === affairId).length > 0) {
      const currentAffair = affairs.filter((affair) => affair.id === affairId)[0];
      currentAffair.pythagore_ids?.map((relation) => {
        if (typeof relation !== 'number') {
          initAffairsPythagoreAffairs.push(relation);
        }
      });
    }
    const pythagoreFacturesValues: string[] = [];
    values.pythagoreAffaire.forEach((affaire: { affaire: string }) => {
      affaire.affaire && pythagoreFacturesValues.push(affaire.affaire);
    });
    const pythagoreFacturesToDelete = initPythagoreAffairs.filter((init) => !pythagoreFacturesValues.includes(init));
    const relationsIdsToDelete = initAffairsPythagoreAffairs
      .filter((relation) => {
        if (typeof relation.pythagore_affaires_id === 'string') {
          return pythagoreFacturesToDelete.includes(relation.pythagore_affaires_id);
        } else {
          return pythagoreFacturesToDelete.includes(relation.pythagore_affaires_id.numero_affaire);
        }
      })
      .map((relation) => {
        return relation.id;
      });
    const pythagoreFacturesToAdd = pythagoreFacturesValues.filter((value) => !initPythagoreAffairs.includes(value));
    if (relationsIdsToDelete.length > 0) {
      deleteGdpAffairPythagoreAffair(relationsIdsToDelete).then((res) => {
        if (res.status === 200 || res.status === 202 || res.status === 204) {
          message.success(messages.general.success('La suppression des relations', true, false));

          getGdpAffairsPythagoreAffairs({filter: {id: {_in: relationsIdsToDelete}}}).then((res) => {
            if(isRequestSuccessful(res.status) && res.data){
              const filteredAffairsPythagoreAffaires = affairsPythagoreAffaires.filter(existingAffairs => {
                return !res.data.some(affairsToSeek =>
                    affairsToSeek.pythagore_affaires_id === existingAffairs.pythagore_affaires_id
                );
              });

              dispatch(setAffairsPythagoreAffaires(filteredAffairsPythagoreAffaires));
            }
          })
        } else {
          message.error(messages.general.error());
        }
        setIsOpen(false);
      });
    }

    if (pythagoreFacturesToAdd.length > 0 && affairId) {
      const relationsToAdd: Omit<GdpAffairsPythagoreAffairesModel, 'id' | 'activities_id'>[] =
        pythagoreFacturesToAdd.map((pythagoreFacture) => ({
          affairs_id: affairId,
          pythagore_affaires_id: pythagoreFacture,
        }));
      createGdpAffairPythagoreAffair(relationsToAdd).then((res) => {
        if (res.status === 200) {
          message.success(messages.general.success('La création des relations', true, false));
          dispatch(setAffairsPythagoreAffaires([...affairsPythagoreAffaires, res.data]));
        } else {
          message.error(messages.general.error());
        }
        setIsOpen(false);
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      closable
      onCancel={() => setIsOpen(false)}
      title={'Configurer la facturation'}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        name={'configureFacturation'}
        autoComplete={'off'}
        layout={'vertical'}
        initialValues={{
          projectId: projectId,
          affairId: initAffair?.id,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label={'Nom du projet'}
          name={'projectId'}
          id={'projectId'}
          rules={[
            {
              required: true,
              message: 'Veuillez selectionner un projet',
            },
          ]}
        >
          <Select
            showSearch
            showArrow={false}
            filterOption={false}
            placeholder={'Recherchez un projet'}
            disabled={!!initProject}
            options={projects.map((project) => ({
              label: project.name,
              value: project.id,
            }))}
            onSearch={(value) => {
              if (value.length > 2) {
                fetchData(getGdpProjects, { filter: { name: { _starts_with: value } } }, setProjects).catch((err) => {
                  console.error(err);
                });
              }
            }}
            onChange={(values: any) => {
              setProjectId(values);
            }}
            notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Aucun projet trouvé'} />}
          />
        </Form.Item>
        <Form.Item
          label={"Nom de l'affaire"}
          name={'affairId'}
          id={'affairId'}
          rules={[
            {
              required: true,
              message: 'Veuillez selectionner une affaire',
            },
          ]}
        >
          <Select
            placeholder={projectId !== undefined ? 'Recherchez une affaire' : "Veuillez d'abord selectionner un projet"}
            disabled={!!initAffair || projectId == undefined}
            onChange={setAffairId}
            options={affairs.map((affair) => ({ label: affair.name, value: affair.id }))}
            notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Aucune affaire trouvée'} />}
          />
        </Form.Item>
        <Form.List
          name={'pythagoreAffaire'}
          initialValue={initPythagoreAffairs.map((pythagoreFacture) => ({ affaire: pythagoreFacture }))}
        >
          {(fields, { add, remove }) => (
            <>
              <p className={styles.customLabel}>Numéros Pythagore</p>
              {fields.map(({ key, name, ...restFields }) => (
                <div className={styles.formListItems} key={key}>
                  <Form.Item className={styles.formItem} {...restFields} name={[name, 'affaire']}>
                    <Select
                      showSearch
                      showArrow={false}
                      filterOption={false}
                      placeholder={
                        affairId !== undefined ? 'Numéros Pythagore' : "Veuillez d'abord selectionner une affaire"
                      }
                      disabled={affairId == undefined}
                      options={pythagoreAffairs.map((pythagoreFacture) => ({
                        label: pythagoreFacture.numero_affaire,
                        value: pythagoreFacture.numero_affaire,
                        disabled: selectedPythagoreAffairs
                          .filter((pythagoreAffair) =>
                            pythagoreAffairs
                              .map((pythagoreAffair) => pythagoreAffair.numero_affaire)
                              .includes(pythagoreAffair)
                          )
                          .some((numero_affaire) => numero_affaire === pythagoreFacture.numero_affaire),
                      }))}
                      onSearch={(value) => {
                        if (value.length > 2) {
                          fetchData(
                            getGdpPythagoreAffaires,
                            { filter: { numero_affaire: { _starts_with: value } } },
                            setTmpPythagoreAffairs
                          ).catch((err) => {
                            console.error(err);
                          });
                        }
                      }}
                      onChange={(value: any) => {
                        if (value) {
                          const tmp = form.getFieldValue('pythagoreAffaire');
                          setSelectedPythagoreAffairs(tmp.map((pythagoreAffair: any) => pythagoreAffair.affaire));
                        }
                      }}
                      notFoundContent={
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Aucune affaire pythagore trouvée'} />
                      }
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    rev={undefined}
                    onClick={() => {
                      const tmp = [...selectedPythagoreAffairs];
                      if (form.getFieldValue('pythagoreAffaire')[name]) {
                        const index = tmp.indexOf(form.getFieldValue('pythagoreAffaire')[name].affaire);
                        tmp.splice(index, 1);
                        setSelectedPythagoreAffairs(tmp);
                      }
                      remove(name);
                    }}
                  />
                </div>
              ))}
              <Form.Item>
                <Button small onClick={() => add()} style={'text'}>
                  Ajouter un numéro Pythagore
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

export default ConfigureFacturationForm;
