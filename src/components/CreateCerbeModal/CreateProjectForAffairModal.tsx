import { Divider, Empty, Form, FormInstance, Input, Modal, Select } from "antd";
import { Button } from "projex-ui";
import React, { useEffect, useState } from "react";
import { GdpPythagoreAffaireModel } from "../../../models/GestionDeProjets/GdpPythagoreAffaireModel";
import { GdpProjectsModel } from "../../../models/GestionDeProjets/GdpProjectsModel";
import { createGdpProject } from "../../../services/gestionDeProjets/GdpProjects";
import { UsCompanyEntitiesUsersModel } from "../../../models/UserService/UsCompanyEntitiesUsersModel";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";
import { createGdpAffair } from "../../../services/gestionDeProjets/GdpAffairs";
import { createGdpAffairPythagoreAffair } from "../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../store/reducers/authReducer";
import { GdpAffairModel } from "../../../models/GestionDeProjets/GdpAffairModel";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affairToCreate: Partial<GdpPythagoreAffaireModel>;
  onSubmit: (error: boolean, created_affair: Partial<GdpAffairModel>) => void;
  userProjects: Partial<GdpProjectsModel>[];
  form: FormInstance<any>;
};
const CreateProjectForAffairModal = ({
  isOpen,
  setIsOpen,
  affairToCreate,
  form,
  userProjects,
  onSubmit,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userProfile = useSelector(selectUserProfile);

  const [userProjectsSearchList, setUserProjectsSearchList] = useState<
    Partial<GdpProjectsModel>[]
  >(userProjects || []);

  useEffect(() => {
    setUserProjectsSearchList(userProjects.slice(0, 10));
  }, [userProjects]);

  const onFormSubmitted = async (values: {
    project_name?: string;
    project?: number;
  }) => {
    setIsLoading(true);

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
            setIsLoading(false);
            setIsOpen(false);
            return onSubmit(false, createAffairRes.data);
          } else {
            setIsLoading(false);
            setIsOpen(false);
            return onSubmit(true, null);
          }
        });
      } else {
        setIsLoading(false);
        setIsOpen(false);
        return onSubmit(true, null);
      }
    } else {
      setIsLoading(false);
      setIsOpen(false);
      return onSubmit(true, null);
    }
  };

  return (
    <Modal
      closable
      destroyOnClose
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      title={`Souhaitez vous créer un projet ?`}
      width={"40%"}
      footer={null}
    >
      <p>
        L'affaire <strong>{affairToCreate?.libelle_affaire}</strong> n'est
        associée à aucun projet, souhaitez-vous créer un projet immédiatement ?{" "}
        <br /> L'affaire sera liée automatiquement au projet créé.
      </p>
      <Divider />
      <Form
        onFinish={onFormSubmitted}
        layout={"vertical"}
        style={{ marginTop: 20 }}
        form={form}
      >
        <Form.Item
          label={"Selectionnez un nom pour le projet."}
          name={"project_name"}
        >
          <Input
            placeholder={`Projet - ${affairToCreate.libelle_affaire}`}
            onChange={(e) => {
              if (e.target.value.length > 0) {
                form.setFieldValue("project", null);
              }
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={"Ou choisissez un projet existant."} name={"project"}>
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
              form.setFieldValue("project_name", null);
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
  );
};

export default CreateProjectForAffairModal;
