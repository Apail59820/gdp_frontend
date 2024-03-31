import styles from "./AffairsCerbe.module.scss";
import React, {useEffect, useState} from "react";
import {Collapse, Divider, message, Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import {GdpAffairModel} from "../../models/GestionDeProjets/GdpAffairModel";
import GeneralitiesForm from "./Forms/GeneralitiesForm";
import BiodiversityForm from "./Forms/BiodiversityForm";
import EnergyForm from "./Forms/EnergyForm";
import CarbonForm from "./Forms/CarbonForm";
import ResourcesForm from "./Forms/ResourcesForm";
import TechnicalForm from "./Forms/TechnicalForm";
import {
    useCreateGdpCerbGeneralities,
    useGdpCerbGeneralities,
    useUpdateGdpCerbGeneralities,
} from "../../services/gestionDeProjets/CERBE/GdpCerbGeneralities";
import {
    useCreateGdpCerbBiodiversity,
    useGdpCerbBiodiversity,
    useUpdateGdpCerbBiodiversity,
} from "../../services/gestionDeProjets/CERBE/GdbCerbBiodiversity";
import {
    useCreateGdpCerbEnergy,
    useGdpCerbEnergy,
    useUpdateGdpCerbEnergy,
} from "../../services/gestionDeProjets/CERBE/GdpCerbEnergy";
import {
    useCreateGdpCerbCarbon,
    useGdpCerbCarbon,
    useUpdateGdpCerbCarbon,
} from "../../services/gestionDeProjets/CERBE/GdpCerbCarbon";
import {
    useCreateGdpCerbRessources,
    useGdpCerbRessources,
    useUpdateGdpCerbRessources,
} from "../../services/gestionDeProjets/CERBE/GdpCerbRessources";
import {
    useCreateGdpCerbTechnical,
    useGdpCerbTechnical,
    useUpdateGdpCerbTechnical,
} from "../../services/gestionDeProjets/CERBE/GdpCerbTechnical";
import {Button} from "projex-ui";
import {GdpCerbGeneralitiesModel} from "../../models/GestionDeProjets/CERBE/GdpCerbGeneralitiesModel";
import {GdpCerbBiodiversityModel} from "../../models/GestionDeProjets/CERBE/GdpCerbBiodiversityModel";
import {GdpCerbEnergyModel} from "../../models/GestionDeProjets/CERBE/GdpCerbEnergyModel";
import {GdpCerbCarbonModel} from "../../models/GestionDeProjets/CERBE/GdpCerbCarbonModel";
import {GdpCerbRessourcesModel} from "../../models/GestionDeProjets/CERBE/GdpCerbRessourcesModel";
import {GdpCerbTechnicalModel} from "../../models/GestionDeProjets/CERBE/GdpCerbTechnicalModel";
import {messages} from "../../constants/messages";
import {isRequestSuccessful} from "../../utils/isRequestSuccessful";
import {useQueryClient} from "@tanstack/react-query";
import {GdpProjectsModel} from "../../models/GestionDeProjets/GdpProjectsModel";
import {getGdpProjects} from "../../services/gestionDeProjets/GdpProjects";
import PowerIcon from "../../public/Icon-power.svg";
import ResourcesIcon from "../../public/Icon-resources.svg";
import CarbonIcon from "../../public/Icon-carbon.svg";
import BiodiversityIcon from "../../public/Icon-biodiversity.svg";

type Props = {
    affair: Partial<GdpAffairModel>;
};
const AffairsCerbePage = ({affair}: Props) => {
    const generalities_query = useGdpCerbGeneralities({
        filter: {
            affairs_id: {_eq: affair?.id},
        },
    });

    const biodiversity_query = useGdpCerbBiodiversity({
        filter: {
            affairs_id: {_eq: affair?.id},
        },
    });

    const energy_query = useGdpCerbEnergy({
        filter: {
            affairs_id: {_eq: affair?.id},
        },
    });

    const carbon_query = useGdpCerbCarbon({
        filter: {
            affairs_id: {_eq: affair?.id},
        },
    });

    const resources_query = useGdpCerbRessources({
        filter: {
            affairs_id: {_eq: affair?.id},
        },
    });

    const technical_query = useGdpCerbTechnical({
        filter: {
            affairs_id: {_eq: affair?.id},
        },
    });

    const [generalitiesFormData, setGeneralitiesFormData] = useState<
        Partial<GdpCerbGeneralitiesModel>
    >({});
    const [biodiversityFormData, setBiodiversityFormData] = useState<
        Partial<GdpCerbBiodiversityModel>
    >({});
    const [energyFormData, setEnergyFormData] = useState<
        Partial<GdpCerbEnergyModel>
    >({});
    const [carbonFormData, setCarbonFormData] = useState<
        Partial<GdpCerbCarbonModel>
    >({});
    const [resourcesFormData, setResourcesFormData] = useState<
        Partial<GdpCerbRessourcesModel>
    >({});
    const [technicalFormData, setTechnicalFormData] = useState<
        Partial<GdpCerbTechnicalModel>
    >({});

    const createGeneralitiesMutation = useCreateGdpCerbGeneralities();
    const createBiodiversityMutation = useCreateGdpCerbBiodiversity();
    const createEnergyMutation = useCreateGdpCerbEnergy();
    const createCarbonMutation = useCreateGdpCerbCarbon();
    const createResourcesMutation = useCreateGdpCerbRessources();
    const createTechnicalMutation = useCreateGdpCerbTechnical();

    const [activeKey, setActiveKey] = useState([1, 2, 3, 4, 5, 6]);

    const updateGeneralitiesMutation = useUpdateGdpCerbGeneralities();
    const updateBiodiversityMutation = useUpdateGdpCerbBiodiversity();
    const updateEnergyMutation = useUpdateGdpCerbEnergy();
    const updateCarbonMutation = useUpdateGdpCerbCarbon();
    const updateResourcesMutation = useUpdateGdpCerbRessources();
    const updateTechnicalMutation = useUpdateGdpCerbTechnical();

    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [projectAffair, setProjectAffair] = useState<Partial<GdpProjectsModel>>(
        {},
    );

    const dispatchKeys = (key: any) => {
        setActiveKey(key);
    };

    useEffect(() => {
        if (affair?.id) {
            getGdpProjects({filter: {id: {_eq: affair.projects_id}}}).then(
                (res) => {
                    if (isRequestSuccessful(res.status) && res.data?.length) {
                        setProjectAffair(res.data[0]);
                    }
                },
            );
        }
    }, [affair]);
    const submitForms = async () => {
        setIsLoading(true);
        const generalitiesMutation = generalities_query.cerb_generalities?.length
            ? await updateGeneralitiesMutation.mutateAsync({
                ...generalitiesFormData,
                affairs_id: affair?.id,
                id: generalities_query.cerb_generalities[0]?.id,
            })
            : await createGeneralitiesMutation.mutateAsync({
                ...generalitiesFormData,
                affairs_id: affair?.id,
            });

        if (!isRequestSuccessful(generalitiesMutation.status)) {
            setIsLoading(false);
            return message.error(messages.general.error());
        }

        dispatchKeys(activeKey.splice(1));

        const biodiversityMutation = biodiversity_query.cerb_biodiversity?.length
            ? await updateBiodiversityMutation.mutateAsync({
                ...biodiversityFormData,
                affairs_id: affair?.id,
                id: biodiversity_query.cerb_biodiversity[0]?.id,
            })
            : await createBiodiversityMutation.mutateAsync({
                ...biodiversityFormData,
                affairs_id: affair?.id,
            });

        dispatchKeys(activeKey.splice(2));

        if (!isRequestSuccessful(biodiversityMutation.status)) {
            setIsLoading(false);
            return message.error(messages.general.error());
        }

        const energyMutation = energy_query.cerb_energy?.length
            ? await updateEnergyMutation.mutateAsync({
                ...energyFormData,
                affairs_id: affair?.id,
                id: energy_query.cerb_energy[0]?.id,
            })
            : await createEnergyMutation.mutateAsync({
                ...energyFormData,
                affairs_id: affair?.id,
            });

        dispatchKeys(activeKey.splice(3));

        if (!isRequestSuccessful(energyMutation.status)) {
            setIsLoading(false);
            return message.error(messages.general.error());
        }

        const carbonMutation = carbon_query.cerb_carbon?.length
            ? await updateCarbonMutation.mutateAsync({
                ...carbonFormData,
                affairs_id: affair?.id,
                id: carbon_query.cerb_carbon[0]?.id,
            })
            : await createCarbonMutation.mutateAsync({
                ...carbonFormData,
                affairs_id: affair?.id,
            });

        dispatchKeys(activeKey.splice(4));

        if (!isRequestSuccessful(carbonMutation.status)) {
            setIsLoading(false);
            return message.error(messages.general.error());
        }

        const resourcesMutation = resources_query.cerb_ressources?.length
            ? await updateResourcesMutation.mutateAsync({
                ...resourcesFormData,
                affairs_id: affair?.id,
                id: resources_query.cerb_ressources[0]?.id,
            })
            : await createResourcesMutation.mutateAsync({
                ...resourcesFormData,
                affairs_id: affair?.id,
            });

        dispatchKeys(activeKey.splice(5));

        if (!isRequestSuccessful(resourcesMutation.status)) {
            setIsLoading(false);
            return message.error(messages.general.error());
        }

        const technicalMutation = technical_query.cerb_technical?.length
            ? await updateTechnicalMutation.mutateAsync({
                ...technicalFormData,
                affairs_id: affair?.id,
                id: technical_query.cerb_technical[0]?.id,
            })
            : await createTechnicalMutation.mutateAsync({
                ...technicalFormData,
                affairs_id: affair?.id,
            });

        dispatchKeys(activeKey.splice(6));

        if (!isRequestSuccessful(technicalMutation.status)) {
            setIsLoading(false);
            return message.error(messages.general.error());
        }

        setIsLoading(false);
        [
            "generalities",
            "carbon",
            "energy",
            "technical",
            "biodiversity",
            "ressources",
        ].map(async (t) => {
            await queryClient.invalidateQueries({queryKey: [`cerb_${t}`]});
        });
        message.success("Données CERBE ajoutées avec succès.");
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className="page">
            <div className={styles.affairsCerbePage}>
                <h1 className={styles.title}>Formulaire de données CERBE {currentYear}</h1>
                <Divider/>
                <h4 style={{fontWeight: 200}}>
                    Projet{"  "}
                    <strong>{projectAffair?.name}</strong> {"  > "}
                    Affaire{" "}
                    <strong>{affair?.name}</strong>
                </h4>
                <Collapse
                    style={{marginBottom: "20px"}}
                    defaultActiveKey={[1, 2, 3, 4, 5, 6]}
                    activeKey={activeKey}
                    onChange={(e) => {
                        setActiveKey(e as never);
                    }}
                >
                    <Collapse.Panel
                        key={1}
                        className={styles.generalities_collapse}
                        header={"Généralités"}
                        collapsible={generalities_query.isLoading ? "disabled" : "header"}
                    >
                        {!generalities_query.isLoading ? (
                            <>
                                <GeneralitiesForm
                                    generalities={generalities_query.cerb_generalities?.length
                                        ? generalities_query.cerb_generalities[0]
                                        : {}}
                                    onFormChange={(updatedData) => {
                                        setGeneralitiesFormData({
                                            ...generalitiesFormData,
                                            ...updatedData,
                                        });
                                    }}
                                    affairNameProps={affair?.name}
                                    affairContractingAuthorityProps={projectAffair?.client_company_name}/>
                            </>
                        ) : (
                             <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin rev={undefined} />} />
                        )}
                    </Collapse.Panel>
                    <Collapse.Panel
                        key={4}
                        className={styles.carbon_collapse}
                        header={"Carbone"}
                        collapsible={carbon_query.isLoading ? "disabled" : "header"}
                    >
                        {!carbon_query.isLoading ? (
                            <>
                                <img src={CarbonIcon.src} width={50} alt="power icon"/>
                                <CarbonForm
                                    carbon={
                                        carbon_query.cerb_carbon?.length
                                            ? carbon_query.cerb_carbon[0]
                                            : {}
                                    }
                                    onFormChange={(updatedData) => {
                                        setCarbonFormData({
                                            ...carbonFormData,
                                            ...updatedData,
                                        });
                                    }}
                                /></>
                        ) : (
                            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin rev={undefined} />} />
                        )}
                    </Collapse.Panel>
                    <Collapse.Panel
                        key={3}
                        className={styles.energy_collapse}
                        header={"Énergie"}
                        collapsible={energy_query.isLoading ? "disabled" : "header"}
                    >
                        {!energy_query.isLoading ? (
                            <>
                                <img src={PowerIcon.src} width={50} alt="power icon"/>
                                <EnergyForm
                                    energy={
                                        energy_query.cerb_energy?.length
                                            ? energy_query.cerb_energy[0]
                                            : {}
                                    }
                                    onFormChange={(updatedData) => {
                                        setEnergyFormData({
                                            ...energyFormData,
                                            ...updatedData,
                                        });
                                    }}
                                /></>
                        ) : (
                            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin rev={undefined} />} />
                        )}
                    </Collapse.Panel>
                    <Collapse.Panel
                        key={5}
                        className={styles.resources_collapse}
                        header={"Ressources"}
                        collapsible={resources_query.isLoading ? "disabled" : "header"}
                    >
                        {!resources_query.isLoading ? (
                            <>
                                <img src={ResourcesIcon.src} width={50} alt="power icon"/>
                                <ResourcesForm
                                    resources={
                                        resources_query.cerb_ressources?.length
                                            ? resources_query.cerb_ressources[0]
                                            : {}
                                    }
                                    onFormChange={(updatedData) => {
                                        setResourcesFormData({
                                            ...resourcesFormData,
                                            ...updatedData,
                                        });
                                    }}
                                /></>
                        ) : (
                            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin rev={undefined} />} />
                        )}
                    </Collapse.Panel>
                    <Collapse.Panel
                        key={2}
                        className={styles.biodiversity_collapse}
                        header={"Biodiversité"}
                        collapsible={biodiversity_query.isLoading ? "disabled" : "header"}
                    >
                        {!biodiversity_query.isLoading ? (
                            <>
                                <img src={BiodiversityIcon.src} width={50} alt="power icon"/>
                                <BiodiversityForm
                                    biodiversity={
                                        biodiversity_query.cerb_biodiversity?.length
                                            ? biodiversity_query.cerb_biodiversity[0]
                                            : {}
                                    }
                                    onFormChange={(updatedData) => {
                                        setBiodiversityFormData({
                                            ...biodiversityFormData,
                                            ...updatedData,
                                        });
                                    }}
                                /></>
                        ) : (
                            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin rev={undefined} />} />
                        )}
                    </Collapse.Panel>
                    <Collapse.Panel
                        key={6}
                        className={styles.technical_collapse}
                        header={"Technique"}
                        collapsible={technical_query.isLoading ? "disabled" : "header"}
                    >
                        {!technical_query.isLoading ? (
                            <TechnicalForm
                                technical={
                                    technical_query.cerb_technical?.length
                                        ? technical_query.cerb_technical[0]
                                        : {}
                                }
                                onFormChange={(updatedData) => {
                                    setTechnicalFormData({
                                        ...technicalFormData,
                                        ...updatedData,
                                    });
                                }}
                            />
                        ) : (
                            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin rev={undefined} />} />
                        )}
                    </Collapse.Panel>
                </Collapse>
                <div style={{display: "flex", justifyContent: "end"}}>
                    <Button style={"primary"} onClick={submitForms} loading={isLoading}>
                        Enregistrer mes données
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AffairsCerbePage;
