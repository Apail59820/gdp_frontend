import ModifClientEntity from "../ModifClientEntity/ModifClientEntity";
import React from "react";

type props = {
    isAddOpen: boolean,
    setIsAddOpen: React.Dispatch<boolean>,
    clientName: string,
    clientId: string,
}

export const AddClientEntity = ({isAddOpen, setIsAddOpen, clientName, clientId}:props)=>{
    return <ModifClientEntity isModifyOpen={isAddOpen} setIsModifyOpen={setIsAddOpen}
                              clientName={clientName} clientId={clientId}
                              title={"Sélectionner une entité pour"} />
}