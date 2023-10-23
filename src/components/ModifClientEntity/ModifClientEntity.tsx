import {Form, Modal, Select} from "antd";
import React, {useState} from "react";
import {Button} from "projex-ui";
import {UsClientsCompanyEntitiesModel} from "../../../models/UserService/UsClientsCompanyEntitiesModel";
import {getUsClientsCompanyEntities} from "../../../services/userService/UsClientsCompanyEntities";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
    /*
        TODO:   Ce selector renvoie des entités projex
                Il faut récupérer les entités cliente
    */

type props={
    isModifyOpen: boolean,
    setIsModifyOpen: React.Dispatch<boolean>,
    clientName: string,
    isAlreadyAssociated: boolean,
}

const ModifClientEntity = ({isModifyOpen, setIsModifyOpen, clientName, isAlreadyAssociated}:props)=>{
    const [companyEntities, setCompanyEntities] = useState([])
    const title = isAlreadyAssociated?"Modifier l'entité de":"Ajouter une entité à";
    getUsClientsCompanyEntities().then(res=>{
        if(isRequestSuccessful( res.status )){
            setCompanyEntities(res.data);
        }
    })
    return <>
        <Modal closable destroyOnClose footer={null}
               open={isModifyOpen}
               onCancel={()=>setIsModifyOpen(false)}
               title={`${title} ${clientName}`}
        >
            <Form.Item
                label={'Entité'}
                name={'entity'}
                id={'entity'}
                rules={[
                    {
                        required: true,
                        message: 'Veuillez sélectionner une entité.',
                    },
                ]}
            >
                <Select showSearch
                        placeholder={"Sélectionnez une entité cliente"}
                        options={companyEntities?.map((entity: Partial<UsClientsCompanyEntitiesModel>) => {
                            return {
                                label: entity.name,
                                value: entity.id,
                            };
                        })}
                />
            </Form.Item>

            <div style={{display:"flex"}}>
                <Button small style={"primary"}>Ayé</Button>
                <Button small style={"text"}>Annuler</Button>
            </div>
        </Modal>
    </>
}
export default ModifClientEntity