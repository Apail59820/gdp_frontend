import React, {useRef} from "react";
import {LazyLoadingStateType} from "../../models/LazyLoadingStateType";
import {useRouter} from "next/router";
import {GdpAffairModel} from "../../models/GestionDeProjets/GdpAffairModel";
import Grid from "../components/Grid/Grid";
import Link from "next/link";
import AffairCard from "../components/AffairCard/AffairCard";
import {QueryParameters} from "../../models/DirectusModel";
import styles from "./AffairsPage.module.scss";
import BillingTable from "../components/BillingTable/BillingTable";


type Props = {
    files: Partial<GdpAffairModel>[];
    filesCount: number | null;
    setSpecificFilters: (newFilters: QueryParameters) => void;
    lazyLoadingState: LazyLoadingStateType;
    setLazyLoadingState: (newState: LazyLoadingStateType) => void;
    disableGlobalFilters?: boolean;
};

const AffairsPage = ({ files, setSpecificFilters, filesCount, lazyLoadingState, setLazyLoadingState, disableGlobalFilters }: Props) => {

    const router = useRouter();
    const pageRef = useRef<HTMLDivElement>(null);

    return (
        <div className="page" ref={pageRef}>
            <div className={styles.affairsPage}>
                <h1 className={styles.title}>Toutes les affaires</h1>
                <div className={styles.content}>
                    {(files?.length) && (
                        <Grid>
                            {[...files].map((affair: Partial<GdpAffairModel>) => (
                                <Link key={affair.id} href={`${router.asPath}/${affair.id}`}>
                                    <AffairCard affair={affair} onKebabMenuClick={() => console.log('Click')} />
                                </Link>
                            ))}
                        </Grid>
                    )}
                </div>
            </div>
        </div>
    );

};

export default AffairsPage;