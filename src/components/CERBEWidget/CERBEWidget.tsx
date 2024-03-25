import styles from "./CERBEWidget.module.scss";
import { ManageItemCard, Section } from "projex-ui";
import Grid from "../Grid/Grid";
import React from "react";

type Props = {
  handleNewCERBEClick: React.MouseEventHandler<HTMLButtonElement>;
};
export default function CERBEWidget({ handleNewCERBEClick }: Props) {
  const onShowMyCERBEClick = () => {};
  return (
    <Section
      title="CERBE"
      button={{ label: "Voir tous les CERBE", onClick: onShowMyCERBEClick }}
    >
      <Grid>
          <div id="cerbe" >
            <ManageItemCard
              label="Nouveau CERBE"
              onClick={handleNewCERBEClick}
            />
          </div>
      </Grid>
    </Section>
  );
}
