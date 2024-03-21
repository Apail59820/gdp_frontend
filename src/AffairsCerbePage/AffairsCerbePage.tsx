import styles from "./AffairsCerbe.module.scss";
import React from "react";
import { Collapse, CollapseProps, Divider, Form, Input } from "antd";
import { GdpAffairModel } from "../../models/GestionDeProjets/GdpAffairModel";
import GeneralitiesForm from "./Forms/GeneralitiesForm";
import BiodiversityForm from "./Forms/BiodiversityForm";
import EnergyForm from "./Forms/EnergyForm";
import CarbonForm from "./Forms/CarbonForm";
import ResourcesForm from "./Forms/ResourcesForm";
import TechnicalForm from "./Forms/TechnicalForm";

type Props = {
  affair: Partial<GdpAffairModel>;
};
const AffairsCerbePage = ({ affair }: Props) => {
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
            <GeneralitiesForm />
          </Collapse.Panel>
          <Collapse.Panel
            key={2}
            className={styles.biodiversity_collapse}
            header={"Biodiversité"}
          >
            <BiodiversityForm />
          </Collapse.Panel>
          <Collapse.Panel
            key={3}
            className={styles.energy_collapse}
            header={"Énergie"}
          >
            <EnergyForm />
          </Collapse.Panel>
          <Collapse.Panel
            key={4}
            className={styles.carbon_collapse}
            header={"Carbone"}
          >
            <CarbonForm />
          </Collapse.Panel>
          <Collapse.Panel
            key={5}
            className={styles.resources_collapse}
            header={"Ressources"}
          >
            <ResourcesForm />
          </Collapse.Panel>
          <Collapse.Panel
            key={6}
            className={styles.technical_collapse}
            header={"Technique"}
          >
            <TechnicalForm />
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default AffairsCerbePage;
