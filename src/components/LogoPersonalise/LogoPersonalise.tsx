import styles from './LogoPersonnalise.module.scss'
import { useAsync } from "react-async"
import {getUsClientsCompanyEntitiesUsers} from "../../../services/userService/UsClientsCompanyEntitiesUsers";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {Popconfirm} from "antd";
import {Button} from "projex-ui";
import React from "react";
import {UsUserModel} from "../../../models/UserService/UsUserModel";
import {capitalize} from "../../../utils/capitalize";

const mineLogo = async ({userId})=>{
    let res = await getUsClientsCompanyEntitiesUsers({filter:{directus_users_id:userId}});
    if(isRequestSuccessful( res.status )){
        if( res.data[0] ){
            return {
                display: true,
                entite: res.data[0].clients_company_entities_id,
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
const myCap=(user)=>{return user.first_name?
    (capitalize(user.first_name)+' '+capitalize(user.last_name))
    :user.first_name+' '+user.last_name}
export default function Logo({user, setOpen, disableButton}:Props){
    const userId= user.id
    const {data} = useAsync({promiseFn: mineLogo, userId});
     if(data) {
        return (
            <div className={styles.line}> {/*TODO: Faire mieux que ça*/}
                <span>{myCap(user)}</span>
                <Popconfirm title={`Ajouter une entité à ${myCap(user)}?`}
                            okText={'Oui'} onConfirm={()=>setOpen(true)}
                            cancelText={'Non'}>

                    <Button small style={'text'} disabled={disableButton}>
                        {data.display?(<p>{data.entite.toString()}</p>):(<p>-_-</p>)}
                    </Button>
                </Popconfirm>
            </div>
        )
    }
}