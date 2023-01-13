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
      // let slider = {
    //     display : 'flex',
    //     flexDirection: 'row',
    //     alignItems: 'flex-start',
    //     padding: '0px',
    //     flex: 'none',
    //     order: '0',
    //     alignSelf: 'stretch',
    //     flexGrow: '0',
    //     marginLeft: '2em',
    //     marginTop: '1em',
    //     border: '3px solid red',
    //     width: '16em',
    //     height: '102px',
    //     overflow: 'hidden',
    //     animationName: 'slider',
    //     animationDuration: '10s',
    // }

    // let sliderContent = `
    //     &:active {
    //         border: 1px solid blue;
    //         width: 16em;
    //         height: 102px;
    //         position: relative;
    //         animation-name: ${slider};
    //         animation-duration: 1s;
    // }`;
    const [current, setCurrent] = useState(0);
    
    const [isShowOthers, setIsShowOthers] = useState(true);
    
    const box = useRef<HTMLDivElement>(null);
    let slider = `${styles.slider}`
    let sliderContent = `${styles.sliderContent}`

    const [stateSlider, setStateSliderContent] = useState(slider)

    const nextPerson= (key: number) => {
        slideAnime()
        setCurrent(key);
      };

    const totalOthers = () => {
        const totalPerson = contacts.length;
        const totalToShow = totalPerson - iconsToShow;
        if (totalToShow === 0) {
            setIsShowOthers(false)
        }
        return totalToShow;
    }
  

    const slideAnime = () => {
        
        
        console.log('ref', box);
        const test = box.current?.style;
        if (test) {
            console.log(test);
            setStateSliderContent(`
            @keyframes ${slider} {
                0% {
                    left: 0px;
                  }
                  100% {
                    left: -16em;
                  }
              }`)
        }
        
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
                    <div className={`${stateSlider}`} ref={box}>
                        <div className={`${sliderContent}`}>
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
                            <div className={styles.container}>
                                <div className={styles.boxImg}>
                                    <img src={contacts[current +1]?.image ? contacts[current].image?.src  : Img.src} alt={contacts[current +1]?.image ? '' : 'image contact'} className={styles.contactImg}/>
                                </div>
                                <div>
                                    <div >{contacts[current +1]?.contactName}</div>
                                    <div >{contacts[current +1]?.phoneNumber1}</div>
                                    <div >{contacts[current +1]?.phoneNumber2}</div>
                                    <div >{contacts[current +1]?.mail}</div>
                                </div>
                            </div>
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
                            {isShowOthers &&
                                <button className={styles.contactBtn}><div className={styles.contactBtnTxt}>{'+'+ totalOthers()}</div></button>
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