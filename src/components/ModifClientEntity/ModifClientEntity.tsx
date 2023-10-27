import {Form, message, Modal, Select} from "antd";
import React, {useEffect, useState} from "react";
import {Button} from "projex-ui";
import {UsClientsCompanyEntitiesModel} from "../../../models/UserService/UsClientsCompanyEntitiesModel";
import {getUsClientsCompanyEntities} from "../../../services/userService/UsClientsCompanyEntities";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {
    createUsClientCompanyEntityUser,
    getUsClientsCompanyEntitiesUsers, updateUsClientCompanyEntityUser
} from "../../../services/userService/UsClientsCompanyEntitiesUsers";

type props={
    isModifyOpen: boolean,
    setIsModifyOpen: React.Dispatch<boolean>,
    clientName: string,
    clientId: string,
    title ?: string,
}

const ModifClientEntity = ({isModifyOpen, setIsModifyOpen, clientName, clientId, title="Modifier l'entité de"}:props)=>{
    const [companyEntities, setCompanyEntities] = useState([])
    useEffect(() => {
        getUsClientsCompanyEntities().then(res=>{
            if(isRequestSuccessful( res.status )){
                setCompanyEntities(res.data);
            }
        })
    }, []);

    const onFinish = (values)=>{
        getUsClientsCompanyEntitiesUsers({filter:{directus_users_id:clientId, is_current_job: true},})
            .then(associationResult=>{
                if(isRequestSuccessful( associationResult.status )){
                    associationResult.data
                        .forEach(association=>{
                            //console.log(new Date());
                            updateUsClientCompanyEntityUser(
                                `${association.id}`,
                                {end_date:new Date(),is_current_job:false})
                        })
                }
            })
        .finally(()=>{
            createUsClientCompanyEntityUser({
                is_leader: null,
                job_title: null,
                start_date: null,
                end_date: null,

                is_current_job: true,
                clients_company_entities_id: values.entity,
                directus_users_id: clientId,
            })
                .then(res=>{
                    if(isRequestSuccessful( res.status )){
                        message.success('Votre demande a été prise en compte')
                    } else {
                        message.error("Votre demande n'a pas été prise en compte")
                    }
                })
            setIsModifyOpen(false);
        })
    }

    return <>
        <Modal closable destroyOnClose footer={null}
               open={isModifyOpen}
               onCancel={()=>setIsModifyOpen(false)}
               title={`${title} ${clientName}`}
        >
            <Form onFinish={onFinish}>
                    <Select showSearch filterOption={false}
                            placeholder={"Sélectionnez une entité cliente"}
                            style={{width:'100%'}}
                            options={companyEntities?.map((entity: Partial<UsClientsCompanyEntitiesModel>) => {
                                return {
                                    label: entity.name,
                                    value: entity.id,
                                };
                            })}
                    />
                <div style={{display:"flex"}}>
                    <Button small htmlType={"submit"}>Confirmer</Button>
                    <Button small style={"text"} onClick={()=>setIsModifyOpen(false)}>Annuler</Button>
                </div>
            </Form>
        </Modal>
    </>
}
export default ModifClientEntity