import { Form, Input } from "antd";
import React, { useState } from "react";
import { GdpCerbBiodiversityModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbBiodiversityModel";

type Props = {
  biodiversity: Partial<GdpCerbBiodiversityModel>;
};
const BiodiversityForm = ({ biodiversity }: Props) => {
  const [totalPlotArea, setTotalPlotArea] = useState<number>(
    biodiversity?.total_plot_area | 0,
  );

  const [
    initialBiotopeSurfaceCoefficient,
    setInitialBiotopeSurfaceCoefficient,
  ] = useState<number>(biodiversity?.initial_biotope_surface_coefficient | 0);

  const [
    projectBiotopeSurfaceCoefficient,
    setProjectBiotopeSurfaceCoefficient,
  ] = useState<number>(biodiversity?.project_biotope_surface_coefficient | 0);

  const [
    initialSurfaceThermalRefreshmentCoefficient,
    setInitialSurfaceThermalRefreshmentCoefficient,
  ] = useState<number>(
    biodiversity?.initial_surface_thermal_refreshment_coefficient | 0,
  );

  const [
    projectSurfaceThermalRefreshmentCoefficient,
    setProjectSurfaceThermalRefreshmentCoefficient,
  ] = useState<number>(
    biodiversity?.project_surface_thermal_refreshment_coefficient | 0,
  );

  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Surface parcelle totale"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={biodiversity?.total_plot_area}
        name={"total_plot_area"}
      >
        <Input
          value={totalPlotArea}
          onChange={(e) => setTotalPlotArea(parseInt(e.target.value, 10))}
        />
      </Form.Item>
      <Form.Item
        label={"CBS Initial"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={biodiversity?.initial_biotope_surface_coefficient}
        name={"initial_biotope_surface_coefficient"}
      >
        <Input
          value={initialBiotopeSurfaceCoefficient}
          onChange={(e) =>
            setInitialBiotopeSurfaceCoefficient(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"CBS Projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={biodiversity?.project_biotope_surface_coefficient}
        name={"project_biotope_surface_coefficient"}
      >
        <Input
          value={projectBiotopeSurfaceCoefficient}
          onChange={(e) =>
            setProjectBiotopeSurfaceCoefficient(parseInt(e.target.value, 10))
          }
        />
      </Form.Item>
      <Form.Item
        label={"CRTS Initial"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={
          biodiversity?.initial_surface_thermal_refreshment_coefficient
        }
        name={"initial_surface_thermal_refreshment_coefficient"}
      >
        <Input
          value={initialSurfaceThermalRefreshmentCoefficient}
          onChange={(e) =>
            setInitialSurfaceThermalRefreshmentCoefficient(
              parseInt(e.target.value, 10),
            )
          }
        />
      </Form.Item>
      <Form.Item
        label={"CRTS Projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={
          biodiversity?.project_surface_thermal_refreshment_coefficient
        }
        name={"project_surface_thermal_refreshment_coefficient"}
      >
        <Input
          value={projectSurfaceThermalRefreshmentCoefficient}
          onChange={(e) =>
            setProjectSurfaceThermalRefreshmentCoefficient(
              parseInt(e.target.value, 10),
            )
          }
        />
      </Form.Item>
    </Form>
  );
};

export default BiodiversityForm;
