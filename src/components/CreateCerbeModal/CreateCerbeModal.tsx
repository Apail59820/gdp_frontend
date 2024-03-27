import {
  Divider,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Result,
  Select,
} from "antd";
import { Button } from "projex-ui";
import React, { useEffect, useState } from "react";
import { GdpAffairModel } from "../../../models/GestionDeProjets/GdpAffairModel";
import { useRouter } from "next/router";
import {
  createGdpAffairPythagoreAffair,
  getGdpAffairsPythagoreAffairs,
} from "../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";
import {
  getGdpPythagoreAffaire,
  getGdpPythagoreAffaires,
} from "../../../services/gestionDeProjets/GdpPythagoreAffairs";
import { GdpPythagoreAffaireModel } from "../../../models/GestionDeProjets/GdpPythagoreAffaireModel";
import { createGdpProject } from "../../../services/gestionDeProjets/GdpProjects";
import { createGdpAffair } from "../../../services/gestionDeProjets/GdpAffairs";
import { useForm } from "antd/lib/form/Form";
import { messages } from "../../../constants/messages";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../store/reducers/authReducer";
import { UsCompanyEntitiesUsersModel } from "../../../models/UserService/UsCompanyEntitiesUsersModel";
import { GdpProjectsModel } from "../../../models/GestionDeProjets/GdpProjectsModel";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affairs: Partial<GdpAffairModel>[];
  userProjects: Partial<GdpProjectsModel>[];
};
const CreateCerbeModal = ({
  isOpen,
  setIsOpen,
  affairs,
  userProjects,
}: Props) => {
  const [
    isCreateProjectForAffairModalOpen,
    setIsCreateProjectForAffairModalOpen,
  ] = useState<boolean>(false);

  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  const [affairToCreate, setAffairToCreate] = useState<
    Partial<GdpPythagoreAffaireModel>
  >({});

  const [pythagoreAffairs, setPythagoreAffairs] = useState<
    Partial<GdpPythagoreAffaireModel>[]
  >([]);

  const [pythagoreAffairsSearchList, setPythagoreAffairsSearchList] = useState<
    Partial<GdpPythagoreAffaireModel>[]
  >([]);

  const [userProjectsSearchList, setUserProjectsSearchList] = useState<
    Partial<GdpProjectsModel>[]
  >(userProjects || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateProjectForAffairLoading, setIsCreateProjectForAffairLoading] =
    useState<boolean>(false);
  const [createdProjectResultError, setCreatedProjectResultError] =
    useState<boolean>(false);

  const [createdAffairId, setCreatedAffairId] = useState<number>(null);

  const router = useRouter();
  const [form] = useForm();
  const [createProjectForm] = useForm();

  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    if (isOpen) {
      form.setFieldValue("num_affaire", "");
    }
  }, [isOpen]);

  useEffect(() => {
    getGdpPythagoreAffaires().then((res) => {
      if (isRequestSuccessful(res.status) && res?.data?.length) {
        setPythagoreAffairs(res.data);
        setPythagoreAffairsSearchList(res.data.slice(0, 10));
      }
    });
  }, []);

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

  const onCreateProjectForAffairSubmitted = async (values: {
    project_name?: string;
    project?: number;
  }) => {
    setIsCreateProjectForAffairLoading(true);

    const newProjectName =
      values?.project_name || `Projet - ${affairToCreate.libelle_affaire}`;

    let createProjectRes: { status: number; data?: Partial<GdpProjectsModel> } =
      { status: 400 };

    if (!values.project) {
      createProjectRes = await createGdpProject({
        name: newProjectName,
        client_company_name: affairToCreate?.nom_client,
        company_entity: (
          userProfile.company_entities as UsCompanyEntitiesUsersModel[]
        )[0].company_entities_id,
      });
    }

    if (
      (isRequestSuccessful(createProjectRes.status) && createProjectRes.data) ||
      values.project
    ) {
      const createAffairRes = await createGdpAffair({
        name: affairToCreate.libelle_affaire,
        company_entity: (
          userProfile.company_entities as UsCompanyEntitiesUsersModel[]
        )[0].company_entities_id,
        projects_id: values.project ? values.project : createProjectRes.data.id,
      });

      if (isRequestSuccessful(createAffairRes.status)) {
        await createGdpAffairPythagoreAffair({
          affairs_id: createAffairRes.data.id,
          pythagore_affaires_id: affairToCreate.numero_affaire,
        }).then((res) => {
          if (isRequestSuccessful(res.status)) {
            setCreatedAffairId(createAffairRes.data.id);
            setIsCreateProjectForAffairLoading(false);
            setIsCreateProjectForAffairModalOpen(false);
            setCreatedProjectResultError(false);
            setIsResultModalOpen(true);
            return;
          } else {
            setIsCreateProjectForAffairLoading(false);
            setCreatedProjectResultError(true);
            return setIsResultModalOpen(true);
          }
        });
      } else {
        setIsCreateProjectForAffairLoading(false);
        setCreatedProjectResultError(true);
        return setIsResultModalOpen(true);
      }
    } else {
      setIsCreateProjectForAffairLoading(false);
      setCreatedProjectResultError(true);
      return setIsResultModalOpen(true);
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
        title={`Ajouter des données CERBE`}
      >
        <Form
          onFinish={onSubmit}
          layout={"vertical"}
          style={{ marginTop: 20 }}
          form={form as any}
        >
          <Form.Item label="Sélectionnez une affaire" name={"affair"}>
            <Select
              showSearch
              filterOption={false}
              placeholder={"Affaire"}
              style={{ width: "100%" }}
              options={affairs.map((affair) => ({
                label: affair?.name,
                value: affair?.id,
              }))}
              onChange={() => {
                form.setFieldValue("num_affaire", null);
              }}
            />
          </Form.Item>
          <Form.Item
            label={"Ou sélectionnez un n° / nom d'affaire pythagore"}
            name={"num_affaire"}
          >
            <Select
              showSearch
              filterOption={false}
              placeholder={
                "Selectionnez un n° ou un nom d'affaire pythagore pythagore"
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

          <div style={{ display: "flex", marginTop: 10 }}>
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
          </div>
        </Form>
      </Modal>

      <Modal
        closable
        destroyOnClose
        open={isCreateProjectForAffairModalOpen}
        onCancel={() => setIsCreateProjectForAffairModalOpen(false)}
        title={`Souhaitez vous créer un projet ?`}
        width={"40%"}
        footer={null}
      >
        <p>
          L'affaire <strong>{affairToCreate.libelle_affaire}</strong> n'est
          associée à aucun projet, souhaitez-vous créer un projet immédiatement
          ? <br /> L'affaire sera liée automatiquement au projet créé.
        </p>
        <Divider />
        <Form
          onFinish={onCreateProjectForAffairSubmitted}
          layout={"vertical"}
          style={{ marginTop: 20 }}
          form={createProjectForm}
        >
          <Form.Item
            label={"Selectionnez un nom pour le projet."}
            name={"project_name"}
          >
            <Input
              placeholder={`Projet - ${affairToCreate.libelle_affaire}`}
              onChange={(e) => {
                if (e.target.value.length > 0) {
                  createProjectForm.setFieldValue("project", null);
                }
              }}
            ></Input>
          </Form.Item>
          <Form.Item
            label={"Ou choisissez un projet existant."}
            name={"project"}
          >
            <Select
              showSearch
              filterOption={false}
              placeholder={"Selectionnez un project existant"}
              options={userProjectsSearchList?.map((project) => ({
                label: `${project?.name}`,
                value: project?.id,
              }))}
              onSearch={(value) => {
                setUserProjectsSearchList(
                  userProjects
                    .filter((userProject) =>
                      userProject.name
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    )
                    .slice(0, 10),
                );
              }}
              onChange={() => {
                createProjectForm.setFieldValue("project_name", null);
              }}
              notFoundContent={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={"Aucun projet trouvé"}
                />
              }
            />
          </Form.Item>
          <div style={{ display: "flex", marginTop: 10 }}>
            <Button
              small
              htmlType={"submit"}
              loading={isCreateProjectForAffairLoading}
            >
              Confirmer
            </Button>
            <Button
              small
              style={"text"}
              onClick={() => setIsCreateProjectForAffairModalOpen(false)}
              loading={isCreateProjectForAffairLoading}
            >
              Annuler
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        closable
        destroyOnClose
        open={isResultModalOpen}
        onCancel={() => setIsResultModalOpen(false)}
        width={"40%"}
        footer={null}
      >
        <Result
          status={createdProjectResultError ? "warning" : "success"}
          title={
            createdProjectResultError
              ? "Une erreur est survenue lors de la création du projet."
              : "Projet créé avec succès !"
          }
          subTitle={
            createdProjectResultError
              ? messages.general.error()
              : `L'affaire ${affairToCreate?.libelle_affaire} a été créée avec succès.`
          }
          extra={[
            <div
              style={{
                display: "inline-flex",
                gap: 20,
              }}
            >
              {!createdProjectResultError && (
                <Button
                  style={"primary"}
                  small
                  onClick={() => router.push(`/cerbe/${createdAffairId}`)}
                >
                  Aller au formulaire CERBE
                </Button>
              )}

              <Button
                key="cancel"
                style={"secondary"}
                small
                onClick={() => setIsResultModalOpen(false)}
              >
                Retour
              </Button>
            </div>,
          ]}
        ></Result>
      </Modal>
    </>
  );
};

export default CreateCerbeModal;
