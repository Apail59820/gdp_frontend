import React from 'react';
import { useRouter } from 'next/router';
import { logout } from '../services/auth';
import getConfig from 'next/config';
import styles from './logout.module.css'

const { publicRuntimeConfig } = getConfig();
const Logout = () => {
    const router = useRouter();

    if (typeof window !== 'undefined') {
        logout()
            .then(() => {
                router.push(`${publicRuntimeConfig.USER_SERVICE_URL}/login?r=${publicRuntimeConfig.GESTION_DE_PROJET_URL}/`);
            })
    }

    return <div className={styles.waiting}>
        <img src={'/logo-groupe-projex.svg'}/>
        Vous serez déconnecté d'ici un instant
    </div>;
};

Logout.getInitialProps = () => {
    return {};
};

export default Logout;
