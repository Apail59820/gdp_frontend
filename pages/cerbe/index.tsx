import styles from "../../styles/Cerbe.module.scss";
import Grid from "../../src/components/Grid/Grid";
import React from "react";

import HeaderIcon from "../../public/Icon-cerbe-head.svg"
import BodyIcon from "../../public/Icon-cerbe-body.svg"
import PowerIcon from "../../public/Icon-power.svg"
import ResourcesIcon from "../../public/Icon-resources.svg"
import CarbonIcon from "../../public/Icon-carbon.svg"
import BiodiversityIcon from "../../public/Icon-biodiversity.svg"

const Cerbe = () => {
    return (
        <div className="page">
            <div className={styles.cerbePage}>
                <section>
                    <Grid type="narrow">
                        <div className={styles.mainElements}>
                            <img src={HeaderIcon.src} className={styles.headerIcon} alt="Iconn"/>
                            <img src={BodyIcon.src} className={styles.bodyIcon} alt="Iconn"/>
                        </div>
                    </Grid>
                </section>
                <section>
                    <Grid type="narrow">
                        <div className={styles.powerIconElements}>
                            <img src={PowerIcon.src} className={styles.img} alt="Iconn"/>
                            <h2 className={styles.title}>REDUIRE LE BESOIN EN ENERGIE</h2>
                        </div>

                        <div className={styles.resourcesIconElements}>
                            <img src={ResourcesIcon.src} className={styles.img} alt="Iconn"/>
                            <h2 className={styles.title}>PRESERVER LES RESSOURCES</h2>
                        </div>

                        <div className={styles.carbonIconElements}>
                            <img src={CarbonIcon.src} className={styles.img} alt="Iconn"/>
                            <h2 className={styles.title}>REDUIRE L'EMPREINTE CARBONE</h2>
                        </div>

                        <div className={styles.biodiversityIconElements}>
                            <img src={BiodiversityIcon.src} className={styles.img} alt="Iconn"/>
                            <h2 className={styles.title}>AMELIORER LA BIODIVERSITE</h2>
                        </div>
                    </Grid>
                </section>
                <section>
                    <Grid type="narrow">
                    </Grid>
                </section>
            </div>
        </div>

    )
}

export default Cerbe;