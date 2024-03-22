import styles from './CerbeBannerTimer.module.scss';
import DiagonalPict from '../../../public/logo-diagobat.svg';
import HeaderIcon from '../../../public/icon-cerbe-head.svg';
import React, { useState } from 'react';
import Timer from './Timer';

export default function CerbeBannerTimer() {

    return (
      <>
        <div className={styles.container}>
          <div>
            <img src={DiagonalPict.src} alt="Diagobat Logo" />
            <h4>
                CERBE 2024 dans {' '}
                <Timer secondsToWait={30} />
            </h4>
          </div>
          <img src={HeaderIcon.src} alt="Diagobat vectorial" />
          <div>
            <button className={styles.goToButton}>go to somewhere</button>
          </div>
        </div>
      </>
    );
}