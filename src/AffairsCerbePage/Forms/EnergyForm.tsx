import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { GdpCerbEnergyModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbEnergyModel";

type Props = {
  energy: Partial<GdpCerbEnergyModel>;
  onFormChange: (updatedData: Partial<GdpCerbEnergyModel>) => void;
};
const EnergyForm = ({ energy, onFormChange }: Props) => {
  const [applicableThermalRegulation, setApplicableThermalRegulation] =
    useState<number>(energy?.applicable_thermal_regulation || null);

  const [
    conventionalEnergyConsumptionRef,
    setConventionalEnergyConsumptionRef,
  ] = useState<number>(energy?.conventional_energy_consumption_ref || null);

  const [
    projectConventionalEnergyConsumption,
    setProjectConventionalEnergyConsumption,
  ] = useState<number>(energy?.project_conventional_energy_consumption || null);

  const [energySavings, setEnergySavings] = useState<number>(
    energy?.energy_savings || null,
  );

  const [renewableCecEnergyAmount, setRenewableCecEnergyAmount] =
    useState<number>(energy?.renewable_cec_energy_amount || null);

  const [renewableEnergyAmount, setRenewableEnergyAmount] = useState<number>(
    energy?.renewable_energy_amount || null,
  );

  useEffect(() => {
    onFormChange({
      applicable_thermal_regulation: applicableThermalRegulation,
      conventional_energy_consumption_ref: conventionalEnergyConsumptionRef,
      project_conventional_energy_consumption:
        projectConventionalEnergyConsumption,
      energy_savings: energySavings,
      renewable_cec_energy_amount: renewableCecEnergyAmount,
      renewable_energy_amount: renewableEnergyAmount,
    });
  }, [
    applicableThermalRegulation,
    conventionalEnergyConsumptionRef,
    projectConventionalEnergyConsumption,
    energy,
    renewableCecEnergyAmount,
    renewableEnergyAmount,
  ]);

  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"RT applicable"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.applicable_thermal_regulation}
        name={"applicable_thermal_regulation"}
      >
        <Input
          value={applicableThermalRegulation}
          onChange={(e) =>
            setApplicableThermalRegulation(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"Cep ref kWhep/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.conventional_energy_consumption_ref}
        name={"conventional_energy_consumption_ref"}
      >
        <Input
          value={conventionalEnergyConsumptionRef}
          onChange={(e) =>
            setConventionalEnergyConsumptionRef(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"Cep projet kWhep/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.project_conventional_energy_consumption}
        name={"project_conventional_energy_consumption"}
      >
        <Input
          value={projectConventionalEnergyConsumption}
          onChange={(e) =>
            setProjectConventionalEnergyConsumption(
              parseInt(e.target.value, 10),
            )
          }
        />
      </Form.Item>
      <Form.Item
        label={"Economie d'énergie"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.energy_savings}
        name={"energy_savings"}
      >
        <Input
          value={energySavings}
          onChange={(e) => setEnergySavings(parseInt(e.target.value, 10))}
        />
      </Form.Item>
      <Form.Item
        label={"Qualité énergie renouvelable cep-cepnr en kWh/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.renewable_cec_energy_amount}
        name={"renewable_cec_energy_amount"}
      >
        <Input
          value={renewableCecEnergyAmount}
          onChange={(e) =>
            setRenewableCecEnergyAmount(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"Qualité énergie renouvelable en kWh/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.renewable_energy_amount}
        name={"renewable_energy_amount"}
      >
        <Input
          value={renewableEnergyAmount}
          onChange={(e) =>
            setRenewableEnergyAmount(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
    </Form>
  );
};

export default EnergyForm;
