import styles from "./AffairsCerbe.module.scss";
import React, { useEffect, useState } from "react";
import { Collapse, Divider, Spin } from "antd";
import { GdpAffairModel } from "../../models/GestionDeProjets/GdpAffairModel";
import GeneralitiesForm from "./Forms/GeneralitiesForm";
import BiodiversityForm from "./Forms/BiodiversityForm";
import EnergyForm from "./Forms/EnergyForm";
import CarbonForm from "./Forms/CarbonForm";
import ResourcesForm from "./Forms/ResourcesForm";
import TechnicalForm from "./Forms/TechnicalForm";
import { useGdpCerbGeneralities } from "../../services/gestionDeProjets/CERBE/GdpCerbGeneralities";
import { useGdpCerbBiodiversity } from "../../services/gestionDeProjets/CERBE/GdbCerbBiodiversity";
import { useGdpCerbEnergy } from "../../services/gestionDeProjets/CERBE/GdpCerbEnergy";
import { useGdpCerbCarbon } from "../../services/gestionDeProjets/CERBE/GdpCerbCarbon";
import { useGdpCerbRessources } from "../../services/gestionDeProjets/CERBE/GdpCerbRessources";
import { useGdpCerbTechnical } from "../../services/gestionDeProjets/CERBE/GdpCerbTechnical";
import { Button } from "projex-ui";

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

  const [generalitiesFormData, setGeneralitiesFormData] = useState({});

  return (
    <div className="page">
      <div className={styles.affairsCerbePage}>
        <h1 className={styles.title}>Données CERBE</h1>
        <Divider />
        <h4 style={{ fontWeight: 200 }}>
          Configurer les données CERBE pour l'affaire{" "}
          <strong>{affair?.name}</strong>
        </h4>
        <Collapse style={{ marginBottom: "20px" }}>
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
              />
            ) : (
              <Spin size="large" style={{ marginLeft: "50%" }} />
            )}
          </Collapse.Panel>
        </Collapse>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button style={"primary"}>Envoyer</Button>
        </div>
      </div>
    </div>
  );
};

export default AffairsCerbePage;
