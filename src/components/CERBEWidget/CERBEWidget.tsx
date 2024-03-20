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

    const mockProjects: {id: number; name: string}[] = [
        { id: 1, name: 'mock Project 1' }
    ];
    const onShowMyCERBEClick = ()=> {}
    return (
        <Section title="CERBE" button={{label: 'Voir tous les CERBE', onClick:onShowMyCERBEClick}}>
            <Grid>
                {
                    mockProjects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                            <ProjectCard project={project} projectManagerName={'Chef de projet'} />
                        </Link>
                    ))
                }
                <div className={styles.manageItemCardContainer}>
                    <ManageItemCard label="Nouveau CERBE" onClick={handleNewCERBERClick} />
                </div>
            </Grid>
        </Section>
    );
}