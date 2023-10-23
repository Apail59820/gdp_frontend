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
    title ?: string,
}

const ModifClientEntity = ({isModifyOpen, setIsModifyOpen, clientName, title="Modifier l'entité de"}:props)=>{
    const [companyEntities, setCompanyEntities] = useState([])
    getUsClientsCompanyEntities().then(res=>{
        if(isRequestSuccessful( res.status )){
            setCompanyEntities(res.data);
        }
    })

    const onFinish = (values)=>{
        console.log(values.entity);
        setIsModifyOpen(false);
    }

    return <>
        <Modal closable destroyOnClose footer={null}
               open={isModifyOpen}
               onCancel={()=>setIsModifyOpen(false)}
               title={`${title} ${clientName}`}
        >
            <Form onFinish={onFinish}>
                <Form.Item
                    label={'Entité'}
                    name={'entity'}
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
                    <Button small htmlType={"submit"}>Confirmer</Button>
                    <Button small style={"text"}>Annuler</Button>
                </div>
            </Form>
        </Modal>
    </>
}
export default ModifClientEntity