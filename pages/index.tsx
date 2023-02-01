import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';
import PageHeaderBanner from '../src/components/PageHeaderBanner/PageHeaderBanner';
// import { TabBar } from '@projex/ui';
import HomeDashboard from '../src/HomeDashboard/HomeDashboard';
import HomeUpdates from '../src/HomeUpdates/HomeUpdates';
import AffairList from '../example/AffairsList/AffairList';
import Projects from '../example/Projects';

type Tab = {
  label: string;
  content: React.ReactNode;
};

const tabs: Tab[] = [
  {
    label: 'Tableau de bord',
    content: <HomeDashboard />,
  },
  {
    label: 'Mises à jour',
    content: <HomeUpdates />,
  },
];

const Home = () => {
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].label);

  return (
    <>
      {/* TODO Display current user name */}
      <PageHeaderBanner title="Bonjour, Olivier Le Baron" />
      <div className={styles.homePage}>
        <AffairList></AffairList>
        <Projects></Projects>
        {/* <TabBar tabs={tabs.map((tab) => tab.label)} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {tabs.find((tab) => tab.label === currentTab)?.content} */}
      </div>
    </>
  );
};

export default Home;
