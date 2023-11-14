import {Form, message, Modal, Select} from "antd";
import {Button} from "projex-ui";
import React, {useEffect, useState} from "react";
import {GdpProjectsModel} from "../../../models/GestionDeProjets/GdpProjectsModel";
import {GdpAffairModel} from "../../../models/GestionDeProjets/GdpAffairModel";
import {getGdpAffairs} from "../../../services/gestionDeProjets/GdpAffairs";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";

interface SelectAffairProps {
    isOpen: boolean;
    handleClose: () => void;
    onSelect: (affairId : Partial<GdpAffairModel>) => void;
    project: Partial<GdpProjectsModel>;
}
const SelectAffair = ({isOpen, handleClose, onSelect, project} : SelectAffairProps) => {

    const [affairs, setAffairs] = useState<Partial<GdpAffairModel>[]>([]);
    const [selectedAffair, setSelectedAffair] = useState<Partial<GdpAffairModel>>()

    useEffect(() => {
        if(project.id){
            getGdpAffairs({filter: {projects_id: {_in : project.id}}}).then((res) => {
                if(isRequestSuccessful(res.status) && res?.data.length){
                    setAffairs(res.data);
                }
            })
        }
    }, []);

    const onFinish = async () => {
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
            <>
            <Button small style={"alert"} onClick={handleClose}>Fermer</Button>
            </>
        }
        >
            {affairs && (
                <Form.Item>
                    <Select
                        placeholder={"Choisir une affaire..."}
                        onSelect={(value) => {
                            getGdpAffairs({filter: {id: value}}).then((res) => {
                                if(isRequestSuccessful(res.status) && res?.data.length){
                                    setSelectedAffair(res.data[0]);
                                }
                            })
                        }}
                        options={affairs.map((affair) => ({
                            label: affair.name,
                            value: affair.id,
                        }))}
                    />
                </Form.Item>

            )}
            <Button small onClick={onFinish}>
                Enregistrer
            </Button>
        </Modal>
    );
}


export default SelectAffair;