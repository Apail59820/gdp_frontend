import {
  Divider,
  Empty,
  Form,
  FormInstance,
  Input,
  message,
  Modal, Radio, RadioChangeEvent,
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
import {CheckOutlined, CloseOutlined, InfoCircleOutlined, PlusCircleOutlined, ShopOutlined} from "@ant-design/icons";

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

type UserUiChoiceType = {
  level1: string;
  level2: string;
};

const defaultUserUiChoice = {
  level1: "useAffairChoice",
  level2: "createAffairChoice",
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
      console.log(updatedUserUiChoice)
    }
  }, [userUiChoice.level1, userUiChoice.level2, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUserUiChoice(defaultUserUiChoice);
    }
  }, [isOpen]);
  const onSubmit = async (values: {
    new_affair?: string;
    new_project?: string;
    existing_project: number;
  }) => {
    if (!values.new_project && !values.existing_project) {
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
          title={`Saisir mes données CERBE - Création d'une nouvelle affaire`}
          width={"40%"}
          footer={null}
      >
        <p style={{color: '#002559'}}>
          <InfoCircleOutlined /> Une affaire doit appartenir à un projet, créez&nbsp;ou&nbsp;sélectionnez <br/> un projet à associer à
          votre affaire !
        </p>
        <Divider/>
        <Form
            onFinish={onSubmit}
            layout={"vertical"}
            style={{marginTop: 20}}
            form={form}
        >

          <Form.Item
              label={"Nom de la nouvelle Affaire :"}
              name={"new_affair"}
          >
            <Input placeholder={`Nouvelle affaire`}></Input>
          </Form.Item>
          </Form>
          <Divider/>
        <>
          <h4>Associez un Projet à votre affaire :</h4>
          <div style={{display: "flex"}}>
            <Radio.Group defaultValue={defaultUserUiChoice.level1} buttonStyle="solid" size="large"
                         onChange={(e: RadioChangeEvent) => {
                           handleLevelChange('level1', e.target.value);
                         }}>
              <Radio.Button value={defaultUserUiChoice.level1}>
                <div>
                  <ShopOutlined width={100} />{" "}
                  <span>Projet existant</span>
                </div>
              </Radio.Button>
              <Radio.Button value={defaultUserUiChoice.level2}>
                <div>
                  <PlusCircleOutlined width={100} />{" "}
                  <span>Nouveau Projet</span>
                </div>
              </Radio.Button>
            </Radio.Group>
          </div>
        </>
        <Divider/>
        {userUiChoice.level1 === "useAffairChoice" && (
            <Form
                onFinish={onSubmit}
                layout={"vertical"}
                style={{marginTop: 20}}
                form={form}>
              <Form.Item
                  label={"Selectionnez un Projet existant :"}
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
              <div style={{display: "flex", marginTop: 10}}>
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
        )}
        {userUiChoice.level1 === "createAffairChoice" && (
            <Form
                onFinish={onSubmit}
                layout={"vertical"}
                style={{marginTop: 20}}
                form={form}
            >
              <Form.Item
                  label={"Nom du projet associé à l'affaire :"}
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
              <div style={{display: "flex", marginTop: 10}}>
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
        )}
      </Modal>
  );
};

export default CreateAffairModal;
