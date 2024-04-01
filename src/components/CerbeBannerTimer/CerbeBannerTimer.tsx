import styles from "./CerbeBannerTimer.module.scss";
import HeaderIcon from "../../../public/icon-cerbe-head.svg";
import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import { Button } from "projex-ui";
import {InfoCircleOutlined, RightOutlined} from "@ant-design/icons";
import { Skeleton } from 'antd';

type Props = {
  setIsCreateNewCERBEModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CerbeBannerTimer( { setIsCreateNewCERBEModalOpen }:Props ) {
  const bannerTitle = "CERBE 2024";
  const bannerName = "CERBE";
  const deadline = "1 apr 2024 9:0:0";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoaded = setTimeout(() => {
    setIsLoading(false);
    clearTimeout(isLoaded)
  }, 1000);

  useEffect(() => {
    const beginButton = document.getElementById("beginButton");
    beginButton.style.color = "#002559";
    beginButton.style.background = "white";
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div>
          <>
            <h1>
              <strong>{ isLoading ? <Skeleton.Input active={isLoading} /> : bannerTitle}</strong>
            </h1>
            <div style={{fontSize: '1rem', letterSpacing: "1px"}}>
              <h5 style={{wordBreak: "break-word", fontSize: '1rem', lineHeight: '1.75rem'}}>
                <Timer deadline={deadline}/>
              </h5>
              <h5>
                { isLoading ? <Skeleton.Input active={isLoading} /> : <><InfoCircleOutlined /> {`Formulaire d’aide à la saisie des données ${bannerName}`}</>}
              </h5>
            </div>
          </>
      </div>
      <img src={HeaderIcon.src} alt="Diagobat vectorial"/>
        <div>
          <Button
              id={"beginButton"}
              style={"text_gray"}
              icon={<RightOutlined  />}
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
