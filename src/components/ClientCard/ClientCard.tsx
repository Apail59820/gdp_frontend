import React, { ElementType, ImgHTMLAttributes, ReactNode, useRef } from 'react';
import styles from './ClientCard.module.scss';
import { useEffect, useState } from 'react'
import { ShadowCard } from '@projex/ui';
import Img from './portraitA.png';
import { Tooltip, Button } from 'antd';
import type { UserModel } from '../../../models/UserModels';
import type { ProjectModel } from '../../../models/ProjectModel';
import kebabMenu from '../../../public/ellipsis-vertical.svg';

type Props = {
    client: ProjectModel;
    users: UserModel[];
    iconsToShow: number;
    // to define
    onClick?: React.MouseEventHandler;
    // redirect to profiles
    redirectTo?: React.MouseEventHandler;
};

const ClientCard = ({ client, users, iconsToShow, onClick, redirectTo }: Props) => {
    const [current, setCurrent] = useState(0);
    const [nextCurrent, setNextCurrent] = useState<number | undefined>(undefined);

    const nextPerson= (key: number) => {
        key === 0 ? [setCurrent(key), setNextCurrent(undefined)] : setNextCurrent(key);
        setTimeout(() => {
            setNextCurrent(undefined)
            setCurrent(key);
        }, 300);
      };

    
    return (
        <>
        <div className={styles.containerClientCard}>
            <ShadowCard>
                <div className={styles.clientCard}>
                    
                    <div className={styles.boxLeft}>
                        <div className={styles.title}>{client.client_company_name}</div>
                        <div className={styles.adress}>{client.address}</div>
                        <div className={styles.adress}>{client.zip_code}</div>
                        <div className={styles.adress}>{client.city}</div>
                        <div className={styles.adress}>{client.country}</div>
                    </div>
                    <div >
                    <div className={styles.slider}>
                        <div className={`${styles.sliderContent} ${nextCurrent !== undefined ? styles.slideAnime : ''}`}>
                      
                            <div className={styles.container}>
                                <div className={styles.boxImg}>
                                    <img src={users[current]?.avatar ? users[current].avatar  : Img.src} alt={users[current]?.avatar ? '' : 'image contact'} className={styles.contactImg}/>
                                </div>
                                <div>
                                    <div className={styles.clientName}>{users[current]?.first_name?.toUpperCase()} {users[current]?.last_name?.toUpperCase()}</div>
                                    <div >{users[current]?.number}</div>
                                    {/* second phone number to added in the table */}
                                    {/* <div >{contacts[current]?.number}</div> */}
                                    <div >{users[current]?.email}</div>
                                </div>

                            </div>
                            {nextCurrent && (                            
                            <div className={styles.container}>
                                <div className={styles.boxImg}>
                                    <img src={users[nextCurrent]?.avatar ? users[nextCurrent].avatar  : Img.src} alt={users[nextCurrent]?.avatar ? '' : 'image contact'} className={styles.contactImg}/>
                                </div>
                                <div>
                                    <div className={styles.clientName}>{users[nextCurrent]?.first_name?.toUpperCase()} {users[current]?.last_name?.toUpperCase()}</div>
                                    <div >{users[nextCurrent]?.number}</div>
                                        {/* second phone number to added in the table */}
                                    {/* <div >{contacts[nextCurrent]?.number}</div> */}
                                    <div >{users[nextCurrent]?.email}</div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>

                       
                        <div className={styles.boxBottomRight}>
                            {users.map((e: UserModel, key: number) => {
                                if (key < iconsToShow) {
                                    return (
                                        <Tooltip placement="bottomLeft" title={e.first_name + ' ' + e.last_name}>
                                            <img onClick={() => nextPerson(key)} key={key} src={users[current]?.avatar ? users[current].avatar  : Img.src} alt={users[current]?.avatar ? '' : 'image contact'} className={styles.contactBtn}></img>
                                        </Tooltip>
                                    )
                                }
                            })}
                            {users.length >  iconsToShow &&
                                <button className={styles.contactBtn}><div className={styles.contactBtnTxt}>{'+'+ `${users.length - iconsToShow}`}</div></button>
                            }
                        </div>
                    </div>
                    <button className={styles.kebabButton} onClick={onClick}>
                        <img src={kebabMenu.src} alt={`Kebab menu for ${client.name}`} />
                    </button>
                </div>
            </ShadowCard>
            </div>
         </>
    )
};

export default ClientCard;