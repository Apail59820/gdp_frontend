import styles from "./CerbeBannerTimer.module.scss";
import DiagonalPict from "../../../public/logo-diagobat.svg";
import HeaderIcon from "../../../public/icon-cerbe-head.svg";
import React, { useEffect } from "react";
import Timer from "./Timer";
import { Button } from "projex-ui";
import Image from "next/image";
import { useRouter } from "next/router";
import { RightOutlined } from '@ant-design/icons';

export default function CerbeBannerTimer() {
  const router = useRouter();
  const deadline = "1 apr 2024 9:0:0";

  useEffect(() => {
    const beginButton = document.getElementById('beginButton');
    beginButton.style.color = '#002559';
    beginButton.style.background = 'white'
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div>
          <Image
            src={DiagonalPict.src}
            alt="Diagobat Logo"
            width={258}
            height={48}
          />
          <h5>
            CERBE 2024 dans <Timer deadline={deadline} />
          </h5>
          <h5>Veuillez remplir vos données CERBE avant le 1er avril</h5>
        </div>
        <img src={HeaderIcon.src} alt="Diagobat vectorial" />
        <div>
          <Button
              id={'beginButton'}
              style={"text_gray"}
              icon={<RightOutlined rev={undefined} />}
              iconPosition={'right'}
              onClick={() => router.push('#cerbe')}
          >
            Commencer
          </Button>
        </div>
      </div>
    </>
  );
}
