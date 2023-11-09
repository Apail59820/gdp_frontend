import {retrieveToken} from "../services/auth";
import {isRequestSuccessful} from "./isRequestSuccessful";
import React from "react";

export type UpdateModel = {
    id: string;
    title: string;
    date: string;
    content: string;
};

export async function getChangelog(): Promise<{status: number, data?: UpdateModel[]}> {

    const token = await retrieveToken();

    const reqHeaders = new Headers({
        Authorization: `Bearer ${token}`,
    });

    const reqInit: RequestInit = {
        method: 'GET',
        headers: reqHeaders,
        mode: 'no-cors',
        cache: 'default',
    };

    return fetch(`/api/download/changelog`, reqInit).then(
        (res) => {
            if (isRequestSuccessful(res.status)) {
                return res.json().then((json_data) => {
                    return {status: res.status, data: json_data};
                })
            } else {
                return {status: res.status}
            }
        }
    ).catch(() => {
        return {status: 500};
    });
}
