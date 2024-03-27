import {
  Divider,
  Empty,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { GdpProjectsModel } from "../../../models/GestionDeProjets/GdpProjectsModel";
import { Button } from "projex-ui";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../store/reducers/authReducer";
import { GdpAffairModel } from "../../../models/GestionDeProjets/GdpAffairModel";
import { createGdpProject } from "../../../services/gestionDeProjets/GdpProjects";
import { UsCompanyEntitiesUsersModel } from "../../../models/UserService/UsCompanyEntitiesUsersModel";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";
import { createGdpAffair } from "../../../services/gestionDeProjets/GdpAffairs";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFormSubmitted: (
    error: boolean,
    created_affair: Partial<GdpAffairModel>,
  ) => void;
  userProjects: Partial<GdpProjectsModel>[];
  form: FormInstance<any>;
};
const CreateAffairModal = ({
  isOpen,
  setIsOpen,
  onFormSubmitted,
  form,
  userProjects,
}: Props) => {
  const [userProjectsSearchList, setUserProjectsSearchList] = useState<
    Partial<GdpProjectsModel>[]
  >(userProjects || []);

  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    setUserProjectsSearchList(userProjects.slice(0, 10));
  }, [userProjects]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (values: {
    new_affair?: string;
    new_project?: string;
    existing_project: number;
  }) => {
    if (!values.new_project || !values.existing_project) {
      return message.error(
        "Veuillez sélectionner ou créer un projet pour la nouvelle affaire.",
      );
    }

    let createProjectRes: { status: number; data?: Partial<GdpProjectsModel> } =
      { status: 400 };

    if (!values.existing_project) {
      createProjectRes = await createGdpProject({
        name: values.new_project,
        client_company_name: "",
        company_entity: (
          userProfile.company_entities as UsCompanyEntitiesUsersModel[]
        )[0].company_entities_id,
      });
    }

    if (
      (isRequestSuccessful(createProjectRes.status) && createProjectRes.data) ||
      values.existing_project
    ) {
      const createAffairRes = await createGdpAffair({
        name: values.new_affair,
        company_entity: (
          userProfile.company_entities as UsCompanyEntitiesUsersModel[]
        )[0].company_entities_id,
        projects_id: values.existing_project
          ? values.existing_project
          : createProjectRes.data.id,
      });

      if (isRequestSuccessful(createAffairRes.status)) {
        setIsLoading(false);
        setIsOpen(false);
        return onFormSubmitted(false, createAffairRes.data);
      } else {
        setIsLoading(false);
        setIsOpen(false);
        return onFormSubmitted(true, null);
      }
    } else {
      setIsLoading(false);
      setIsOpen(false);
      return onFormSubmitted(true, null);
    }
  };

  return (
    <Modal
      closable
      destroyOnClose
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      title={`Création d'une nouvelle affaire.`}
      width={"40%"}
      footer={null}
    >
      <Form
        onFinish={onSubmit}
        layout={"vertical"}
        style={{ marginTop: 20 }}
        form={form}
      >
        <Form.Item
          label={"Selectionnez un nom pour la nouvelle affaire."}
          name={"new_affair"}
        >
          <Input placeholder={`Nouvelle affaire`}></Input>
        </Form.Item>
        <Divider />
        <Form.Item
          label={"Créez un projet pour la nouvelle affaire"}
          name={"new_project"}
        >
          <Input
            placeholder={`Nouveau projet`}
            onChange={(e) => {
              if (e.target.value.length > 0) {
                form.setFieldValue("existing_project", "");
              }
            }}
          ></Input>
        </Form.Item>
        <Form.Item
          label={"Ou choisissez un projet existant."}
          name={"existing_project"}
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
              form.setFieldValue("new_project", null);
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

export default CreateAffairModal;
