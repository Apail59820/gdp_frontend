import { GdpFilesModel } from '../models/GdPModels';
import {downloadGdPFile, downloadGdPFileFromGCS} from "../services/gestionDeProjets/GdpFiles";
import {message} from "antd";
import {isRequestSuccessful} from "./isRequestSuccessful";
export function downloadFile(file : Partial<GdpFilesModel>) {
    if (file?.id)
        downloadGdPFile(file.id)

         .then((res) => {
                if (isRequestSuccessful(res.status)) {
                    fetch(res.data)
                        .then(response => response.blob())
                        .then(blob => {
                            let csvURL = window.URL.createObjectURL(blob);
                            let tempLink = document.createElement('a');
                            tempLink.href = csvURL;
                            tempLink.setAttribute('download', file?.filename_download);
                            document.body.appendChild(tempLink);
                            tempLink.click();
                            document.body.removeChild(tempLink);
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                } else {
                    message.error("Une erreur est survenue lors du téléchargement du fichier.");
                }
            })
            .catch((err) => {
                console.error(err);
            });
}

export function downloadFileFromGCS(file : Partial<GdpFilesModel>) {
    if (file?.id)
        downloadGdPFileFromGCS(file.filename_download)

            .then((res) => {
                if (isRequestSuccessful(res.status)) {
                    fetch(res.data)
                        .then(response => response?.url)
                        .then(url => {
                            let csvURL = url;
                            let tempLink = document.createElement('a');
                            tempLink.href = csvURL;
                            tempLink.setAttribute('download', file?.filename_download);
                            document.body.appendChild(tempLink);
                            tempLink.click();
                            document.body.removeChild(tempLink);
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                } else {
                    message.error("Une erreur est survenue lors du téléchargement du fichier.");
                }
            })
            .catch((err) => {
                console.error(err);
            });
}