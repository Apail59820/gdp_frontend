import {Empty, Form, message, Modal, Select, Radio, RadioChangeEvent} from "antd";
import { ShopOutlined, InfoCircleOutlined, PlusCircleOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "projex-ui";
import React, { useEffect, useState } from "react";
import { GdpAffairModel } from "../../../models/GestionDeProjets/GdpAffairModel";
import { useRouter } from "next/router";
import { getGdpAffairsPythagoreAffairs } from "../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";
import {
  getGdpPythagoreAffaire,
  getGdpPythagoreAffaires,
} from "../../../services/gestionDeProjets/GdpPythagoreAffairs";
import { GdpPythagoreAffaireModel } from "../../../models/GestionDeProjets/GdpPythagoreAffaireModel";
import { useForm } from "antd/lib/form/Form";
import { GdpProjectsModel } from "../../../models/GestionDeProjets/GdpProjectsModel";
import CreateProjectForAffairModal from "./CreateProjectForAffairModal";
import CreateAffairModal from "./CreateAffairModal";
import ResultModal from "./ResultModal";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../store/reducers/authReducer";
import getConfig from "next/config";
import getUsersProjects from "../../../utils/getUsersProjects";
import { selectProjects } from "../../../store/reducers/projectsReducer";

const publicRuntimeConfig = getConfig();

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affairs: Partial<GdpAffairModel>[];
};

type UserUiChoiceType = {
    level1: string;
    level2: string;
};

const defaultUserUiChoice: UserUiChoiceType = {
    level1: 'useAffairChoice',
    level2: 'createAffairPythagoreChoice',
};

const CreateCerbeModal = ({ isOpen, setIsOpen, affairs }: Props) => {
  const [
    isCreateProjectForAffairModalOpen,
    setIsCreateProjectForAffairModalOpen,
  ] = useState<boolean>(false);

  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<boolean>(false);
  const [resultSubject, setResultSubject] = useState<"project" | "affair">(
    null,
  );
  const [resultSubjectName, setResultSubjectName] = useState<string>("");

  const [affairToCreate, setAffairToCreate] = useState<
    Partial<GdpPythagoreAffaireModel>
  >({});

  const [pythagoreAffairs, setPythagoreAffairs] = useState<
    Partial<GdpPythagoreAffaireModel>[]
  >([]);

  const [pythagoreAffairsSearchList, setPythagoreAffairsSearchList] = useState<
    Partial<GdpPythagoreAffaireModel>[]
  >([]);

  const [createAffairModalOpen, setCreateAffairModalOpen] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [targetAffairId, setTargetAffairId] = useState<number>(null);

  const [currentUsersProjects, setCurrentUsersProjects] = useState<
    Partial<GdpProjectsModel>[]
  >([]);
  const router = useRouter();
  const [form] = useForm();
  const [createProjectForm] = useForm();
  const [createAffairForm] = useForm();

  const userProfile = useSelector(selectUserProfile);
  const globalProjects = useSelector(selectProjects);

    const [userUiChoice, setUserUiChoice] = useState<UserUiChoiceType>(defaultUserUiChoice);

    const handleLevelChange = (level: any, value: string) => {
        setUserUiChoice({
            ...userUiChoice,
            [level as string]: value,
        });
    };

  useEffect(() => {
    if (userUiChoice.level1 === defaultUserUiChoice.level1) {
      const updatedUserUiChoice = { ...userUiChoice, level2: defaultUserUiChoice.level2 };
      setUserUiChoice(updatedUserUiChoice);
    }
  }, [userUiChoice.level1, userUiChoice.level2, isOpen]);

  useEffect(() => {
    if (isOpen) {
      form.setFieldValue("num_affaire", "");
      setUserUiChoice(defaultUserUiChoice);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!userProfile || !userProfile.role || !userProfile.id) return;

    const isCurrentUsersRoleClient =
      userProfile.role === publicRuntimeConfig.ROLE_CLIENT_ID;

    getUsersProjects(
      userProfile.id,
      globalProjects,
      isCurrentUsersRoleClient,
    ).then((projects) => {
      if (projects?.length) {
        setCurrentUsersProjects(projects);
      }
    });
  }, [userProfile, globalProjects]);

  useEffect(() => {
    getGdpPythagoreAffaires().then((res) => {
      if (isRequestSuccessful(res.status) && res?.data?.length) {
        setPythagoreAffairs(res.data);
        setPythagoreAffairsSearchList(res.data.slice(0, 10));
      }
    });
  }, []);

  const onCreateProjectForAffairSubmitted = (
    error: boolean,
    created_affair: Partial<GdpAffairModel>,
  ) => {
    setFormError(error);
    setResultSubject("affair");

    if (!error) {
      setResultSubjectName(created_affair?.name);
      setTargetAffairId(created_affair?.id);
    }

    setIsResultModalOpen(true);
  };

  const onSubmit = async (values: {
    affair?: number;
    num_affaire?: string;
  }) => {
    setIsLoading(true);
    async function affairsExistsInJunctionTable() {
      const res = await getGdpAffairsPythagoreAffairs({
        filter: {
          pythagore_affaires_id: { _eq: values?.num_affaire },
        },
      });

      if (isRequestSuccessful(res.status) && res?.data?.length) {
        return res.data[0];
      }

      return null;
    }

    if (!values.num_affaire) {
      if (typeof values?.affair === "undefined") {
        setIsLoading(false);
        return message.error(
          "Veuillez selectionner une affaire ou entrer un numéro pythagore.",
        );
      }
      setIsLoading(false);
      return router.push(`/cerbe/${values?.affair}`);
    } else {
      const affairPythagoreAffair = await affairsExistsInJunctionTable();
      if (affairPythagoreAffair) {
        setIsLoading(false);
        return router.push(
          `/cerbe/${(affairPythagoreAffair.affairs_id as Partial<GdpAffairModel>)?.id}`,
        );
      }
      const pythagoreAffair = await getGdpPythagoreAffaire(values?.num_affaire);

      if (isRequestSuccessful(pythagoreAffair.status) && pythagoreAffair.data) {
        setAffairToCreate(pythagoreAffair.data);
        setIsLoading(false);
        return setIsCreateProjectForAffairModalOpen(true);
      } else {
        setIsLoading(false);
        return message.error(
          `Aucune affaire pythagore n'a été trouvée avec le numéro '${values?.num_affaire}'`,
        );
      }
    }
  };

  return (
      <>
      <Modal
          closable
          destroyOnClose
          footer={null}
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          title={`Saisir mes données CERBE`}
      >

        <>
          <div style={{display: "flex"}}>
            <Radio.Group defaultValue="useAffairChoice" buttonStyle="solid" size="large" onChange={(e: RadioChangeEvent) => { handleLevelChange('level1', e.target.value);}}>
              <Radio.Button value="useAffairChoice">
                <div>
                  <ShopOutlined width={100} rev={undefined}/>{" "}
                  <span>Affaire existante</span>
                </div>
              </Radio.Button>
              <Radio.Button value="createAffairChoice">
                <div>
                  <PlusCircleOutlined width={100} rev={undefined}/>{" "}
                  <span>Nouvelle Affaire</span>
                </div>
              </Radio.Button>
            </Radio.Group>
          </div>
        </>

        {userUiChoice?.level1 === "useAffairChoice" && (
            <Form
                onFinish={onSubmit}
                layout={"vertical"}
                style={{marginTop: 20}}
                form={form as any}
            >
              <Form.Item
                  label={"Sélectionnez une affaire"}
                  name={"affair"}
                  tooltip={{title: 'Vous avez déjà une affaire', icon: <InfoCircleOutlined rev={undefined}/>}}
              >
                <Select
                    showSearch
                    filterOption={false}
                    placeholder={"Affaire"}
                    style={{width: "100%"}}
                    options={affairs.map((affair) => ({
                      label: affair?.name,
                      value: affair?.id,
                    }))}
                    onChange={() => {
                      form.setFieldValue("num_affaire", null);
                    }}
                />
              </Form.Item>
              <Button style={'text_gray'} color="green-dark" icon={<InfoCircleOutlined rev={undefined} />}>
                Rejoindre l'affaire d'un autre collaborateur
              </Button>
              <div style={{display: "flex", marginTop: 10}}>
                <>
                  <br/>
                  <Button small htmlType={"submit"} loading={isLoading}>
                    Confirmer
                  </Button>
                  <Button
                      small
                      style={"text"}
                      onClick={() => setIsOpen(false)}
                      loading={isLoading}
                  >
                    Annuler
                  </Button>
                </>
              </div>
            </Form>
      )}
      {userUiChoice?.level1 === "createAffairChoice" && (
          <div><br/><h4>Comment voulez-vous procéder ? </h4>
            <>
              <div style={{display: "flex"}}>
                <Radio.Group defaultValue="createAffairPythagoreChoice" buttonStyle="solid" size="large" onChange={(e: RadioChangeEvent) => { handleLevelChange('level2', e.target.value);}}>
                  <Radio.Button value="createAffairPythagoreChoice">
                    <div>
                      <CheckOutlined width={100} rev={undefined}/>{" "}
                      <span>Avec numéro Pythagore</span>
                    </div>
                  </Radio.Button>
                  <Radio.Button value="createAffairLevel2Choice">
                    <div>
                      <CloseOutlined width={100} rev={undefined}/>{" "}
                      <span>Sans numéro Pythagore</span><br/>
                    </div>
                  </Radio.Button>
                </Radio.Group>
              </div>
            </>

            {userUiChoice?.level2 === "createAffairPythagoreChoice" && (
                <Form
                    onFinish={onSubmit}
                    layout={"vertical"}
                    style={{marginTop: 20}}
                    form={form as any}
                >
                  <Form.Item
                      label={"Numéro Pythagore :"}
                      name={"num_affaire"}
                      tooltip={{
                        title: 'Pensez à demander au service comptabilité d\'activer votre numéro Pythagore (2 synchronisations sont effectuées / jour)',
                        icon: <InfoCircleOutlined rev={undefined}/>
                      }}
                  >
                    <Select
                        showSearch
                        filterOption={false}
                        placeholder={
                          "Selectionnez un n° ou un nom d'affaire pythagore"
                        }
                        options={pythagoreAffairsSearchList.map((pythagoreAffair) => ({
                          label: `${pythagoreAffair.numero_affaire} | ${pythagoreAffair.libelle_affaire}`,
                          value: pythagoreAffair.numero_affaire,
                        }))}
                        onSearch={(value) => {
                          setPythagoreAffairsSearchList(
                              pythagoreAffairs
                                  .filter(
                                      (aff) =>
                                          aff.numero_affaire.includes(value) ||
                                          aff.libelle_affaire
                                              .toLowerCase()
                                              .includes(value.toLowerCase()),
                                  )
                                  .slice(0, 10),
                          );
                        }}
                        onChange={() => {
                          form.setFieldValue("affair", null);
                        }}
                        notFoundContent={
                          <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description={"Aucune affaire pythagore trouvée"}
                          />
                        }
                    />
                  </Form.Item>

                  <div style={{display: "flex", marginTop: 10}}>
                    <>
                      <br/>
                      <Button small htmlType={"submit"} loading={isLoading}>
                        Confirmer
                      </Button>
                      <Button
                          small
                          style={"text"}
                          onClick={() => setIsOpen(false)}
                          loading={isLoading}
                      >
                        Annuler
                      </Button>
                    </>
                  </div>
                </Form>
            )}
            {userUiChoice?.level2 === "createAffairLevel2Choice" && (
                <>
                  <br/>
                  <Button small
                      onClick={() => setCreateAffairModalOpen(true)}>
                    Créer une nouvelle affaire
                  </Button>
                </>
            )
            }
          </div>
      )}
      </Modal>

      <CreateProjectForAffairModal
        isOpen={isCreateProjectForAffairModalOpen}
        setIsOpen={setIsCreateProjectForAffairModalOpen}
        affairToCreate={affairToCreate}
        onSubmit={onCreateProjectForAffairSubmitted}
        userProjects={currentUsersProjects}
        form={createProjectForm}
      />

      <CreateAffairModal
        isOpen={createAffairModalOpen}
        setIsOpen={setCreateAffairModalOpen}
        onFormSubmitted={onCreateProjectForAffairSubmitted}
        userProjects={currentUsersProjects}
        form={createAffairForm}
      />

      <ResultModal
        isOpen={isResultModalOpen}
        setIsOpen={setIsResultModalOpen}
        error={formError}
        subject={resultSubject}
        subject_title={resultSubjectName}
        onClickConfirm={() => router.push(`/cerbe/${targetAffairId}`)}
      />
    </>
  );
};

export default CreateCerbeModal;
