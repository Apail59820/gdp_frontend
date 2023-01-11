import React, { ImgHTMLAttributes, ReactNode } from 'react';
import styles from './ClientCard.module.scss';
import { useEffect, useState } from 'react'
import { ShadowCard } from '@projex/ui';
import Img from './image.png';

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
    contacts: Contact[]
};


const ClientCard = ({ client, contacts }: Props) => {

    const [current, setCurrent] = useState(0);

    const nextPerson= () => {
        setCurrent (current + 1);
      };
    
    const prevPerson = () => {
        setCurrent(current - 1);
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
                    <div>
                    <div className={styles.boxRight}>
                          <div className={styles.boxImg}>
                                <img src={contacts[current]?.image ? contacts[current].image?.src  : Img.src} alt={contacts[current]?.image ? '' : 'image contact'} className={styles.contactImg}/>
                            </div>
                        <div>
                            <div >{contacts[current].contactName}</div>
                            <div >{contacts[current].phoneNumber1}</div>
                            <div >{contacts[current].phoneNumber2}</div>
                            <div >{contacts[current].mail}</div>
                        </div>
                    </div>
                        <div className={styles.boxBottomRight}>
                        {contacts.map((e: any) => {
                            return (
                                <div className={styles.contactBtn} onClick={() => nextPerson()} key={e.contactName}></div>
                            )
                        })}
                            {/* {Object.keys(contacts).length && (
                                <div className={styles.contactBtn} onClick={() => nextPerson()}></div>
                            )} */}
                            {/* {current < contacts.length - 1 && (
                                <div className={styles.contactBtn} onClick={() => nextPerson()}></div>
                            )}
                            {current > 0 && (
                                <div className={styles.contactBtn} onClick={() => prevPerson()}></div>
                                )} */}
                        </div>
                    </div>
                </div>
            </ShadowCard>
            </div>
                                {/* {current === contacts.length - 1 && (
                                    <button  onClick={() => console.log('ok')
                                }>
                                        Done
                                    </button>
                                )} */}
         </>
    )
};

export default ClientCard;