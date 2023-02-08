import React, { ReactNode, useEffect } from 'react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { retrieveToken } from '../../../services/auth';
import { useDispatch } from 'react-redux';
import { setAuthState } from '../../../store/authSlice';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

type Props = {
  children?: ReactNode;
};

const Authenticated = ({ children }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (cookie.get("ds_access_token_catalog")) {
        dispatch(setAuthState(true));
        return;
      }
      try {
        retrieveToken().then(
          (token) => {
            if (token) dispatch(setAuthState(true));
            else {
              dispatch(setAuthState(false));
              const href = window.location.href;
              router.push(publicRuntimeConfig.USER_SERVICE_URL + "/login?r=" + href, undefined, { shallow: true });
            }
          },
          () => {
            dispatch(setAuthState(false));
            const href = window.location.href;
            router.push(publicRuntimeConfig.USER_SERVICE_URL + "/login?r=" + href, undefined, { shallow: true });
          }
        );
      } catch (e) {
        dispatch(setAuthState(false));
        const href = window.location.href;
        router.push(publicRuntimeConfig.USER_SERVICE_URL + "/login?r=" + href, undefined, { shallow: true });
      }
    }
  }, [dispatch, router]);

  return <>{children}</>;
};

export default Authenticated;
