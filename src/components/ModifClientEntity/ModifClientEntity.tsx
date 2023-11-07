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
import {messages} from "../../../constants/messages";


type props={
    isModifyOpen: boolean,
    setIsModifyOpen: React.Dispatch<boolean>,
    clientName: string,
    clientId: string,
    title ?: string,
}

const EditClientEntity = ({isModifyOpen, setIsModifyOpen, clientName, clientId, title="Modifier l'entité de"}:props)=>{
    const [entityName, setEntityName] = useState<string>()
    const [companyEntities, setCompanyEntities] = useState([])
    useEffect(() => {
        getUsClientsCompanyEntities().then(res=>{
            if(isRequestSuccessful( res.status )){
                setCompanyEntities(res.data);
            }
        })
    }, []);
    const allCompanyEntities = companyEntities?companyEntities:null;

    const onFinish = async(entityName)=>{

        const currentJobsResponse = await getUsClientsCompanyEntitiesUsers({filter:{directus_users_id:clientId, is_current_job: true}});
        const previousJobsResponse = await getUsClientsCompanyEntitiesUsers({filter:{directus_users_id:clientId, is_current_job: false}});
        let shouldInsert = true;

        if(isRequestSuccessful(currentJobsResponse.status)){
            let ids = currentJobsResponse?.data;
            for(const id of ids){
                let res : {status:number, data?: Partial<UsClientsCompanyEntitiesModel> };
                for(const prevJob of previousJobsResponse.data) {
                    if(prevJob.clients_company_entities_id == entityName && shouldInsert){
                        res = await updateUsClientCompanyEntityUser(`${prevJob.id}`, {
                            end_date:null,
                            start_date: new Date(),
                            is_current_job:true});

                        shouldInsert = false;

                        if(isRequestSuccessful(res.status)){
                            await updateUsClientCompanyEntityUser(`${id.id}`, {end_date:new Date(),is_current_job:false});
                            messages.general.success("Votre demande", true, false);
                        }
                    }
                }
                if(shouldInsert) {
                    res = await updateUsClientCompanyEntityUser(`${id.id}`, {end_date:new Date(),is_current_job:false});
                }
                if(!isRequestSuccessful(res.status)){
                    return messages.general.error();
                }
            }
        } else return messages.general.error();


        if(shouldInsert){
            const createEntityUserResponse = await createUsClientCompanyEntityUser({
                is_leader: null,
                job_title: null,
                start_date: null,
                end_date: null,

                is_current_job: true,
                clients_company_entities_id: entityName,
                directus_users_id: clientId,
            })

            if(isRequestSuccessful(createEntityUserResponse.status)){
                messages.general.success("Votre demande", true, false);
            }else return messages.general.error();
        }


        setIsModifyOpen(false);
    }

    return <>
        <Modal closable destroyOnClose footer={null}
               open={isModifyOpen}
               onCancel={()=>setIsModifyOpen(false)}
               title={`${title} ${clientName}`}
        >
            <Form onFinish={()=>onFinish(entityName)}>
                    <Select showSearch filterOption={false}
                            placeholder={"Sélectionnez une entité cliente"}
                            style={{width:'100%'}}
                            options={companyEntities?.map((entity: Partial<UsClientsCompanyEntitiesModel>) => {
                                return {
                                    label: entity.name,
                                    value: entity.id,
                                };
                            })}
                            onSearch={value=>{
                                if(value.length>2){
                                    const tempCompanies = []
                                    companyEntities.forEach(companyEntity => {
                                        if (companyEntity.name.startsWith(value)) {
                                            tempCompanies.push(companyEntity)
                                        }
                                    })
                                    setCompanyEntities(tempCompanies)
                                }
                            }}
                            onChange={(value)=>{
                                setEntityName(value)
                                setCompanyEntities(allCompanyEntities)
                            }}
                    />
                <div style={{display:"flex"}}>
                    <Button small htmlType={"submit"}>Confirmer</Button>
                    <Button small style={"text"} onClick={()=>setIsModifyOpen(false)}>Annuler</Button>
                </div>
            </Form>
        </Modal>
    </>
}
export default EditClientEntity