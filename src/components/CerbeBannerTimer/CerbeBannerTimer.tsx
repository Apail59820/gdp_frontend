import styles from "./CerbeBannerTimer.module.scss";
import HeaderIcon from "../../../public/icon-cerbe-head.svg";
import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import { Button } from "projex-ui";
import {InfoCircleOutlined, RightOutlined} from "@ant-design/icons";

type Props = {
  setIsCreateNewCERBEModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CerbeBannerTimer( { setIsCreateNewCERBEModalOpen }:Props ) {
  const deadline = "1 apr 2024 9:0:0";

  useEffect(() => {
    const beginButton = document.getElementById("beginButton");
    beginButton.style.color = "#002559";
    beginButton.style.background = "white";
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div>
          <h1>
            <strong>CERBE 2024</strong>
          </h1>
          <h5>
            CERBE 2024 dans <Timer deadline={deadline} />
          </h5>
          <h5>Accedez au formulaire d’aide à la saisie des données cerbe</h5>
        </div>
        <img src={HeaderIcon.src} alt="Diagobat vectorial" />
        <div>
          <Button
            id={"beginButton"}
            style={"text_gray"}
            icon={<RightOutlined rev={undefined} />}
            iconPosition={"right"}
            onClick={() => setIsCreateNewCERBEModalOpen(true)}
          >
            Commencer
          </Button>
        </div>
      </div>
    </>
  );
}
