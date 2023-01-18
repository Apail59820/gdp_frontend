import Image from 'next/image';
import styles from '../styles/Home.module.css';
import PageHeaderBanner from '../src/components/PageHeaderBanner/OLDPageHeaderBanner';
import AffairCard from '../src/components/AffairCard/AffairCard';
import { MouseEvent } from 'react';
import CollaboratorCard from '../src/components/CollaboratorCard/CollaboratorCard';
import FilesCard from '../src/components/FilesCard/FilesCard';
import ManagerCard from '../src/components/ManagerCard/ManagerCard';
import PhaseCard from '../src/components/PhaseCard/PhaseCard';
import { PhaseStatusEnum } from '../models/PhaseModel';
import ProgressStatusMessage from '../src/components/ProgressStatusMessage/ProgressStatusMessage';
import ProjectCard from '../src/components/ProjectCard/ProjectCard';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Olivier Le Baron" />
    </>
  );
}
