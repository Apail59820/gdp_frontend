import React, {useEffect, useState} from 'react';
import {Empty, Form, message, Modal, Select} from 'antd';
import {GdpProjectsModel} from '../../../models/GestionDeProjets/GdpProjectsModel';
import {GdpAffairModel} from '../../../models/GestionDeProjets/GdpAffairModel';
import {useDispatch, useSelector} from 'react-redux';
import {selectProjects} from '../../../store/reducers/projectsReducer';
import {Button} from 'projex-ui';
import styles from './ConfigureFacturationForm.module.scss';
import {MinusCircleOutlined} from '@ant-design/icons';
import {GdpAffairsPythagoreAffairesModel} from '../../../models/GestionDeProjets/GdpAffairsPythagoreAffairesModel';
import {
  createGdpAffairPythagoreAffair,
  deleteGdpAffairPythagoreAffair,
  getGdpAffairsPythagoreAffairs,
} from '../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs';
import {messages} from '../../../constants/messages';
import {QueryParameters} from '../../../models/DirectusModel';
import {getGdpProjects} from '../../../services/gestionDeProjets/GdpProjects';
import {getGdpAffairs} from '../../../services/gestionDeProjets/GdpAffairs';
import {selectAffairs} from '../../../store/reducers/affairsReducer';
import {GdpPythagoreAffaireModel} from '../../../models/GestionDeProjets/GdpPythagoreAffaireModel';
import {getGdpPythagoreAffaires} from '../../../services/gestionDeProjets/GdpPythagoreAffairs';
import {
  selectAffairsPythagoreAffaires,
  setAffairsPythagoreAffaires
} from "../../../store/reducers/affairsPythagoreAffairesReducer";
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

  const [relationsToAdd, setRelationsToAdd] = useState<string[]>([]);
  const [relationsToRemove, setRelationsToRemove] = useState<string[]>([]);

  // Relations to remove are relations that ALREADY exists in DB so we need this to check before querying API
  const [existingRelations, setExistingRelations] = useState<string[]>([]);
  const [formRelations, setFormRelations] = useState<Map<number, string>>(new Map());

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setPythagoreAffairs(tmp);
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

  async function refreshExistingRelations() {
    getGdpAffairsPythagoreAffairs({filter: {
        affairs_id: affairId
      }}).then(
        (res) => {
          if(isRequestSuccessful(res.status) && res?.data){
            setExistingRelations(res.data.map(
                // @ts-ignore
                affairPythagoreAffaire => affairPythagoreAffaire.pythagore_affaires_id?.numero_affaire
            ));
          }
        }
    )
  }

  useEffect(() => {
    refreshExistingRelations();
  }, [affairId]);
  async function addRelations() {
    if(relationsToAdd.length > 0) {
      const affairsToAdd: Omit<GdpAffairsPythagoreAffairesModel, 'id' | 'activities_id'>[] =
          relationsToAdd.map((relation) => ({
            affairs_id: affairId,
            pythagore_affaires_id: relation,
          }));

      const createAffairPythagoreAffairRes = await createGdpAffairPythagoreAffair(affairsToAdd);

      if(!isRequestSuccessful(createAffairPythagoreAffairRes.status) || !createAffairPythagoreAffairRes.data){
        return message.error(messages.general.error());
      }

      message.success(messages.general.success('La création des relations', true, false));
      dispatch(setAffairsPythagoreAffaires([...affairsPythagoreAffaires, createAffairPythagoreAffairRes.data]));
      setRelationsToAdd([]);
    }
  }

  async function removeRelations() {
    if(relationsToRemove.length > 0){
      const getRelationsIdsPromise = await getGdpAffairsPythagoreAffairs(
          {filter : { pythagore_affaires_id: { _in: relationsToRemove }}, fields: 'id,pythagore_affaires_id'});

      if(!isRequestSuccessful(getRelationsIdsPromise.status) || !getRelationsIdsPromise.data){
        return message.error(messages.general.error());
      }

      const relationsIdsToDelete = getRelationsIdsPromise.data.map(relation => relation.id);

      const deleteRelationsPromise = await deleteGdpAffairPythagoreAffair(relationsIdsToDelete);

      if(!isRequestSuccessful(deleteRelationsPromise.status)){
        return message.error(messages.general.error());
      } else {
        message.success(messages.general.success('La suppression des relations', true, false));
        setRelationsToRemove([]);
      }
    }
  }
  const onFinish = async (values: any) => {
    setIsLoading(true);
    await removeRelations().then(
        async () => await addRelations().catch(
            (e) => {
              console.error(e);
            }
        )
    ).catch(
        (e) => console.error(e)
    );

    await refreshExistingRelations();
    setIsLoading(false);
    setIsOpen(false);
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
                            { filter: { numero_affaire: { _starts_with: value } }, limit: 10 },
                            setTmpPythagoreAffairs
                          ).catch((err) => {
                            console.error(err);
                          });
                        }
                      }}
                      onChange={(value: any) => {
                        if (value) {
                          const tmp = form.getFieldValue('pythagoreAffaire');
                          const selectedPythagoreAffairs = tmp.map((pythagoreAffair: any) => pythagoreAffair.affaire);

                          setSelectedPythagoreAffairs(selectedPythagoreAffairs);

                          const newRelationsToAdd = relationsToAdd.filter(rel => rel !== formRelations.get(name));

                          if (!existingRelations.includes(value)) {
                            if (!relationsToAdd.includes(value)) {
                              setFormRelations(formRelations.set(name, value));
                              setRelationsToAdd([...newRelationsToAdd, value]);
                              if (relationsToRemove.includes(value)) {
                                setRelationsToRemove(relationsToRemove.filter(rel => rel !== value));
                              }
                            }
                          } else {
                            if (relationsToRemove.includes(value)) {
                              setRelationsToRemove(relationsToRemove.filter(rel => rel !== value));
                            }
                          }
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
                        let numAffaireToDrop = form.getFieldValue('pythagoreAffaire')[name];
                        const index = tmp.indexOf(numAffaireToDrop);

                        if(existingRelations.includes(numAffaireToDrop.affaire) && !relationsToRemove.includes(numAffaireToDrop.affaire)) {
                          setRelationsToRemove([...relationsToRemove, numAffaireToDrop.affaire]);
                          console.log("to remove set");
                        }

                        if(relationsToAdd.includes(numAffaireToDrop.affaire)) {
                          setRelationsToAdd(relationsToAdd.filter(rel => rel !== numAffaireToDrop.affaire));
                        }
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
          <Button small htmlType={'submit'} loading={isLoading}>
            Enregistrer
          </Button>
          <Button small style={'text'} onClick={() => setIsOpen(false)} loading={isLoading}>
            Annuler
          </Button>
        </footer>
      </Form>
    </Modal>
  );
};

export default ConfigureFacturationForm;
