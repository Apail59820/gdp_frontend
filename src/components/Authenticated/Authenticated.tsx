import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { retrieveToken } from '../../../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState, setAuthState, setUserProfile } from '../../../store/reducers/authReducer';
import getConfig from 'next/config';
import { getMyUsProfile } from '../../../services/userService/UsUsers';
import { message } from 'antd';
import { messages } from '../../../constants/messages';

const { publicRuntimeConfig } = getConfig();

type Props = {
  children?: ReactNode;
};

const Authenticated = ({ children }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector(selectAuthState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        retrieveToken().then(
          (token) => {
            if (token) {
              if (!authState) message.success(messages.login.success(publicRuntimeConfig.APP_NAME));
              dispatch(setAuthState(true));
              getMyUsProfile().then((res) => {
                if (res.status === 200 && res.data) {
                  dispatch(setUserProfile(res.data));
                } else {
                  message.error(messages.login.error.general);
                  dispatch(setUserProfile({}));
                }
              });
            } else {
              dispatch(setAuthState(false));
              dispatch(setUserProfile({}));
              message.error(messages.login.error.general);
              const href = window.location.href;
              router.push(publicRuntimeConfig.USER_SERVICE_URL + '/login?r=' + href, undefined, { shallow: true });
            }
          },
          () => {
            dispatch(setAuthState(false));
            dispatch(setUserProfile({}));
            message.error(messages.login.error.general);
            const href = window.location.href;
            router.push(publicRuntimeConfig.USER_SERVICE_URL + '/login?r=' + href, undefined, { shallow: true });
          }
        );
      } catch (e) {
        dispatch(setAuthState(false));
        message.error(messages.login.error.general);
        const href = window.location.href;
        router.push(publicRuntimeConfig.USER_SERVICE_URL + '/login?r=' + href, undefined, { shallow: true });
      }
    }
  }, [dispatch, router]);

  return <>{children}</>;
};

export default Authenticated;
