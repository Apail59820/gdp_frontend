import {Form, message, Modal, Select} from "antd";
import {Button} from "projex-ui";
import React, {useEffect, useState} from "react";
import {GdpProjectsModel} from "../../../models/GestionDeProjets/GdpProjectsModel";
import {GdpAffairModel} from "../../../models/GestionDeProjets/GdpAffairModel";
import {getGdpAffairs} from "../../../services/gestionDeProjets/GdpAffairs";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import styles from "../ManageAffairManagerForm/ManageAffairManagerForm.module.scss";
import {useForm} from "antd/lib/form/Form";
import {selectAffairs} from "../../../store/reducers/affairsReducer";

interface SelectAffairProps {
    isOpen: boolean;
    handleClose: () => void;
    onSelect: (affairId : Partial<GdpAffairModel>) => void;
    project: Partial<GdpProjectsModel>;
}
const SelectAffair = ({isOpen, handleClose, onSelect, project} : SelectAffairProps) => {

    const [affairs, setAffairs] = useState<Partial<GdpAffairModel>[]>([]);
    const [selectedAffair, setSelectedAffair] = useState<Partial<GdpAffairModel>>();
    const [affairsSearchResult, setAffairSearchResult] = useState<Partial<GdpAffairModel>[]>([]);


    const [form] = useForm();

    useEffect(() => {
        if(project.id){
            getGdpAffairs({filter: {projects_id: {_in : project.id}}}).then((res) => {
                if(isRequestSuccessful(res.status) && res?.data.length){
                    setAffairs(res.data);
                    setAffairSearchResult(res.data);
                }
            })
        }
    }, []);

    const onFinish = async (values : any) => {
        if(!selectedAffair) return message.error("Veuillez choisir une affaire.");

        onSelect(selectedAffair);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            closable
            onCancel={handleClose}
            title={'Selectionner une affaire pour ce client'}
            footer={
            <div style={{display: "flex"}}>
            <Button small htmlType={"submit"}>
                Enregistrer
            </Button>
            <Button small style={"text"} onClick={handleClose}>Annuler</Button>
            </div>
        }
        >

            {affairs && (
                <Form form={form} name={'selectAffairForm'} autoComplete={'off'} layout={'vertical'} onFinish={onFinish}>
                    <Form.Item name={'selectedAffair'}>
                        <Select
                            placeholder={"Choisir une affaire..."}
                            showSearch
                            filterOption={false}
                            options={affairsSearchResult
                                .map((affair) => ({
                                    label: affair.name,
                                    value: affair.id,
                                }))}
                            onSearch={async (value) => {
                                if(value.length >= 1){
                                    const fetchAffairs = await getGdpAffairs(
                                        {filter: {
                                                _and: [{
                                                    name: {_starts_with: value},
                                                    projects_id: {_in : project.id}
                                                }]
                                            }}
                                    );

                                    if(isRequestSuccessful(fetchAffairs.status) && fetchAffairs?.data.length){
                                        setAffairSearchResult(fetchAffairs.data);
                                    }
                                }
                            }}
                            onChange={(value) => {
                                if (value) {
                                    const tmp = form.getFieldValue('selectedAffair');
                                    let selectedAffair = affairsSearchResult.filter((affair) => affair.id == tmp);
                                    if(selectedAffair.length == 1) {
                                        setSelectedAffair(selectedAffair[0]);
                                    }
                                }
                            }}
                        />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
}


export default SelectAffair;