import {GdpAffairModel} from "../../../models/GestionDeProjets/GdpAffairModel";
import Link from "next/link";
import AffairCard from "../../../src/components/AffairCard/AffairCard";
import Grid from "../../../src/components/Grid/Grid";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {getGdpAffairs} from "../../../services/gestionDeProjets/GdpAffairs";
import {getGdpProjectById} from "../../../services/gestionDeProjets/GdpProjects";
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {LazyLoadingStateType} from "../../../models/LazyLoadingStateType";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
let isNewDataLoading = false;
const AffairsFromProject = () => {

    const pageRef = useRef<HTMLDivElement>(null);

    const [lazyLoadingState, setLazyLoadingState] = useState<LazyLoadingStateType>({
        limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE,
        offset: 0,
        action: 'REPLACE',
    });

    const router = useRouter();

    const projectId = parseInt(router.query.projectId as string);

    const [projectAffairs, setProjectAffairs] = useState<Partial<GdpAffairModel>[] | null>(null);

    useEffect(() => {

        const affairsToFetch: number[] = [];
        const tmpAffairs: Partial<GdpAffairModel>[] = [];

        getGdpProjectById(projectId).then(res => {
            if(isRequestSuccessful(res?.status)){
                res?.data.affairs_ids.forEach(id => {
                    affairsToFetch.push(id);
                });
            }
        }).finally(() => {
            if (affairsToFetch.length > 0) {
                getGdpAffairs({
                    filter: {id: {_in: affairsToFetch},}
                }).then((res) => {
                    if (res.status === 200 && res.data) {
                        tmpAffairs.push(...res.data);
                        console.log(...res?.data);
                    }
                }).finally(() => {
                    if(tmpAffairs.length){
                        setProjectAffairs(tmpAffairs);
                    }
                });
            }
        });

    }, []);

    return (
            <div style={{margin: "2rem"}}>
                {(projectAffairs?.length) && (
                    <Grid>
                        {[...projectAffairs].map((affair: Partial<GdpAffairModel>) => (
                            <Link key={affair.id} href={`${router.asPath}/${affair.id}`}>
                                <AffairCard affair={affair} onKebabMenuClick={() => console.log('Click')} />
                            </Link>
                        ))}
                    </Grid>
                )}
            </div>
    );

};

export default AffairsFromProject;