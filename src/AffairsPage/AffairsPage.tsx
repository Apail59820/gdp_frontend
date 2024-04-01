import React, { useRef, useEffect, useState } from "react";
import { LazyLoadingStateType } from "../../models/LazyLoadingStateType";
import { useRouter } from "next/router";
import { GdpAffairModel } from "../../models/GestionDeProjets/GdpAffairModel";
import Grid from "../components/Grid/Grid";
import Link from "next/link";
import AffairCard from "../components/AffairCard/AffairCard";
import { QueryParameters } from "../../models/DirectusModel";
import styles from "./AffairsPage.module.scss";
import { CompanyEnum } from "../../models/UserService/UsCompanyEntityModel";
import getConfig from "next/config";
import { useSelector } from "react-redux";
import { selectGlobalFilters } from "../../store/reducers/globalFilterReducer";
import GlobalFilters from "../components/GlobalFiltersComponents/GlobalFilters";
import { Button, Input, Select } from 'projex-ui';
import {
    GdPPythagoreFactureReglement,
    GdPPythagoreFactureStatut
} from "../../models/GestionDeProjets/GdpPythagoreFactureModel";
import { DeleteOutlined } from "@ant-design/icons";
import { selectCompanyEntities } from "../../store/reducers/companyEntitiesReducer";


const { publicRuntimeConfig } = getConfig();

type AffairsFiltersType = {
    search: string;
    company_entity: CompanyEnum | '';
};

type Props = {
    files: Partial<GdpAffairModel>[];
    filesCount: number | null;
    setSpecificFilters: (newFilters: QueryParameters) => void;
    lazyLoadingState: LazyLoadingStateType;
    setLazyLoadingState: (newState: LazyLoadingStateType) => void;
    disableGlobalFilters?: boolean;
};

const AffairsFiltersInitialState: AffairsFiltersType = {
    search: '',
    company_entity: '',
};

//prevent search input to trigger multiple requests by cancelling requests while user is typing
//
let timerSearch: NodeJS.Timeout;
let isNewDataLoading = false;

const AffairsPage = ({ files, setSpecificFilters, filesCount, lazyLoadingState, setLazyLoadingState, disableGlobalFilters }: Props) => {

    const router = useRouter();
    const pageRef = useRef<HTMLDivElement>(null);
    const globalFilters = useSelector(selectGlobalFilters);
    const companyEntities = useSelector(selectCompanyEntities);

    const [affairsFilters, setAffairsFilters] = useState<AffairsFiltersType>(AffairsFiltersInitialState);
    function updateSpecificFilters() {
        const filterRules: any[] = [];
        let search: string | undefined = undefined;
        if (affairsFilters.search.length > 0) search = affairsFilters.search;
        if (affairsFilters.company_entity !== '')
            filterRules.push({
                _or: [{ company_entity: { _eq: affairsFilters.company_entity } }]
            });

        const newFilters: QueryParameters = {
            search: search,
            filter: filterRules.length > 0 ? { _and: filterRules } : undefined,
        };
        setSpecificFilters(newFilters);
        setLazyLoadingState({ limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE, offset: 0, action: 'REPLACE' });
    }

    useEffect(() => {
        setAffairsFilters(AffairsFiltersInitialState);
        updateSpecificFilters();
    }, [globalFilters]);

    //Timeout to avoid too many requests
    useEffect(() => {
        clearTimeout(timerSearch);
        timerSearch = setTimeout(() => {
            updateSpecificFilters();
        }, 500);
    }, [affairsFilters]);

    function onScrollEvent(event: Event) {
        if (pageRef && pageRef.current) {
            const page = pageRef.current;
            if (page.scrollTop + page.clientHeight >= page.scrollHeight - 400) {
                if (filesCount && files.length < filesCount && !isNewDataLoading) {
                    //lazy Loading Specific
                    isNewDataLoading = true;
                    setLazyLoadingState({
                        limit: lazyLoadingState.limit,
                        offset: files.length,
                        action: 'APPEND',
                    });
                    setTimeout(() => {
                        isNewDataLoading = false;
                    }, 1000);
                }
            }
        }
    }

    //lazy loading
    useEffect(() => {
        if (pageRef && pageRef.current) pageRef.current.addEventListener('scroll', onScrollEvent);
        return () => {
            if (pageRef && pageRef.current) pageRef.current.removeEventListener('scroll', onScrollEvent);
        };
    }, [filesCount, files, lazyLoadingState]);

    return (
        <div className="page" ref={pageRef}>
            {!disableGlobalFilters && (
                <GlobalFilters />)}
            <div className={styles.affairsPage}>
                <h1 className={styles.title}>Toutes les affaires</h1>
                <div className={styles.headAndFilters}>
                    <div className={styles.InputContainer}>
                        <Input
                            label={'Rechercher une affaire'}
                            value={affairsFilters.search}
                            setValue={(value) => setAffairsFilters({ ...affairsFilters, search: `${value}` })}
                            large={false}
                        />
                    </div>
                    <div className={styles.InputContainer}>
                        <Select
                            label={'Filtrer par Entité'}
                            nullOptionText={'Toutes les entités'}
                            options={companyEntities.map((entity) => ({ value: `${entity.id}`, text: entity.name || '' }))}
                            value={affairsFilters.company_entity}
                            setValue={(value) => setAffairsFilters({ ...affairsFilters, company_entity: value as CompanyEnum })}
                        />
                    </div>
                    <div className={styles.headItemContainer}>
                        <Button
                            style={'text_gray'}
                            icon={<DeleteOutlined  />}
                            onClick={() => setAffairsFilters(AffairsFiltersInitialState)}
                        >
                            Réinitialiser les filtres
                        </Button>
                    </div>
                </div>
                <div className={styles.content}>
                    {(files?.length > 0) ? (
                        <Grid>
                            {[...files].map((affair: Partial<GdpAffairModel>) => (
                                <Link key={affair.id} href={`${router.asPath}/${affair.id}`}>
                                    <AffairCard affair={affair} onKebabMenuClick={() => console.log('Click')} />
                                </Link>
                            ))}
                        </Grid>
                    ) : (
                        <h1>
                            Aucun résultat.
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );

};

export default AffairsPage;