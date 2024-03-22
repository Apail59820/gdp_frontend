import styles from "./CerbeBannerTimer.module.scss";
import DiagonalPict from "../../../public/logo-diagobat.svg";
import HeaderIcon from "../../../public/icon-cerbe-head.svg";
import React, { useState } from "react";
import Timer from "./Timer";
import { Button } from "projex-ui";
import Image from 'next/image';

export default function CerbeBannerTimer() {
  const timestamp = new Date("1 apr 2024 9:0:0");
  return (
    <>
      <div className={styles.container}>
        <div>
          <Image src={DiagonalPict.src} alt="Diagobat Logo" width={258} height={48} />
          <h5>
            CERBE 2024 dans <Timer expiryTimestamp={timestamp} />
          </h5>
        </div>
        <img src={HeaderIcon.src} alt="Diagobat vectorial" />
        <div>
          <Button style={"text_gray"}>Go to somewhere</Button>
        </div>
      </div>
    </>
  );
}
