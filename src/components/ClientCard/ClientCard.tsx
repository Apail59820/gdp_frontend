import React, { ElementType, ImgHTMLAttributes, ReactNode, useRef } from 'react';
import styles from './ClientCard.module.scss';
import { useEffect, useState } from 'react'
import { ShadowCard } from '@projex/ui';
import Img from './portraitA.png';
import { Tooltip, Button } from 'antd';

type Contact = {
    image?: ImgHTMLAttributes<HTMLImageElement>;
    contactName: string;
    phoneNumber1: number;
    phoneNumber2: number;
    mail: string;
}

type Props = {
    client: {
        clientName: string;
        addressLine1?: string;
        addressLine2?: string;
        postalCode: number;
        city: string;
        country: string;
    };
    contacts: Contact[];
    iconsToShow: number;
};

const ClientCard = ({ client, contacts, iconsToShow }: Props) => {
    const [current, setCurrent] = useState(0);
    const [nextCurrent, setNextCurrent] = useState<number | undefined>(undefined);

    const nextPerson= (key: number) => {
        key === 0 ? [setCurrent(key), setNextCurrent(undefined)] : setNextCurrent(key);
        setTimeout(() => {
            setCurrent(key);
            setNextCurrent(undefined)
        }, 300);
      };

    
    return (
        <>
        <div className={styles.containerClientCard}>
            <ShadowCard>
                <div className={styles.clientCard}>
                    <div className={styles.boxLeft}>
                        <div className={styles.clientName}>{client.clientName}</div>
                        <div className={styles.adress}>{client.addressLine1}</div>
                        <div className={styles.adress}>{client.addressLine2}</div>
                        <div className={styles.adress}>{client.postalCode}</div>
                        <div className={styles.adress}>{client.city}</div>
                        <div className={styles.adress}>{client.country}</div>
                    </div>
                    <div >
                    <div className={styles.slider}>
                        <div className={`${styles.sliderContent} ${nextCurrent !== undefined ? styles.slideAnime : ''}`}>
                      
                            <div className={styles.container}>
                                <div className={styles.boxImg}>
                                    <img src={contacts[current]?.image ? contacts[current].image?.src  : Img.src} alt={contacts[current]?.image ? '' : 'image contact'} className={styles.contactImg}/>
                                </div>
                                <div>
                                    <div >{contacts[current]?.contactName}</div>
                                    <div >{contacts[current]?.phoneNumber1}</div>
                                    <div >{contacts[current]?.phoneNumber2}</div>
                                    <div >{contacts[current]?.mail}</div>
                                </div>

                            </div>
                            {nextCurrent && (                            
                            <div className={styles.container}>
                                <div className={styles.boxImg}>
                                    <img src={contacts[nextCurrent]?.image ? contacts[nextCurrent].image?.src  : Img.src} alt={contacts[nextCurrent]?.image ? '' : 'image contact'} className={styles.contactImg}/>
                                </div>
                                <div>
                                    <div >{contacts[nextCurrent]?.contactName}</div>
                                    <div >{contacts[nextCurrent]?.phoneNumber1}</div>
                                    <div >{contacts[nextCurrent]?.phoneNumber2}</div>
                                    <div >{contacts[nextCurrent]?.mail}</div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                        <div className={styles.boxBottomRight}>
                            {contacts.map((e: Contact, key: number) => {
                                if (key < iconsToShow) {
                                    return (
                                        <Tooltip placement="bottomLeft" title={e.contactName}>
                                            <img onClick={() => nextPerson(key)} key={key} src={contacts[current]?.image ? contacts[current].image?.src  : Img.src} alt={contacts[current]?.image ? '' : 'image contact'} className={styles.contactBtn}></img>
                                        </Tooltip>
                                    )
                                }
                            })}
                            {contacts.length >  iconsToShow &&
                                <button className={styles.contactBtn}><div className={styles.contactBtnTxt}>{'+'+ `${contacts.length - iconsToShow}`}</div></button>
                            }
                        </div>
                    </div>
                </div>
            </ShadowCard>
            </div>
         </>
    )
};

export default ClientCard;