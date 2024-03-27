import { Empty, Form, message, Modal, Select } from "antd";
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
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../store/reducers/authReducer";
import { UsCompanyEntitiesUsersModel } from "../../../models/UserService/UsCompanyEntitiesUsersModel";
import { GdpProjectsModel } from "../../../models/GestionDeProjets/GdpProjectsModel";
import CreateProjectForAffairModal from "./CreateProjectForAffairModal";
import CreateAffairModal from "./CreateAffairModal";
import ResultModal from "./ResultModal";

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

  const [createAffairModalOpen, setCreateAffairModalOpen] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateProjectForAffairLoading, setIsCreateProjectForAffairLoading] =
    useState<boolean>(false);
  const [createdProjectResultError, setCreatedProjectResultError] =
    useState<boolean>(false);
  const [isCreateAffairLoading, setIsCreateAffairLoading] =
    useState<boolean>(false);

  const [createdAffairId, setCreatedAffairId] = useState<number>(null);

  const router = useRouter();
  const [form] = useForm();
  const [createProjectForm] = useForm();
  const [createAffairForm] = useForm();

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

  const onCreateAffair = async (values: {
    project_name?: string;
    project?: number;
    affair_name: string;
  }) => {};

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
          <Form.Item
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>Sélectionnez une affaire</span>
                <a
                  style={{
                    marginLeft: "10rem",
                    color: "blue",
                  }}
                >
                  ⮐ Créer une affaire
                </a>
              </div>
            }
            name={"affair"}
          >
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

      <CreateProjectForAffairModal
        isOpen={isCreateProjectForAffairModalOpen}
        setIsOpen={setIsCreateProjectForAffairModalOpen}
        affairToCreate={affairToCreate}
        onSubmit={onCreateProjectForAffairSubmitted}
        userProjects={userProjects}
        form={createProjectForm}
        loading={isCreateProjectForAffairLoading}
      />

      <CreateAffairModal
        isOpen={createAffairModalOpen}
        setIsOpen={setCreateAffairModalOpen}
        onSubmit={onCreateAffair}
        userProjects={userProjects}
        form={createAffairForm}
        loading={isCreateAffairLoading}
      />

      <ResultModal
        isOpen={isResultModalOpen}
        setIsOpen={setIsResultModalOpen}
        error={createdProjectResultError}
        subject={"project"}
        subject_title={"project name"}
        onClickConfirm={() => router.push("/mdr")}
      />
    </>
  );
};

export default CreateCerbeModal;
