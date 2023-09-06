import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import PageHeaderBanner from '../src/components/PageHeaderBanner/PageHeaderBanner';
import { TabBar } from 'projex-ui';
import HomeDashboard from '../src/HomeDashboard/HomeDashboard';
import HomeUpdates from '../src/HomeUpdates/HomeUpdates';
import { getMyUsProfile } from '../services/userService/UsUsers';
import { isRequestSuccessful } from '../utils/isRequestSuccessful';

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
  const [userFullName, setUserFullName] = useState<string>('');

  useEffect(() => {
    getMyUsProfile(['first_name', 'last_name'].join(','))
      .then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          const { first_name = null, last_name = null } = res.data;
          if (first_name && last_name) setUserFullName(`${first_name} ${last_name}`);
          else if (first_name) setUserFullName(`${first_name}`);
          else if (last_name) setUserFullName(`${last_name}`);
          else throw 'this user has neither first_name or last_name';
        }
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="page">
      <PageHeaderBanner data={userFullName ? `Bonjour, ${userFullName}` : 'Bonjour'} />
      <div className={styles.homePage}>
        <TabBar tabs={tabs.map((tab) => tab.label)} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {tabs.find((tab) => tab.label === currentTab)?.content}
      </div>
    </div>
  );
};

export default Home;
