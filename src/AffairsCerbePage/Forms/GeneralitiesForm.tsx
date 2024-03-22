import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { GdpCerbGeneralitiesModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbGeneralitiesModel";

type Props = {
  generalities: Partial<GdpCerbGeneralitiesModel>;
  onFormChange: (updatedData: Partial<GdpCerbGeneralitiesModel>) => void;
};
const GeneralitiesForm = ({ generalities, onFormChange }: Props) => {
  const [interlocutor, setInterlocutor] = useState<string>(
    generalities?.interlocutor || null,
  );

  const [affairName, setAffairName] = useState<string>(
    generalities?.project_name || null,
  );

  const [affairContractingAuthority, setAffairContractingAuthority] =
    useState<string>(generalities?.contracting_authority || null);

  const [plotArea, setPlotArea] = useState<number>(
    generalities?.plot_area || null,
  );

  const [floorArea, setFloorArea] = useState<number>(
    generalities?.floor_area || null,
  );

  const [status, setStatus] = useState<string>(generalities?.status || "");

  const [typology, setTypology] = useState<string>(
    generalities?.typology || null,
  );

  const [certificationsLabel, setCertificationsLabel] = useState<string>(
    generalities?.certifications_labels || null,
  );

  useEffect(() => {
    onFormChange({
      interlocutor: interlocutor,
      //affairName: affairName,
      //affairContractingAuthority: affairContractingAuthority,
      plot_area: plotArea,
      floor_area: floorArea,
      status: status,
      typology: typology,
    });
  }, [
    interlocutor,
    affairName,
    affairContractingAuthority,
    plotArea,
    floorArea,
    status,
    typology,
  ]);

  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Interlocuteur"}
        name={"interlocutor"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.interlocutor}
      >
        <Input
          value={interlocutor}
          onChange={(e) => setInterlocutor(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={"Nom du projet"}
        name={"affair_name"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.project_name}
      >
        <Input
          value={affairName}
          onChange={(e) => setAffairName(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={"MOA"}
        name={"affair_contracting_authority"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.contracting_authority}
      >
        <Input
          value={affairContractingAuthority}
          onChange={(e) => setAffairContractingAuthority(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={"Surface parcelle (m²)"}
        name={"plot_area"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.plot_area}
      >
        <Input
          value={plotArea}
          onChange={(e) => setPlotArea(parseInt(e.target.value, 10))}
        />
      </Form.Item>
      <Form.Item
        label={"Surface plancher (m²)"}
        name={"floor_area"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.floor_area}
      >
        <Input
          value={floorArea}
          onChange={(e) => setFloorArea(parseInt(e.target.value, 10))}
        />
      </Form.Item>
      <Form.Item
        label={"Neuf / Rhéa / Mixte ?"}
        name={"status"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.status}
      >
        <Input value={status} onChange={(e) => setStatus(e.target.value)} />
      </Form.Item>
      <Form.Item
        label={"Typologie"}
        name={"typology"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.typology}
      >
        <Input value={typology} onChange={(e) => setTypology(e.target.value)} />
      </Form.Item>
      <Form.Item
        label={"Certifications et label"}
        name={"certifications_label"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.certifications_labels}
      >
        <Input
          value={certificationsLabel}
          onChange={(e) => setCertificationsLabel(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

export default GeneralitiesForm;
