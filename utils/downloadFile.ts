import { GdpFilesModel } from '../models/GdPModels';
import {downloadGdPFile} from "../services/gestionDeProjets/GdpFiles";
import {message} from "antd";
import {isRequestSuccessful} from "./isRequestSuccessful";
export function downloadFile(file : Partial<GdpFilesModel>) {
    if (file?.id)
        downloadGdPFile(file.id)

         .then((res) => {
                if (isRequestSuccessful(res.status)) {
                    var data = new Blob([res.data], {type: file?.type});
                    var csvURL = window.URL.createObjectURL(data);
                    let tempLink = document.createElement('a');
                    tempLink.href = csvURL;
                    tempLink.setAttribute('download', file?.filename_download);
                    tempLink.click();
                } else {
                    message.error("Une erreur est survenue lors du téléchargement du fichier.");
                }
            })
            .catch((err) => {
                console.error(err);
            });
}