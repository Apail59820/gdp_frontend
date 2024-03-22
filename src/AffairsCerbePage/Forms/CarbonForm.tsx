import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { GdpCerbCarbonModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbCarbonModel";

type Props = {
  carbon: Partial<GdpCerbCarbonModel>;
  onFormChange: (updatedData: Partial<GdpCerbCarbonModel>) => void;
};
const CarbonForm = ({ carbon, onFormChange }: Props) => {
  const [baselineCarbonFootprint, setBaselineCarbonFootprint] =
    useState<number>(carbon?.baseline_carbon_footprint || null);

  const [projectCarbonFootprint, setProjectCarbonFootprint] = useState<number>(
    carbon?.project_carbon_footprint || null,
  );

  const [biobasedMaterialsAmount, setBiobasedMaterialsAmount] =
    useState<number>(carbon?.biobased_materials_amount || null);

  useEffect(() => {
    onFormChange({
      baseline_carbon_footprint: baselineCarbonFootprint,
      project_carbon_footprint: projectCarbonFootprint,
      biobased_materials_amount: biobasedMaterialsAmount,
    });
  }, [
    baselineCarbonFootprint,
    projectCarbonFootprint,
    biobasedMaterialsAmount,
  ]);

  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Empreinte carbone reference kgeqCO²/m²"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={carbon?.baseline_carbon_footprint}
        name={"baseline_carbon_footprint"}
      >
        <Input
          value={baselineCarbonFootprint}
          onChange={(e) =>
            setBaselineCarbonFootprint(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"Empreinte carbone projet kgeqCO²/m²"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={carbon?.project_carbon_footprint}
        name={"project_carbon_footprint"}
      >
        <Input
          value={projectCarbonFootprint}
          onChange={(e) =>
            setProjectCarbonFootprint(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"Quantité matériaux biosourcés [en Kg]"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={carbon?.biobased_materials_amount}
        name={"biobased_materials_amount"}
      >
        <Input
          value={biobasedMaterialsAmount}
          onChange={(e) =>
            setBiobasedMaterialsAmount(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
    </Form>
  );
};

export default CarbonForm;
