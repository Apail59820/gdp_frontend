import { ManageItemCard, Section } from "projex-ui";
import Grid from "../Grid/Grid";
import React from "react";
import { useRouter } from 'next/router';

type Props = {
  handleNewCERBEClick: React.MouseEventHandler<HTMLButtonElement>;
};
export default function CERBEWidget({ handleNewCERBEClick }: Props) {
  const router = useRouter();
  const onShowMyCERBEClick = () => router.push('/cerbe');
  return (
      <Section
          title="CERBE"
          button={{ label: "Voir les données CERBE", onClick: onShowMyCERBEClick }}
      >
        <Grid>
          <div id="cerbe" >
            <ManageItemCard
                label="Saisir mes données CERBE"
                onClick={handleNewCERBEClick}
            />
          </div>
        </Grid>
      </Section>
  );
}
