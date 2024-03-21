import { ManageItemCard, Section } from 'projex-ui';
import Grid from '../Grid/Grid';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ProjectCard from '../ProjectCard/ProjectCard';
import styles from '../ProjectsWidget/ProjectsWidget.module.scss';
import React, { useState } from 'react';


type Props = {
    handleNewCERBERClick: React.MouseEventHandler<HTMLButtonElement>
}
export default function CERBEWidget( { handleNewCERBERClick }: Props ) {

    const onShowMyCERBEClick = ()=> {}
    return (
        <Section title="CERBE" button={{label: 'Voir tous les CERBE', onClick:onShowMyCERBEClick}}>
            <Grid>
                    <ManageItemCard label="Nouveau CERBE" onClick={handleNewCERBERClick} />
            </Grid>
        </Section>
    );
}