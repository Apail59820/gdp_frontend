import Image from 'next/image';
import styles from '../styles/Home.module.css';
import PageHeaderBanner from '../src/components/PageHeaderBanner/PageHeaderBanner';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
    </>
  );
}
