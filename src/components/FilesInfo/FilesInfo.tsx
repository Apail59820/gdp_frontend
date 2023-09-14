import {message, Modal} from "antd";
import {GdpFilesModel} from "../../../models/GestionDeProjets/GdpFilesModel";
import React, {useEffect, useState} from "react";
import {GdpProjectsModel} from "../../../models/GestionDeProjets/GdpProjectsModel";
import {UsUserModel} from '../../../models/UsModels';

import {getGdpProjectById} from "../../../services/gestionDeProjets/GdpProjects";
import styles from "./FilesInfo.module.scss"

import {Button} from "projex-ui";
import Link from "next/link";
import {getMyUsProfile} from "../../../services/userService/UsUsers";
import {deleteGdpFile} from "../../../services/gestionDeProjets/GdpFiles";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {downloadFile} from "../../../utils/downloadFile";

import {capitalize} from "../../../utils/capitalize";

type FileInfoProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditButtonState: React.Dispatch<React.SetStateAction<boolean>>;
    file : Partial<GdpFilesModel>
};
const FileInfo = ({isOpen, setIsOpen , setEditButtonState, file} : FileInfoProps) => {
    const [gdpProject, setGdpProject] = useState<Partial<GdpProjectsModel> | null>(null);
    const [myUsProfile, setMyUsProfile] = useState<Partial<UsUserModel>>(null);

    function getFileSize(bytes, si=false, dp=1) : string {
        const thresh : number = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes > 1 ? bytes + ' octets' : bytes + ' octet';
        }

        const units = si ? ['ko', 'Mo', 'Go', 'To'] : ['Kio', 'Mio', 'Gio', 'Tio'];
        let u = -1;
        const r = 10**dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(dp) + ' ' + units[u];
    }

    function formatDate(dateToFormat: Date) {
        const date = new Date(dateToFormat);
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${day}/${month}/${year} à ${hours}h${minutes}`;
    }

    const isFileOwner = () : boolean => {
        let condition = file?.uploaded_by === myUsProfile?.id;
        if(!condition)
            message.error("Vous n'avez pas la permission de modifier ce fichier.");
        return condition;
    }
    const showDeleteConfirm = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        Modal.confirm({
            title: `Supprimer le fichier`,
            closable: true,
            maskClosable: true,
            footer: (
                <>
                    <h3>La suppression de ce fichier est irréversible, souhaitez vous continuer ?</h3>
                    <div className={styles.modalFooter}>
                        <Button small onClick={() => Modal.destroyAll()}>
                            Annuler
                        </Button>
                        <Button
                            small
                            style={'alert'}
                            onClick={() => {
                                Modal.destroyAll();
                                setIsOpen(false);

                                deleteGdpFile(file?.id).then((res) => {
                                    if(isRequestSuccessful(res.status)){
                                        message.success("Fichier supprimé.");
                                        window.location.reload();
                                    }
                                    else{
                                        message.error("Une erreur est survenue.");
                                    }
                                })
                            }}
                        >
                            Supprimer ce fichier
                        </Button>
                    </div>
                </>
            ),
        });
        e.stopPropagation();
    };
    const handleDelete = (e : React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if(isFileOwner()){
            showDeleteConfirm(e);
        }
    }
    const handleModify = () => {
        if(isFileOwner()){
            setEditButtonState(true);
        }
    }

    useEffect(() => {
        if(file?.projects_id){
            let gdpProjId: number = typeof file?.projects_id === 'object' && 'id' in file.projects_id
                ? (file.projects_id as GdpProjectsModel).id
                : Number(file?.projects_id);
            getGdpProjectById(gdpProjId).then(result => {
                if(result?.data){
                    setGdpProject(result.data);
                }
            });
        }
    }, [file]);

    useEffect(() => {
        getMyUsProfile().then((res) => {
            if(res.status ===  200) {
                setMyUsProfile(res?.data as Partial<UsUserModel>);
            }
        })


    }, []);

    return (
        <Modal
            open={isOpen}
            closable
            destroyOnClose
            onCancel={() => setIsOpen(false)}
            footer={null}
        >
            <div className={styles.fileInfoContainer}>
                <div className={styles.frame}>
                    <h3>{file?.filename_download}</h3>
                    <div className={styles.textBlock}>
                        <p>Taille : {getFileSize(file?.filesize, true)}</p>
                        <p>Type de fichier : {file?.type.toString()}</p>
                        <p>Modifié le : {formatDate(file?.modified_on)}</p>
                    </div>

                    <div className={styles.line}></div>
                    <div className={styles.textBlock}>
                        {(file && gdpProject) && (
                                <>
                                    <p>Etat : {capitalize(file?.status)}</p>
                                    <p>Projet : {capitalize(gdpProject?.name)}</p>
                                </>
                            )
                        }
                    </div>
                    <Button style={"primary"}
                            small={true}
                            onClick={() => {downloadFile(file); }}
                            icon={
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.65625 11.875C7.75 11.9688 7.875 12 8 12C8.09375 12 8.21875 11.9688 8.3125 11.875L12.8125 7.875C13.0312 7.71875 13.0312 7.375 12.8438 7.1875C12.6875 6.96875 12.3438 6.96875 12.1562 7.15625L8.5 10.4062V0.5C8.5 0.25 8.25 0 8 0C7.71875 0 7.5 0.25 7.5 0.5V10.4062L3.8125 7.125C3.625 6.96875 3.28125 6.96875 3.125 7.1875C2.9375 7.375 2.9375 7.71875 3.15625 7.875L7.65625 11.875ZM14 10H12.5C12.2188 10 12 10.25 12 10.5C12 10.7812 12.2188 11 12.5 11H14C14.5312 11 15 11.4688 15 12V14C15 14.5625 14.5312 15 14 15H2C1.4375 15 1 14.5625 1 14V12C1 11.4688 1.4375 11 2 11H3.5C3.75 11 4 10.7812 4 10.5C4 10.25 3.75 10 3.5 10H2C0.875 10 0 10.9062 0 12V14C0 15.125 0.875 16 2 16H14C15.0938 16 16 15.125 16 14V12C16 10.9062 15.0938 10 14 10ZM13.75 13C13.75 12.5938 13.4062 12.25 13 12.25C12.5625 12.25 12.25 12.5938 12.25 13C12.25 13.4375 12.5625 13.75 13 13.75C13.4062 13.75 13.75 13.4375 13.75 13Z" fill="white"/>
                                </svg>
                            }
                    >
                        Télécharger le document
                    </Button>


                    <div className={styles.linksContainer}>
                        <svg width="16" height="16" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.668 1.92188C11.0781 2.35156 11.0781 3.03516 10.668 3.46484L4.55469 9.57812C4.32031 9.79297 4.04688 9.96875 3.75391 10.0469L1.39062 10.75C1.27344 10.7695 1.15625 10.75 1.07812 10.6719C1 10.5938 0.960938 10.4766 1 10.3594L1.70312 7.99609C1.78125 7.70312 1.95703 7.42969 2.17188 7.19531L8.28516 1.08203C8.71484 0.671875 9.39844 0.671875 9.82812 1.08203L10.668 1.92188ZM7.66016 2.60547L9.14453 4.08984L10.2188 3.03516C10.3945 2.83984 10.3945 2.54688 10.2188 2.37109L9.37891 1.53125C9.20312 1.35547 8.91016 1.35547 8.71484 1.53125L7.66016 2.60547ZM7.21094 3.03516L2.62109 7.64453C2.46484 7.78125 2.34766 7.97656 2.28906 8.17188L1.76172 9.98828L3.57812 9.46094C3.77344 9.40234 3.96875 9.28516 4.10547 9.12891L8.69531 4.53906L7.21094 3.03516Z" fill="#002559"/>
                        </svg>

                        <Link href={"#"} onClick={handleModify}>Modifier le fichier</Link>

                        <svg width="16" height="16" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.4375 2C8.59375 2 8.75 2.15625 8.75 2.3125C8.75 2.48828 8.59375 2.625 8.4375 2.625H8.06641L7.57812 9.59766C7.51953 10.2617 6.97266 10.75 6.32812 10.75H2.40234C1.75781 10.75 1.21094 10.2617 1.15234 9.59766L0.664062 2.625H0.3125C0.136719 2.625 0 2.48828 0 2.3125C0 2.15625 0.136719 2 0.3125 2H2.16797L2.67578 1.19922C2.83203 0.925781 3.14453 0.75 3.45703 0.75H5.27344C5.58594 0.75 5.89844 0.925781 6.05469 1.19922L6.5625 2H8.4375ZM3.45703 1.375C3.35938 1.375 3.26172 1.43359 3.20312 1.53125L2.89062 2H5.83984L5.52734 1.53125C5.46875 1.43359 5.37109 1.375 5.27344 1.375H3.45703ZM7.44141 2.625H1.28906L1.77734 9.55859C1.79688 9.87109 2.07031 10.125 2.40234 10.125H6.32812C6.66016 10.125 6.93359 9.87109 6.95312 9.55859L7.44141 2.625Z" fill="#B8181E"/>
                        </svg>

                        <Link href={"#"} onClick={(e) => handleDelete(e)}>Supprimer le fichier</Link>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default FileInfo;