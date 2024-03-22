import styles from "./AffairsCerbe.module.scss";
import React, { useState } from "react";
import { Collapse, Divider, message, Spin } from "antd";
import { GdpAffairModel } from "../../models/GestionDeProjets/GdpAffairModel";
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
import { Button } from "projex-ui";
import { GdpCerbGeneralitiesModel } from "../../models/GestionDeProjets/CERBE/GdpCerbGeneralitiesModel";
import { GdpCerbBiodiversityModel } from "../../models/GestionDeProjets/CERBE/GdpCerbBiodiversityModel";
import { GdpCerbEnergyModel } from "../../models/GestionDeProjets/CERBE/GdpCerbEnergyModel";
import { GdpCerbCarbonModel } from "../../models/GestionDeProjets/CERBE/GdpCerbCarbonModel";
import { GdpCerbRessourcesModel } from "../../models/GestionDeProjets/CERBE/GdpCerbRessourcesModel";
import { GdpCerbTechnicalModel } from "../../models/GestionDeProjets/CERBE/GdpCerbTechnicalModel";
import { messages } from "../../constants/messages";
import { isRequestSuccessful } from "../../utils/isRequestSuccessful";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  affair: Partial<GdpAffairModel>;
};
const AffairsCerbePage = ({ affair }: Props) => {
  const generalities_query = useGdpCerbGeneralities({
    filter: {
      affairs_id: { _eq: affair?.id },
    },
  });

  const biodiversity_query = useGdpCerbBiodiversity({
    filter: {
      affairs_id: { _eq: affair?.id },
    },
  });

  const energy_query = useGdpCerbEnergy({
    filter: {
      affairs_id: { _eq: affair?.id },
    },
  });

  const carbon_query = useGdpCerbCarbon({
    filter: {
      affairs_id: { _eq: affair?.id },
    },
  });

  const resources_query = useGdpCerbRessources({
    filter: {
      affairs_id: { _eq: affair?.id },
    },
  });

  const technical_query = useGdpCerbTechnical({
    filter: {
      affairs_id: { _eq: affair?.id },
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

  const updateGeneralitiesMutation = useUpdateGdpCerbGeneralities();
  const updateBiodiversityMutation = useUpdateGdpCerbBiodiversity();
  const updateEnergyMutation = useUpdateGdpCerbEnergy();
  const updateCarbonMutation = useUpdateGdpCerbCarbon();
  const updateResourcesMutation = useUpdateGdpCerbRessources();
  const updateTechnicalMutation = useUpdateGdpCerbTechnical();

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      await queryClient.invalidateQueries({ queryKey: [`cerb_${t}`] });
    });
    message.success("Données CERBE ajoutées avec succès.");
  };

  return (
    <div className="page">
      <div className={styles.affairsCerbePage}>
        <h1 className={styles.title}>Données CERBE</h1>
        <Divider />
        <h4 style={{ fontWeight: 200 }}>
          Configurer les données CERBE pour l'affaire{" "}
          <strong>{affair?.name}</strong>
        </h4>
        <Collapse
          style={{ marginBottom: "20px" }}
          defaultActiveKey={[1, 2, 3, 4, 5, 6]}
        >
          <Collapse.Panel
            key={1}
            className={styles.generalities_collapse}
            header={"Généralités"}
          >
            {!generalities_query.isLoading ? (
              <GeneralitiesForm
                generalities={
                  generalities_query.cerb_generalities?.length
                    ? generalities_query.cerb_generalities[0]
                    : {}
                }
                onFormChange={(updatedData) => {
                  setGeneralitiesFormData({
                    ...generalitiesFormData,
                    ...updatedData,
                  });
                }}
              />
            ) : (
              <Spin size="large" style={{ marginLeft: "50%" }} />
            )}
          </Collapse.Panel>
          <Collapse.Panel
            key={2}
            className={styles.biodiversity_collapse}
            header={"Biodiversité"}
          >
            {!biodiversity_query.isLoading ? (
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
              />
            ) : (
              <Spin size="large" style={{ marginLeft: "50%" }} />
            )}
          </Collapse.Panel>
          <Collapse.Panel
            key={3}
            className={styles.energy_collapse}
            header={"Énergie"}
          >
            {!energy_query.isLoading ? (
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
              />
            ) : (
              <Spin size="large" style={{ marginLeft: "50%" }} />
            )}
          </Collapse.Panel>
          <Collapse.Panel
            key={4}
            className={styles.carbon_collapse}
            header={"Carbone"}
          >
            {!carbon_query.isLoading ? (
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
              />
            ) : (
              <Spin size="large" style={{ marginLeft: "50%" }} />
            )}
          </Collapse.Panel>
          <Collapse.Panel
            key={5}
            className={styles.resources_collapse}
            header={"Ressources"}
          >
            {!resources_query.isLoading ? (
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
              />
            ) : (
              <Spin size="large" style={{ marginLeft: "50%" }} />
            )}
          </Collapse.Panel>
          <Collapse.Panel
            key={6}
            className={styles.technical_collapse}
            header={"Technique"}
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
              <Spin size="large" style={{ marginLeft: "50%" }} />
            )}
          </Collapse.Panel>
        </Collapse>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button style={"primary"} onClick={submitForms} loading={isLoading}>
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AffairsCerbePage;
