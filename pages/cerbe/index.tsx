import styles from "../../styles/Cerbe.module.scss";
import React, { useState } from "react";
import { Skeleton, Row, Col, Statistic, Segmented } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

import HeaderIcon from "../../public/Icon-cerbe-head.svg";
import BodyIcon from "../../public/Icon-cerbe-body.svg";
import PowerIcon from "../../public/Icon-power.svg";
import ResourcesIcon from "../../public/Icon-resources.svg";
import CarbonIcon from "../../public/Icon-carbon.svg";
import BiodiversityIcon from "../../public/Icon-biodiversity.svg";
import DiagonalPict from "../../public/logo-diagobat.svg";
import { getGdpCerbGeneralities } from "../../services/gestionDeProjets/CERBE/GdpCerbGeneralities";
import { isRequestSuccessful } from "../../utils/isRequestSuccessful";
import { average, ratio, sum } from "../../utils/CERBEutils";
import { getGdpCerbEnergy } from "../../services/gestionDeProjets/CERBE/GdpCerbEnergy";
import { getGdpCerbBiodiversity } from "../../services/gestionDeProjets/CERBE/GdbCerbBiodiversity";
import { getGdpCerbRessources } from "../../services/gestionDeProjets/CERBE/GdpCerbRessources";
import { getGdpCerbCarbon } from "../../services/gestionDeProjets/CERBE/GdpCerbCarbon";

const Cerbe = () => {
  const loading = false;
  const formatter = (value: number) => value.toFixed(2);
  const [opacity, setOpacity] = React.useState(0);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const currentYear = new Date().getFullYear();
  const opacityTimeOut = setTimeout(() => {
    setOpacity(1);
    clearTimeout(opacityTimeOut);
  }, 300);

  const handleSegmentedOnChange = (value: string) => {
    if (value === "maxScreen") {
      setIsFullScreen(true);
      setOpacity(1);
    } else setIsFullScreen(false);
    setOpacity(0);
  };

  // fields completion
  const [totalCerbeProjects, setTotalCerbeProjects] = useState<number>();
  const [totalFloorArea, setTotalFloorArea] = useState<number>();
  const [totalPlotArea, setTotalPlotArea] = useState<number>();
  const [totalCerbeCertifiedProjects, setTotalCerbeCertifiedProjects] =
    useState<number>();
  getGdpCerbGeneralities({
    fields: ["certifications_labels", "plot_area", "floor_area"].join(","),
  }).then((res) => {
    if (isRequestSuccessful(res.status)) {
      const allData = Array.from(res.data);
      setTotalCerbeProjects(allData.length);
      setTotalFloorArea(sum(allData.map((data) => data.floor_area)));
      setTotalPlotArea(sum(allData.map((data) => data.plot_area)));
      setTotalCerbeCertifiedProjects(
        allData.filter((data) => data.certifications_labels).length,
      );
    }
  });

  const [gainOnRegulatoryConsumption, setGainOnRegulatoryConsumption] =
    useState<number>();
  const [regulatoryEnergySaving, setRegulatoryEnergySaving] =
    useState<number>();
  const [
    energySavingsEquivTownPopulation,
    setEnergySavingsEquivTownPopulation,
  ] = useState<number>();
  const [renewableEnergyAmount, setRenewableEnergyAmount] = useState<number>();
  getGdpCerbEnergy({
    fields: [
      "conventional_energy_consumption_ref",
      "project_conventional_energy_consumption",
      "renewable_energy_amount",
      "energy_savings",
    ].join(","),
  }).then((res) => {
    if (isRequestSuccessful(res.status)) {
      const allData = res.data;
      const totalCepRef = sum(
        allData.map((data) => data.conventional_energy_consumption_ref),
      );
      const totalProjectCep = sum(
        allData.map((data) =>
          Number(data.project_conventional_energy_consumption),
        ),
      );

      setGainOnRegulatoryConsumption(ratio(totalProjectCep, totalCepRef));
      setRegulatoryEnergySaving(totalCepRef - totalProjectCep);
      setEnergySavingsEquivTownPopulation(
        sum(allData.map((data) => data.energy_savings)),
      );
      setRenewableEnergyAmount(
        sum(allData.map((data) => data.renewable_energy_amount)),
      );
    }
  });

  const [averageProjectCBS, setAverageProjectCBS] = useState<number>();
  const [ratioCBS, setRatioCBS] = useState<number>();
  const [averageProjectCRTS, setAverageProjectCRTS] = useState<number>();
  const [ratioCRTS, setRatioCRTS] = useState<number>();
  getGdpCerbBiodiversity({
    fields: [
      "initial_biotope_surface_coefficient",
      "project_biotope_surface_coefficient",
      "initial_surface_thermal_refreshment_coefficient",
      "project_surface_thermal_refreshment_coefficient",
    ].join(","),
  }).then((res) => {
    if (isRequestSuccessful(res.status)) {
      const allData = res.data;
      const averageInitialCBS = average(
        allData.map((data) => data.initial_biotope_surface_coefficient),
      );
      const averageInitialCRTS = average(
        allData.map(
          (data) => data.initial_surface_thermal_refreshment_coefficient,
        ),
      );
      setAverageProjectCBS(
        average(
          allData.map((data) => data.project_biotope_surface_coefficient),
        ),
      );
      setRatioCBS(ratio(averageProjectCBS, averageInitialCBS));
      setAverageProjectCRTS(
        average(
          allData.map(
            (data) => data.project_surface_thermal_refreshment_coefficient,
          ),
        ),
      );
      setRatioCRTS(ratio(averageProjectCRTS, averageInitialCRTS));
    }
  });

  const [
    totalRainwaterHarvestingTankCapacity,
    setTotalRainwaterHarvestingTankCapacity,
  ] = useState<number>();
  const [plotPermeabilityCoefficient, setPlotPermeabilityCoefficient] =
    useState<number>();
  getGdpCerbRessources({
    fields: [
      "rainwater_harvesting_tank_capacity",
      "project_plot_permeability_coefficient",
      "initial_plot_permeability_coefficient",
    ].join(","),
  }).then((res) => {
    if (isRequestSuccessful(res.status)) {
      const allData = res.data;
      setTotalRainwaterHarvestingTankCapacity(
        sum(allData.map((data) => data.rainwater_harvesting_tank_capacity)),
      );
      const averageProjectPlotPermeabilityCoefficient = average(
        allData.map((data) => data.project_plot_permeability_coefficient),
      );
      const averageInitialPlotPermeabilityCoefficient = average(
        allData.map((data) => data.initial_plot_permeability_coefficient),
      );
      setPlotPermeabilityCoefficient(
        ratio(
          averageProjectPlotPermeabilityCoefficient,
          averageInitialPlotPermeabilityCoefficient,
        ),
      );
    }
  });

  const [totalProjectCarbonFootPrint, setTotalProjectCarbonFootPrint] =
    useState<number>();
  const [totalBaseLineCarbonFootPrint, setTotalBaseLineCarbonFootPrint] =
    useState<number>();
  const [totalBioBasedMaterialsAmount, setTotalBioBasedMaterialsAmount] =
    useState<number>();
  getGdpCerbCarbon({
    fields: [
      "baseline_carbon_footprint",
      "project_carbon_footprint",
      "biobased_materials_amount",
    ].join(","),
  }).then((res) => {
    if (isRequestSuccessful(res.status)) {
      const allData = res.data;
      setTotalBaseLineCarbonFootPrint(
        sum(allData.map((data) => data.baseline_carbon_footprint)),
      );
      setTotalProjectCarbonFootPrint(
        sum(allData.map((data) => data.project_carbon_footprint)),
      );
      console.log(totalProjectCarbonFootPrint);
      setTotalBioBasedMaterialsAmount(
        sum(allData.map((data) => data.biobased_materials_amount)),
      );
    }
  });
  return (
    <>
      <Segmented
        onChange={handleSegmentedOnChange}
        style={{ maxWidth: "100px" }}
        options={[
          {
            value: "minScreen",
            icon: <FullscreenExitOutlined rev={undefined} />,
          },
          {
            value: "maxScreen",
            icon: <FullscreenOutlined rev={undefined} />,
          },
        ]}
      />
      <div className={styles.cerbePage} style={{ opacity: opacity ? 1 : 0 }}>
        {!isFullScreen ? (
          <section>
            <div
              className={`${styles.headerIconContainer} multi`}
              style={{ opacity: opacity ? 1 : 0 }}
            >
              <img
                src={DiagonalPict.src}
                className={styles.headerIcon}
                alt="Diagobat Logo"
              />
              <img
                src={HeaderIcon.src}
                className={styles.headerIcon}
                alt="Diagobat vectorial"
              />
            </div>
            <img
              src={BodyIcon.src}
              className={styles.bodyIcon}
              style={{ opacity: opacity ? 1 : 0 }}
              alt="Diagobat vectorial body"
            />
          </section>
        ) : null}
        <section className={styles.iconsContainer}>
          <div className={styles.iconsContainerContents}>
            <div className={styles.titleElements}>
              <h1>
                IMPACTS {currentYear} <br />
                <span>INDICATEURS PLANET</span>
                <br />
                <br />
              </h1>
            </div>
            {loading ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div className={styles.generalIconElements}>
                <div className={styles.header}>
                  <h2 className={styles.title}>GENERALITES</h2>
                </div>
                <div className={styles.content}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Nombre de projets"
                        value={totalCerbeProjects}
                        formatter={formatter}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Surface plancher totale"
                        value={totalFloorArea}
                        precision={2}
                        formatter={formatter}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Surface parcelle totale"
                        value={totalPlotArea}
                        precision={2}
                        formatter={formatter}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Nombre de projets certifiés"
                        value={totalCerbeCertifiedProjects}
                        precision={2}
                        formatter={formatter}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {loading ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div className={styles.powerIconElements}>
                <div className={styles.header}>
                  <img src={PowerIcon.src} className={styles.img} alt="Iconn" />
                  <h2 className={styles.title}>REDUIRE LE BESOIN EN ENERGIE</h2>
                </div>
                <div className={styles.content}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Gain sur les consommations réglementaire (1-(Cep/Cepref))"
                        value={gainOnRegulatoryConsumption}
                        formatter={formatter}
                      />{" "}
                      %
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Economie d'Energie réglementaire (Cepref-Cep)"
                        value={regulatoryEnergySaving}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                      kWhep/m².an
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Economies d'énergie équivalentes à la conso annuelle d'une ville de "
                        value={energySavingsEquivTownPopulation / 2223}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                      habitants
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Quantité d'Energie Renouvelable produite"
                        value={renewableEnergyAmount}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                      kWhep/an
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {loading ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div className={styles.biodiversityIconElements}>
                <div className={styles.header}>
                  <img
                    src={BiodiversityIcon.src}
                    className={styles.img}
                    alt="Iconn"
                  />
                  <h2 className={styles.title}>AMELIORER LA BIODIVERSITE</h2>
                </div>
                <div className={styles.content}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Coefficient moyen de Biotope par surface finale"
                        value={averageProjectCBS}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Amélioration du CBS par rapport à l'état initial"
                        value={ratioCBS}
                        precision={2}
                        formatter={formatter}
                      />
                      %
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Coefficient moyen de Rafraichissement Thermo-Surfacique*"
                        value={averageProjectCRTS}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Amélioration du RTS par rapport à l'état initial"
                        value={ratioCRTS}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                      %
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Surface équivalente de plantations en pleine terre"
                        value={averageProjectCBS * totalPlotArea}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                      m²
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {loading ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div className={styles.resourcesIconElements}>
                <div className={styles.header}>
                  <img
                    src={ResourcesIcon.src}
                    className={styles.img}
                    alt="Iconn"
                  />
                  <h2 className={styles.title}>PRESERVER LES RESSOURCES</h2>
                </div>
                <div className={styles.content}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Volume cumulé de cuves de récupération des eaux de pluie"
                        value={totalRainwaterHarvestingTankCapacity}
                        formatter={formatter}
                      />
                      m&sup3;
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Coefficient moyen de perméabilité de la parcelle Projet"
                        value={plotPermeabilityCoefficient}
                        precision={2}
                        formatter={formatter}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Amélioration de la perméabilité du sol"
                        value={ratio(plotPermeabilityCoefficient, 1)}
                        precision={2}
                        formatter={formatter}
                      />
                      %
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {loading ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div className={styles.carbonIconElements}>
                <div className={styles.header}>
                  <img
                    src={CarbonIcon.src}
                    className={styles.img}
                    alt="Iconn"
                  />
                  <h2 className={styles.title}>REDUIRE L'EMPREINTE CARBONE</h2>
                </div>
                <div className={styles.content}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Empreinte carbone totale PROJET"
                        value={totalProjectCarbonFootPrint}
                        formatter={formatter}
                      />
                      kgeqCO²/m²
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Gain sur l'empreinte carbone par rapport à la valeur référence"
                        value={ratio(
                          totalProjectCarbonFootPrint,
                          totalBaseLineCarbonFootPrint,
                        )}
                        precision={2}
                        formatter={formatter}
                      />
                      %
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Quantité de matériaux biosourcés"
                        value={totalBioBasedMaterialsAmount}
                        precision={2}
                        formatter={formatter}
                      />
                      kg
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Quantité équivalente stockée de carbone *"
                        value={totalBioBasedMaterialsAmount * 0.47}
                        precision={2}
                        formatter={formatter}
                      />
                      kg CO²
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Soit une forêt agée de 35 ans comptant "
                        value={(totalBioBasedMaterialsAmount * 0.47) / 800}
                        precision={2}
                        formatter={formatter}
                      />{" "}
                      arbres
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Cerbe;
