import React, {useEffect, useState} from "react";
import {Form, Input, message, Modal, Select} from "antd";
import {UsClientsCompanyEntitiesModel} from "../../../models/UserService/UsClientsCompanyEntitiesModel";
import {getUsClientsCompanyEntities} from "../../../services/userService/UsClientsCompanyEntities";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {Button} from 'projex-ui';
import styles from './CreateClient.module.scss'
import {MinusCircleOutlined} from "@ant-design/icons";
import {inviteNewUsers} from "../../../services/auth";

type props={
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateClient({isOpen, setIsOpen}:props){
    const [entityName, setEntityName] = useState<string>();
    const [companyEntities, setCompanyEntities] = useState([]);
    const allCompanyEntities = companyEntities;
    useEffect(() => {
        getUsClientsCompanyEntities().then(res=>{
            if(isRequestSuccessful( res.status )){
                setCompanyEntities(res.data);
            }
        })
    }, []);

    const onFinish=(values)=>{
        //inviteNewUsers values.email, values.
        values.clients.forEach(client=>{
            inviteNewUsers(client.email, client.entity_id)
            .then(inviteResponse=>{
                if(isRequestSuccessful(inviteResponse.status)){
                    message.success('Votre invitation à été envoyée')
                    setIsOpen(false)
                }
            })
        })
    }
    return (
        <Modal open={isOpen}
               closable
               destroyOnClose
               onCancel={()=>setIsOpen(false)}
               title={"Créer un client"}
               footer={null}
        >
            <Form onFinish={onFinish}>
                <Form.List name={'clients'}>
                    {(fields, {add, remove} )=> (
                        <>
                        {fields.map(({key, name, ...restFields}) => (
                            <>
                                <div className={styles.row}>
                                    <div key={key} className={styles.champ}>
                                    <Form.Item label={'email'} id={'email'} name={[name, 'email']}>
                                        <Input type={'email'} placeholder={'email du client'} value={'ok@ici.fr'}/>
                                    </Form.Item>
                                    <Form.Item label={'entité'} id={'entité'} name={[name, 'entity_id']}>
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
                                    </Form.Item>
                                    </div>
                                    {/*<MinusCircleOutlined rev={undefined}
                                                          onClick={() => remove(name)}
                                    />*/}
                                </div>
                            </>
                        ))}
                            <Form.Item>
                                <Button small onClick={() => add()} style={'text'}>
                                    Ajouter un client
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <footer>
                    <div style={{display:'flex', alignItems:"center"}}>
                        <Button small htmlType={'submit'}>
                            Inviter
                        </Button>
                        <Button small style={"text"} onClick={()=>setIsOpen(false)}>
                            Annuler
                        </Button>
                    </div>
                </footer>
            </Form>
        </Modal>
    )
}