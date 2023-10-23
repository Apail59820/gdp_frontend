import ModifClientEntity from "../ModifClientEntity/ModifClientEntity";
import React from "react";

type props = {
    isAddOpen: boolean,
    setIsAddOpen: React.Dispatch<boolean>,
    clientName: string,
}

export const AddClientEntity = ({isAddOpen, setIsAddOpen, clientName}:props)=>{
    return <ModifClientEntity isModifyOpen={isAddOpen} setIsModifyOpen={setIsAddOpen} clientName={clientName} title={"Sélectionner une entité pour"} />
}