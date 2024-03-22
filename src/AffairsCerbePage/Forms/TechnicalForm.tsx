import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { GdpCerbTechnicalModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbTechnicalModel";

type Props = {
  technical: Partial<GdpCerbTechnicalModel>;
  onFormChange: (updatedData: Partial<GdpCerbTechnicalModel>) => void;
};
const TechnicalForm = ({ technical, onFormChange }: Props) => {
  const [hvac, setHvac] = useState<string>(technical?.hvac || null);

  const [electricity, setElectricity] = useState<string>(
    technical?.electricity || null,
  );

  const [structure, setStructure] = useState<string>(
    technical?.structure || null,
  );

  const [envelope, setEnvelope] = useState<string>(technical?.envelope || null);

  const [interiorFinishes, setInteriorFinishes] = useState<string>(
    technical?.interior_finishes || null,
  );

  const [other, setOther] = useState<string>(technical?.other || null);

  useEffect(() => {
    onFormChange({
      hvac: hvac,
      electricity: electricity,
      structure: structure,
      envelope: envelope,
      interior_finishes: interiorFinishes,
      other: other,
    });
  }, [hvac, electricity, structure, envelope, interiorFinishes, other]);

  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"CVC"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={technical?.hvac}
        name={"hvac"}
      >
        <Input value={hvac} onChange={(e) => setHvac(e.target.value)} />
      </Form.Item>
      <Form.Item
        label={"Electricité"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={technical?.electricity}
        name={"electricity"}
      >
        <Input
          value={electricity}
          onChange={(e) => setElectricity(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={"Structure"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={technical?.structure}
        name={"structure"}
      >
        <Input
          value={structure}
          onChange={(e) => setStructure(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={"Enveloppe"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={technical?.envelope}
        name={"envelope"}
      >
        <Input value={envelope} onChange={(e) => setEnvelope(e.target.value)} />
      </Form.Item>
      <Form.Item
        label={"Finitions interieures"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={technical?.interior_finishes}
        name={"interior_finishes"}
      >
        <Input
          value={interiorFinishes}
          onChange={(e) => setInteriorFinishes(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={"Autres"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={technical?.other}
        name={"other"}
      >
        <Input value={other} onChange={(e) => setOther(e.target.value)} />
      </Form.Item>
    </Form>
  );
};

export default TechnicalForm;
