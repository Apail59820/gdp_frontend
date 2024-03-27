import styles from "./CerbeBannerTimer.module.scss";
import HeaderIcon from "../../../public/icon-cerbe-head.svg";
import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import { Button } from "projex-ui";
import { RightOutlined } from "@ant-design/icons";

export default function CerbeBannerTimer() {
  const [button, setButton] = useState<HTMLButtonElement>(null);
  const deadline = "1 apr 2024 9:0:0";

  useEffect(() => {
    setButton(document.getElementById("cerbe").querySelector("button"));
  }, []);
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
            onClick={() => button.click()}
          >
            Commencer
          </Button>
        </div>
      </div>
    </>
  );
}
