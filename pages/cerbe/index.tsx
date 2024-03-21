import styles from "../../styles/Cerbe.module.scss";
import Grid from "../../src/components/Grid/Grid";
import React from "react";
import {  Skeleton, Row, Col, Statistic  } from 'antd'
import HeaderIcon from "../../public/Icon-cerbe-head.svg"
import BodyIcon from "../../public/Icon-cerbe-body.svg"
import PowerIcon from "../../public/Icon-power.svg"
import ResourcesIcon from "../../public/Icon-resources.svg"
import CarbonIcon from "../../public/Icon-carbon.svg"
import BiodiversityIcon from "../../public/Icon-biodiversity.svg"
import DiagonalPict from "../../public/logo-diagobat.svg"

const Cerbe = () => {
    const loading = false;
    const formatter = (value: number) => value.toFixed(2);
    return (
        <>
            <div className={styles.cerbePage}>
                <section>
                    <div className={`${styles.headerIconContainer} multi`}>
                        <img src={DiagonalPict.src} className={styles.headerIcon} alt="Iconn"/>
                        <img src={HeaderIcon.src} className={styles.headerIcon} alt="Iconn"/>
                    </div>
                    <img src={BodyIcon.src} className={styles.bodyIcon} alt="Iconn"/>
                </section>
                <section className={styles.iconsContainer}>
                    <div className={styles.iconsContainerContents}>
                        {
                            loading ? (
                                <div>
                                    <Skeleton active/>
                                </div>
                            ) : (
                                <div className={styles.generalIconElements}>
                                    <h2 className={styles.title}>GENERALITES</h2>
                                    <div className={styles.content}>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Statistic title="Nombre de projets" value={112893}
                                                           formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Surface plancher totale" value={112893} precision={2}
                                                           formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Surface parcelle totale" value={112893} precision={2}
                                                           formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Nombre de projets certifiés" value={112893}
                                                           precision={2} formatter={formatter}/>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )
                        }

                        {
                            loading ? (
                                <div>
                                    <Skeleton active/>
                                </div>
                            ) : (
                                <div className={styles.powerIconElements}>
                                    <img src={PowerIcon.src} className={styles.img} alt="Iconn"/>
                                    <h2 className={styles.title}>REDUIRE LE BESOIN EN ENERGIE</h2>
                                    <div className={styles.content}>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Gain sur les consommations réglementaire (1-(Cep/Cepref))"
                                                    value={112893}
                                                    formatter={formatter}/> %
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Economie d'Energie réglementaire (Cepref-Cep)"
                                                           value={112893} precision={2}
                                                           formatter={formatter}/> kWhep/m².an
                                            </Col>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Economies d'énergie équivalentes à la conso annuelle d'une ville de "
                                                    value={112893} precision={2}
                                                    formatter={formatter}/> habitants
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Quantité d'Energie Renouvelable produite"
                                                           value={112893}
                                                           precision={2} formatter={formatter}/> kWhep/an
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )
                        }

                        {
                            loading ? (
                                <div>
                                    <Skeleton active/>
                                </div>
                            ) : (
                                <div className={styles.biodiversityIconElements}>
                                    <img src={BiodiversityIcon.src} className={styles.img} alt="Iconn"/>
                                    <h2 className={styles.title}>AMELIORER LA BIODIVERSITE</h2>
                                    <div className={styles.content}>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Coefficient moyen de Biotope par surface finale"
                                                    value={112893}
                                                    formatter={formatter}/> %
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Amélioration du CBS par rapport à l'état initial"
                                                           value={112893} precision={2}
                                                           formatter={formatter}/> kWhep/m².an
                                            </Col>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Coefficient moyen de Rafraichissement Thermo-Surfacique*"
                                                    value={112893} precision={2}
                                                    formatter={formatter}/> habitants
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Amélioration du RTS par rapport à l'état initial"
                                                           value={112893}
                                                           precision={2} formatter={formatter}/> kWhep/an
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Surface équivalente de plantations en pleine terre"
                                                           value={112893}
                                                           precision={2} formatter={formatter}/> kWhep/an
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )
                        }

                        {
                            loading ? (
                                <div>
                                    <Skeleton active/>
                                </div>
                            ) : (
                                <div className={styles.resourcesIconElements}>
                                    <img src={ResourcesIcon.src} className={styles.img} alt="Iconn"/>
                                    <h2 className={styles.title}>PRESERVER LES RESSOURCES</h2>
                                    <div className={styles.content}>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Volume cumulé de cuves de récupération des eaux de pluie"
                                                    value={112893}
                                                    formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Coefficient moyen de perméabilité de la parcelle Projet"
                                                    value={112893} precision={2}
                                                    formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Amélioration de la perméabilité du sol" value={112893}
                                                           precision={2}
                                                           formatter={formatter}/>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )
                        }

                        {
                            loading ? (
                                <div>
                                    <Skeleton active/>
                                </div>
                            ) : (
                                <div className={styles.carbonIconElements}>
                                    <img src={CarbonIcon.src} className={styles.img} alt="Iconn"/>
                                    <h2 className={styles.title}>REDUIRE L'EMPREINTE CARBONE</h2>
                                    <div className={styles.content}>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Empreinte carbone totale PROJET"
                                                    value={112893}
                                                    formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Gain sur l'empreinte carbone par rapport à la valeur référence"
                                                    value={112893} precision={2}
                                                    formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Quantité de matériaux biosourcés" value={112893}
                                                           precision={2}
                                                           formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Quantité équivalente stockée de carbone *"
                                                           value={112893}
                                                           precision={2}
                                                           formatter={formatter}/>
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Soit une forêt agée de 35 ans comptant "
                                                           value={112893}
                                                           precision={2}
                                                           formatter={formatter}/>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )
                        }
                   </div>
                </section>
            </div>
        </>
    )
}

export default Cerbe;