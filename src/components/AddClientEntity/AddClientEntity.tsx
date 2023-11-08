import React from "react";
import EditClientEntity from "../EditClientEntity/EditClientEntity";

type props = {
    clientId: string,
    clientName: string,
    isAddOpen: boolean,
    setIsAddOpen: React.Dispatch<boolean>,
    setNewEntity: React.Dispatch<React.SetStateAction<{ user: string, entityName: string }>>
}

export const AddClientEntity = ({isAddOpen, setIsAddOpen, clientName, clientId, setNewEntity}:props)=>{
    return <EditClientEntity isModifyOpen={isAddOpen} setIsModifyOpen={setIsAddOpen}
                              clientName={clientName} clientId={clientId}
                                setNewEntity={setNewEntity}
                              title={"Sélectionner une entité pour"} />
}