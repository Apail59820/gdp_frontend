import styles from './LogoPersonnalise.module.scss'
import Image from "next/image";
import { useAsync } from "react-async"
import {getImagesByCompany} from "../../../utils/getImagesByCompany";
import {getUsClientsCompanyEntitiesUsers} from "../../../services/userService/UsClientsCompanyEntitiesUsers";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {Popconfirm} from "antd";
import {Button} from "projex-ui";
import React from "react";
import {UsUserModel} from "../../../models/UserService/UsUserModel";
import {capitalize} from "../../../utils/capitalize";

const entities = "groupe projex , projex , probim , imperium , diagobat , amexia , projex afrique".split(' , ');

const mineLogo = async ({userId})=>{
    let res = await getUsClientsCompanyEntitiesUsers({filter:{directus_users_id:userId}});
    if(isRequestSuccessful( res.status )){
        if( res.data[0] ){
            return {
                display: true,
                entite: getImagesByCompany(entities[res.data[0].entity_for_client -1]).logo,
            };
        }
    }
    return {
        display: false,
        entite: null,
    };
}

type Props={
    user:UsUserModel,
    setOpen:React.Dispatch<any>,
    disableButton?:boolean, //
}

export default function Logo({user, setOpen, disableButton}:Props){
    const userId= user.id
    const {data} = useAsync({promiseFn: mineLogo, userId});
     if(data) {
        return (
            <div className={styles.line}> {/*TODO: Faire mieux que ça*/}
                <span>{capitalize(user.first_name)+' '+capitalize(user.last_name)}</span>
                <Popconfirm title={`Ajouter une entité à ${capitalize(user.first_name)+' '+capitalize(user.last_name)}?`}
                            okText={'Oui'} onConfirm={()=>setOpen(true)}
                            cancelText={'Non'}>
                {
                    data.display ?
                        (<Image src={data.entite} alt={'logo'} width={50} height={10}/>)
                        : (<Button small style={'text'}
                                   disabled={disableButton}
                        >-_-</Button>)
                }
                </Popconfirm>
            </div>
        )
    }
}