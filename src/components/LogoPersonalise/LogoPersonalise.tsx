import styles from './LogoPersonnalise.module.scss'
import { useAsync } from "react-async"
import {getUsClientsCompanyEntitiesUsers} from "../../../services/userService/UsClientsCompanyEntitiesUsers";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {Popconfirm} from "antd";
import {Button} from "projex-ui";
import React from "react";
import {UsUserModel} from "../../../models/UserService/UsUserModel";
import {capitalize} from "../../../utils/capitalize";
import {PlusCircleOutlined} from "@ant-design/icons";

const mineLogo = async ({userId})=>{
    let res = await getUsClientsCompanyEntitiesUsers({filter:{directus_users_id: userId, is_current_job: true}});
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
    setOpen:(isOpenModify:boolean, isOpenCreate:boolean, isAddOpen: boolean)=>void,
    disableButton?:boolean, //
}

export default function Logo({user, setOpen, disableButton}:Props){
    const userId= user.id
    const {data} = useAsync({promiseFn: mineLogo, userId});
     if(data) {
        return (
            <div className={styles.line}> {/*TODO: Faire mieux que ça*/}
                <span>{capitalize(user.first_name)+' '+capitalize(user.last_name)}</span>
                {data.display?(
                    <Button small style={"text"} onClick={()=>setOpen(true, false, false)}>
                        {data.entite.toString()}
                    </Button>
                ):(
                    <Popconfirm title={"Créer une entité ou sélectionner une entité existante ?"}
                                okText={"Créer"} cancelText={"Sélectionner"}
                                onConfirm={()=>{setOpen(false, true, false)}}
                                onCancel={()=>{setOpen(false, false, true)}}
                    >
                        <Button small style={"text"}>
                            <PlusCircleOutlined style={{color:'#009C3E'}}/>
                        </Button>
                    </Popconfirm>
                )}
            </div>
        )
    }
}