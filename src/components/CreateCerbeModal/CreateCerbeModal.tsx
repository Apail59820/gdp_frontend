import { Empty, Form, message, Modal, Select } from "antd";
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

  const router = useRouter();
  const [form] = useForm();
  const [createProjectForm] = useForm();
  const [createAffairForm] = useForm();

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
                  onClick={() => setCreateAffairModalOpen(true)}
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
      />

      <CreateAffairModal
        isOpen={createAffairModalOpen}
        setIsOpen={setCreateAffairModalOpen}
        onFormSubmitted={onCreateProjectForAffairSubmitted}
        userProjects={userProjects}
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
