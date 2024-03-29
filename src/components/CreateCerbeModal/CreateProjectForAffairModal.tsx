import {Divider, Empty, Form, FormInstance, Input, Modal, Select, Radio, RadioChangeEvent} from "antd";
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
import {ExclamationOutlined, InfoCircleOutlined, PlusCircleOutlined, ShopOutlined} from "@ant-design/icons";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affairToCreate: Partial<GdpPythagoreAffaireModel>;
  onSubmit: (error: boolean, created_affair: Partial<GdpAffairModel>) => void;
  userProjects: Partial<GdpProjectsModel>[];
  form: FormInstance<any>;
};

type UserUiChoiceType = {
  level1: string;
  level2: string;
};

const defaultUserUiChoice: UserUiChoiceType = {
  level1: 'useProjectChoice',
  level2: 'createProjectChoice',
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
  const [userUiChoice, setUserUiChoice] = useState<UserUiChoiceType>(defaultUserUiChoice);
  const [userProjectsSearchList, setUserProjectsSearchList] = useState<
    Partial<GdpProjectsModel>[]
  >(userProjects || []);

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
      title={`Saisir mes données CERBE − Numéro Pythagore`}
      width={"40%"}
      footer={null}
    >
      <p style={{color: '#002559'}}>
        <InfoCircleOutlined rev={undefined}/> L'affaire <strong>{affairToCreate?.libelle_affaire}</strong> sera créé !
      </p>
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
                <ShopOutlined width={100} rev={undefined}/>{" "}
                <span>Nouveau Projet</span>
              </div>
            </Radio.Button>
            <Radio.Button value={defaultUserUiChoice.level2}>
              <div>
                <PlusCircleOutlined width={100} rev={undefined}/>{" "}
                <span>Rattacher à un Projet</span>
              </div>
            </Radio.Button>
          </Radio.Group>
        </div>
      </>
      <Divider/>
      {userUiChoice.level1 === defaultUserUiChoice.level1 && (
          <Form
              onFinish={onFormSubmitted}
              layout={"vertical"}
              style={{marginTop: 20}}
              form={form}
          >
            <Form.Item
                label={"Selectionnez un nom:"}
                name={"project_name"}
                tooltip={{title: 'Selectionnez un nom pour le projet ou laissez vide pour utiliser le nom par défaut', icon: <InfoCircleOutlined rev={undefined}/>}}
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
      )}
      {userUiChoice.level1 === defaultUserUiChoice.level2 && (
          <Form
              onFinish={onFormSubmitted}
              layout={"vertical"}
              style={{ marginTop: 20 }}
              form={form}
          >
            <Form.Item label={"Nom du projet"} name={"project"}>
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
      )}
    </Modal>
  );
};

export default CreateProjectForAffairModal;
