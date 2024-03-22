import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { GdpCerbRessourcesModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbRessourcesModel";

type Props = {
  resources: Partial<GdpCerbRessourcesModel>;
  onFormChange: (updatedData: Partial<GdpCerbRessourcesModel>) => void;
};
const ResourcesForm = ({ resources, onFormChange }: Props) => {
  const [rainwaterHarvestingTankCapacity, setRainwaterHarvestingTankCapacity] =
    useState<number>(resources?.rainwater_harvesting_tank_capacity || null);

  const [
    initialParcelPermeabilityCoefficient,
    setInitialParcelPermeabilityCoefficient,
  ] = useState<number>(
    resources?.initial_plot_permeability_coefficient || null,
  );

  const [
    projectParcelPermeabilityCoefficient,
    setProjectParcelPermeabilityCoefficient,
  ] = useState<number>(
    resources?.project_plot_permeability_coefficient || null,
  );

  useEffect(() => {
    onFormChange({
      rainwater_harvesting_tank_capacity: rainwaterHarvestingTankCapacity,
      initial_plot_permeability_coefficient:
        initialParcelPermeabilityCoefficient,
      project_plot_permeability_coefficient:
        projectParcelPermeabilityCoefficient,
    });
  }, [
    rainwaterHarvestingTankCapacity,
    initialParcelPermeabilityCoefficient,
    projectParcelPermeabilityCoefficient,
  ]);

  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Capacité de la cuve de récupération d'eau de pluie [en m³]"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={resources?.rainwater_harvesting_tank_capacity}
        name={"rainwater_harvesting_tank_capacity"}
      >
        <Input
          value={rainwaterHarvestingTankCapacity}
          onChange={(e) =>
            setRainwaterHarvestingTankCapacity(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"Coefficient perméabilité parcelle initial"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={resources?.initial_plot_permeability_coefficient}
        name={"initial_parcel_permeability_coefficient"}
      >
        <Input
          value={initialParcelPermeabilityCoefficient}
          onChange={(e) =>
            setInitialParcelPermeabilityCoefficient(
              parseInt(e.target.value, 10),
            )
          }
        />
      </Form.Item>
      <Form.Item
        label={"Coefficient perméabilité parcelle projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={resources.project_plot_permeability_coefficient}
        name={"project_parcel_permeability_coefficient"}
      >
        <Input
          value={projectParcelPermeabilityCoefficient}
          onChange={(e) =>
            setProjectParcelPermeabilityCoefficient(
              parseInt(e.target.value, 10),
            )
          }
        />
      </Form.Item>
    </Form>
  );
};

export default ResourcesForm;
