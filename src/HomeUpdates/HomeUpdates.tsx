import React, {useEffect, useState} from 'react';
import styles from './HomeUpdates.module.scss';
import {getChangelog, UpdateModel} from "../../utils/getChangelog";
import {isRequestSuccessful} from "../../utils/isRequestSuccessful";
import {messages} from "../../constants/messages";
import {message} from "antd";

const HomeUpdates = () => {

    const [updates, setUpdates] = useState<UpdateModel[]>([])
    useEffect(() => {
        getChangelog().then((res) => {
            if(isRequestSuccessful(res.status)){
                setUpdates(res?.data);
            }else{
                message.error(messages.general.error());
            }
        })
    }, []);


  return (
    <div className={styles.homeUpdates}>
      {updates.map((update: UpdateModel) => (
        <section key={update.id} className={styles.update}>
          <h3 className={styles.title}>
            {update.date} - {update.title}
          </h3>
            <>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: update.content }} />
            </>
        </section>

      ))}
    </div>
  );
};

export default HomeUpdates;
