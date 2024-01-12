import 'projex-styles/styles/globals.css';
import '../styles/globals.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {Provider} from 'react-redux';
import configureStore from '../store/store';
import Authenticated from '../src/components/Authenticated/Authenticated';
import {RetrieveGlobalData} from '../src/RetrieveGlobalData/RetrieveGlobalData';
import React, {useEffect, useState} from 'react';
import {getUserAvatarByUserId} from '../utils/assets';
import {SideBar, TopBar} from 'projex-ui';
import {getMyUsProfile} from "../services/userService/UsUsers";
import {isRequestSuccessful} from "../utils/isRequestSuccessful";
import {UsUserModel} from "../models/UserService/UsUserModel";
import getConfig from "next/config";
import {TopBarNotificationProp} from "../models/GestionDeProjets/GdpUsersNotificationModel";
import {
  getGdpUsersNotifications, getGdpUsersNotificationsCount,
  updateGdpUsersNotifications
} from "../services/gestionDeProjets/GdpUsersNotifications";
import {message} from "antd";
import {messages} from "../constants/messages";
const { publicRuntimeConfig } = getConfig();

export default function App({Component, pageProps}: AppProps) {
  const [user, setUser] = useState<Partial<UsUserModel>>({});
  const [userProfilePicture, setUserProfilePicture] = useState<string | undefined>(undefined);

  const [notificationsProps, setNotificationsProps] = useState<TopBarNotificationProp>({ messages: [], amount: 0, ids: [], onMarkAsRead: null});
  const [notifications, setNotifications] = useState<{ message: string, id: number }[]>([]);

  useEffect(() => {
    getMyUsProfile().then((res) => {
      if (isRequestSuccessful(res.status) && res.data) {
        setUser(res.data);
        if (res.data.avatar) {
          getUserAvatarByUserId(res.data.id).then((res) => {
            if (isRequestSuccessful(res.status) && res.data) {
              setUserProfilePicture(res.data);
            }
          })
        }
      }
    })
  }, []);
  async function updateNotifications() {
    const myUsProfile = await getMyUsProfile();
    getGdpUsersNotifications({
      filter: { _and : [{ seen: {_eq: false}, directus_users_id: myUsProfile?.data.id}]  },
      fields: 'id,activity_id.content',
      sort: '-date_created',
      limit: 5,
    }).then(async (res) => {
      if(isRequestSuccessful(res.status) && res?.data){
        setNotifications(res.data?.map((notification) => {
          return /* @ts-ignore */ {
            message: notification.activity_id?.content?.message,
            id: notification.id
          }
        }));
      }
    })
  }

  useEffect(() => {
    if(user?.id)
    getGdpUsersNotificationsCount(user).then((res) => {
      if(isRequestSuccessful(res.status) && notifications?.length){
        setNotificationsProps({
          messages: notifications.map((notification) => notification.message),
          amount: res.count,
          ids: notifications.map((notification) => notification.id),
          page: `${publicRuntimeConfig.USER_SERVICE_URL}/user/${user.id}?currentTab=Notifications`,
          onMarkAsRead: markAsRead
        })
      }
    })
  }, [notifications]);


  useEffect(() => {
    if(user?.id){
      updateNotifications().catch((e) => {
        console.error(e);
      })
    }
  }, [user]);

  const markAsRead = async (id: number) => {
    updateGdpUsersNotifications({keys: [id], data: {seen: true}}).then(async () => {
      await updateNotifications();
    }).catch((e) => {
      message.error(messages.general.error());
      console.log(e);
    })
  }

  return (
    <Provider store={configureStore}>
      <Authenticated>
        <RetrieveGlobalData>
          <Head>
            <meta charSet="UTF-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Maïa</title>
          </Head>
          <header id="header">
            <TopBar
              items={[
                {label: 'Gestion de projet', href: '/href', active: true},
                {label: 'Catalogue des solutions alternatives', href: `${publicRuntimeConfig.CATALOG_APP_URL}/`, active: false},
              ]}
              user={user}
              avatar={userProfilePicture}
              notifications={notificationsProps}
            />
          </header>
          <main id="main">
            <aside id="aside">
              <nav id="nav">
                <SideBar
                  items={{
                    head: [
                      {
                        label: 'Accueil',
                        href: '/',
                        icon: (
                          <svg
                            width="24"
                            height="21"
                            viewBox="0 0 24 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M23.0156 10.0312L12.4297 0.65625C12.2734 0.578125 12.1172 0.539062 12 0.539062C11.8438 0.539062 11.6875 0.578125 11.5703 0.65625L0.945312 10.0312C0.789062 10.1875 0.75 10.3438 0.75 10.5C0.75 10.8516 1.02344 11.125 1.375 11.125C1.49219 11.125 1.64844 11.0859 1.76562 10.9688L3.25 9.67969V17.375C3.25 19.0938 4.61719 20.4609 6.375 20.4609H17.5859C19.3047 20.4609 20.7109 19.0547 20.7109 17.375V9.67969L22.1953 10.9688C22.3125 11.0859 22.4688 11.125 22.5859 11.125C22.8984 11.125 23.2109 10.8516 23.2109 10.5391C23.2109 10.3438 23.1719 10.1875 23.0156 10.0312ZM13.875 19.25H10.125V13H13.875V19.25ZM19.4609 8.625V17.375C19.4609 18.4297 18.6016 19.25 17.5859 19.25H15.0859V12.8047C15.125 12.2188 14.6562 11.75 14.0703 11.75H9.92969C9.34375 11.75 8.875 12.2188 8.875 12.8047V19.25H6.375C5.32031 19.25 4.5 18.4297 4.5 17.375V8.625C4.5 8.625 4.46094 8.625 4.46094 8.58594L12 1.98438L19.5 8.58594C19.5 8.625 19.4609 8.625 19.4609 8.625Z"
                              fill="#666666"
                            />
                          </svg>
                        ),
                      },
                    ],
                    body: [
                      {
                        label: 'Projets',
                        href: '/projects',
                        icon: (
                          <svg
                            width="24"
                            height="19"
                            viewBox="0 0 24 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22.8594 7.78125C22.5078 7.3125 21.9609 7 21.3359 7H5.98438C5.20312 7 4.5 7.50781 4.22656 8.25L2 14.1875V3.25C2 2.58594 2.54688 2 3.25 2H7.82031C8.17188 2 8.48438 2.15625 8.71875 2.39062L10.8281 4.5H18.25C18.9141 4.5 19.5 5.08594 19.5 5.75H20.75C20.75 4.38281 19.6172 3.25 18.25 3.25H11.375L9.57812 1.49219C9.10938 1.02344 8.48438 0.75 7.82031 0.75H3.25C1.84375 0.75 0.75 1.88281 0.75 3.25V15.75C0.75 17.1562 1.84375 18.25 3.25 18.25H18.9922C19.8125 18.25 20.5156 17.7422 20.75 16.9609L23.0938 9.46094C23.3281 8.875 23.2109 8.25 22.8594 7.78125ZM21.9609 9.07031L19.6172 16.5703C19.5391 16.8438 19.3047 17 18.9922 17H3.25C3.09375 17 2.97656 17 2.85938 16.9609C2.78125 16.8828 2.70312 16.8438 2.66406 16.7656C2.54688 16.5703 2.50781 16.375 2.58594 16.1797L5.39844 8.67969C5.47656 8.44531 5.71094 8.25 5.98438 8.25H21.375C21.5703 8.25 21.7266 8.36719 21.8438 8.52344C21.9609 8.67969 22 8.875 21.9609 9.07031Z"
                              fill="#666666"
                            />
                          </svg>
                        ),
                      },
                      {
                        label: 'Facturation',
                        href: '/billing',
                        icon: (
                          <svg
                            width="16"
                            height="21"
                            viewBox="0 0 16 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.625 6.75H6.125C6.4375 6.75 6.75 6.47656 6.75 6.125C6.75 5.8125 6.4375 5.5 6.125 5.5H3.625C3.27344 5.5 3 5.8125 3 6.125C3 6.47656 3.27344 6.75 3.625 6.75ZM3.625 4.25H6.125C6.4375 4.25 6.75 3.97656 6.75 3.625C6.75 3.3125 6.4375 3 6.125 3H3.625C3.27344 3 3 3.3125 3 3.625C3 3.97656 3.27344 4.25 3.625 4.25ZM14.7578 5.42188L10.5781 1.24219C10.1094 0.773438 9.48438 0.5 8.82031 0.5H3C1.59375 0.5 0.5 1.63281 0.5 3V18C0.5 19.4062 1.59375 20.5 3 20.5H13C14.3672 20.5 15.5 19.4062 15.5 18V7.17969C15.5 6.51562 15.2266 5.89062 14.7578 5.42188ZM9.25 1.86719C9.40625 1.90625 9.5625 1.98438 9.71875 2.14062L13.8594 6.28125C14.0156 6.4375 14.0938 6.59375 14.1328 6.75H9.875C9.52344 6.75 9.25 6.47656 9.25 6.125V1.86719ZM14.25 18C14.25 18.7031 13.6641 19.25 13 19.25H3C2.29688 19.25 1.75 18.7031 1.75 18V3C1.75 2.33594 2.29688 1.75 3 1.75H8V6.125C8 7.17969 8.82031 8 9.875 8H14.25V18ZM3 11.125V13.625C3 14.3281 3.54688 14.875 4.25 14.875H11.75C12.4141 14.875 13 14.3281 13 13.625V11.125C13 10.4609 12.4141 9.875 11.75 9.875H4.25C3.54688 9.875 3 10.4609 3 11.125ZM11.75 13.625H4.25V11.125H11.75V13.625ZM12.375 16.75H9.875C9.52344 16.75 9.25 17.0625 9.25 17.375C9.25 17.7266 9.52344 18 9.875 18H12.375C12.6875 18 13 17.7266 13 17.375C13 17.0625 12.6875 16.75 12.375 16.75Z"
                              fill="#666666"
                            />
                          </svg>
                        ),
                      },
                      {
                        label: 'Fichiers',
                        href: '/files',
                        icon: (
                          <svg
                            width="18"
                            height="21"
                            viewBox="0 0 18 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.375 19.25H4C2.59375 19.25 1.5 18.1562 1.5 16.75V4.875C1.5 4.5625 1.1875 4.25 0.875 4.25C0.523438 4.25 0.25 4.5625 0.25 4.875V16.75C0.25 18.8594 1.89062 20.5 4 20.5H13.375C13.6875 20.5 14 20.2266 14 19.875C14 19.5625 13.6875 19.25 13.375 19.25ZM17.0078 4.95312L13.2969 1.24219C12.8281 0.773438 12.2031 0.5 11.5391 0.5H6.5C5.09375 0.5 4 1.63281 4 3V14.25C4 15.6562 5.09375 16.75 6.5 16.75H15.25C16.6172 16.75 17.75 15.6562 17.75 14.25V6.71094C17.75 6.04688 17.4766 5.42188 17.0078 4.95312ZM12.75 2.45312L15.7969 5.5H13.375C13.0234 5.5 12.75 5.22656 12.75 4.875V2.45312ZM16.5 14.25C16.5 14.9531 15.9141 15.5 15.25 15.5H6.5C5.79688 15.5 5.25 14.9531 5.25 14.25V3C5.25 2.33594 5.79688 1.75 6.5 1.75H11.5V4.875C11.5 5.92969 12.3203 6.75 13.375 6.75H16.5V14.25Z"
                              fill="#666666"
                            />
                          </svg>
                        ),
                      },
                      /*{
                        label: 'Statistiques',
                        href: '/stats',
                        icon: (
                          <svg
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.80469 11.8438L8.75 7.89844L12.0312 11.2188C12.2656 11.4531 12.6953 11.4531 12.9297 11.2188L18.5547 5.63281C18.7891 5.35938 18.7891 4.96875 18.5547 4.73438C18.3203 4.5 17.8906 4.5 17.6562 4.73438L12.5 9.89062L9.17969 6.57031C8.94531 6.33594 8.51562 6.33594 8.28125 6.57031L3.90625 10.9453C3.67188 11.1797 3.67188 11.6094 3.90625 11.8438C4.14062 12.0781 4.57031 12.0781 4.80469 11.8438ZM19.375 17H3.125C2.07031 17 1.25 16.1797 1.25 15.125V1.375C1.25 1.0625 0.9375 0.75 0.625 0.75C0.273438 0.75 0 1.0625 0 1.375V15.125C0 16.8828 1.36719 18.25 3.125 18.25H19.375C19.6875 18.25 20 17.9766 20 17.625C20 17.3125 19.6875 17 19.375 17Z"
                              fill="#666666"
                            />
                          </svg>
                        ),
                      },*/
                      /*{
                        label: 'Utilisateurs',
                        href: `${publicRuntimeConfig.USER_SERVICE_URL}/users`,
                        icon: (
                          <svg
                            width="26"
                            height="21"
                            viewBox="0 0 26 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.9609 13C15.2266 13 17.0234 11.2031 17.0234 8.9375C17.0234 6.71094 15.1875 4.875 12.9609 4.875C10.7344 4.875 8.9375 6.71094 8.9375 8.9375C8.89844 11.2031 10.7344 13 12.9609 13ZM12.9609 6.125C14.5234 6.125 15.7734 7.41406 15.7734 8.9375C15.7734 10.5 14.5234 11.75 12.9609 11.75C11.4375 11.75 10.1484 10.5 10.1484 8.9375C10.1484 7.41406 11.4375 6.125 12.9609 6.125ZM14.9141 14.25H11.0469C7.96094 14.25 5.5 16.5938 5.5 19.4844C5.5 20.0703 5.96875 20.5 6.59375 20.5H19.3672C19.9922 20.5 20.5 20.0703 20.5 19.4844C20.5 16.5938 18 14.25 14.9141 14.25ZM6.75 19.25C6.86719 17.1797 8.74219 15.5 11.0078 15.5H14.9141C17.2188 15.5 19.0938 17.1797 19.2109 19.25H6.75ZM20.5 6.75C22.2188 6.75 23.625 5.38281 23.625 3.625C23.625 1.90625 22.2188 0.5 20.5 0.5C18.7422 0.5 17.375 1.90625 17.375 3.625C17.375 5.38281 18.7422 6.75 20.5 6.75ZM20.5 1.75C21.5156 1.75 22.375 2.60938 22.375 3.625C22.375 4.67969 21.5156 5.5 20.5 5.5C19.4453 5.5 18.625 4.67969 18.625 3.625C18.625 2.60938 19.4453 1.75 20.5 1.75ZM5.5 6.75C7.21875 6.75 8.625 5.38281 8.625 3.625C8.625 1.90625 7.21875 0.5 5.5 0.5C3.74219 0.5 2.375 1.90625 2.375 3.625C2.375 5.38281 3.74219 6.75 5.5 6.75ZM5.5 1.75C6.51562 1.75 7.375 2.60938 7.375 3.625C7.375 4.67969 6.51562 5.5 5.5 5.5C4.44531 5.5 3.625 4.67969 3.625 3.625C3.625 2.60938 4.44531 1.75 5.5 1.75ZM22.4141 8H19.875C19.4062 8 18.9766 8.11719 18.5859 8.3125C18.2734 8.46875 18.1562 8.82031 18.2734 9.13281C18.4297 9.44531 18.8203 9.60156 19.1328 9.44531C19.3672 9.32812 19.6016 9.25 19.875 9.25H22.4141C23.3906 9.25 24.25 10.1484 24.25 11.2422V11.75C24.25 12.1016 24.5234 12.375 24.875 12.375C25.1875 12.375 25.5 12.1016 25.5 11.75V11.2422C25.5 9.48438 24.0938 8 22.4141 8ZM6.82812 9.44531C7.14062 9.60156 7.53125 9.44531 7.6875 9.13281C7.80469 8.82031 7.6875 8.46875 7.375 8.3125C6.98438 8.11719 6.55469 8 6.125 8H3.54688C1.86719 8 0.5 9.48438 0.5 11.2422V11.75C0.5 12.1016 0.773438 12.375 1.125 12.375C1.4375 12.375 1.75 12.1016 1.75 11.75V11.2422C1.75 10.1484 2.57031 9.25 3.54688 9.25H6.125C6.35938 9.25 6.59375 9.32812 6.82812 9.44531Z"
                              fill="#666666"
                            />
                          </svg>
                        ),
                      },*/
                    ],
                    foot: [
                      {
                        label: 'Paramètres',
                        href: '/settings',
                        icon: (
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.96094 20.5C7.77344 20.5 6.99219 20.0703 6.99219 19.1328V17.5703C6.36719 17.3359 5.82031 16.9844 5.3125 16.6328L3.98438 17.375C3.78906 17.4922 3.59375 17.5312 3.39844 17.5312C1.95312 17.5312 0.390625 13.9375 0.390625 13.3125C0.390625 12.8828 0.625 12.4531 1.01562 12.2578L2.34375 11.4766C2.34375 11.1641 2.30469 10.8125 2.30469 10.5C2.30469 10.1484 2.34375 9.83594 2.38281 9.52344L1.05469 8.78125C0.664062 8.58594 0.429688 8.15625 0.429688 7.72656C0.429688 7.25781 1.91406 3.46875 3.39844 3.46875C3.63281 3.46875 3.82812 3.54688 4.02344 3.66406L5.35156 4.40625C5.85938 4.05469 6.40625 3.70312 6.99219 3.46875V1.90625C6.99219 0.695312 8.39844 0.5 10 0.5C11.5234 0.5 12.9297 0.695312 12.9297 1.90625V3.46875C13.5156 3.70312 14.0625 4.01562 14.5703 4.40625L15.8984 3.66406C16.0938 3.54688 16.2891 3.50781 16.5234 3.50781C17.9297 3.50781 19.4922 7.10156 19.4922 7.72656C19.4922 8.15625 19.2578 8.58594 18.8672 8.78125L17.5391 9.5625C17.5781 9.875 17.6172 10.1875 17.6172 10.5C17.6172 10.8125 17.5781 11.1641 17.5391 11.4766L18.8672 12.2578C19.2578 12.4531 19.4922 12.8828 19.4922 13.3125C19.4922 13.7812 18.0078 17.5312 16.5234 17.5312C16.2891 17.5312 16.0938 17.4922 15.8984 17.375L14.5703 16.6328C14.0625 16.9844 13.5156 17.3359 12.9297 17.5703V19.1328C12.9688 20.0703 12.1875 20.5 9.96094 20.5ZM5.46875 15.1094C6.875 16.3203 7.53906 16.4375 8.24219 16.7109V19.1328C8.82812 19.2109 9.375 19.25 9.96094 19.25C10.5469 19.25 11.1328 19.2109 11.7188 19.0938L11.6797 16.7109C12.3438 16.4766 13.0859 16.2812 14.4531 15.1094L16.5625 16.3203C17.3047 15.4609 17.8906 14.4453 18.2422 13.3125L16.2109 12.1406C16.2891 11.5547 16.3672 11.125 16.3672 10.5781C16.3672 10.1875 16.3281 9.67969 16.2109 8.89844L18.2812 7.72656C17.8906 6.63281 17.3047 5.61719 16.5234 4.71875L14.4531 5.92969C13.0859 4.71875 12.4219 4.60156 11.6797 4.32812V1.90625C11.1328 1.82812 10.5859 1.78906 10 1.78906C9.41406 1.78906 8.82812 1.82812 8.20312 1.94531L8.24219 4.32812C7.61719 4.5625 6.875 4.71875 5.46875 5.92969L3.39844 4.71875C2.65625 5.61719 2.07031 6.63281 1.67969 7.76562L3.75 8.89844C3.67188 9.48438 3.59375 9.91406 3.59375 10.4219C3.59375 10.8516 3.63281 11.3594 3.75 12.1016L1.67969 13.3125C2.07031 14.3672 2.65625 15.3828 3.4375 16.2812L5.46875 15.1094ZM10 14.25C7.92969 14.25 6.25 12.5703 6.25 10.5C6.25 8.42969 7.92969 6.75 10 6.75C12.0312 6.75 13.75 8.42969 13.75 10.5C13.75 12.5703 12.0312 14.25 10 14.25ZM10 8C8.59375 8 7.5 9.09375 7.5 10.5C7.5 11.8672 8.59375 13 10 13C11.3672 13 12.5 11.8672 12.5 10.5C12.5 9.09375 11.3672 8 10 8Z"
                              fill="#666666"
                            />
                          </svg>
                        ),
                      },
                    ],
                  }}
                />
              </nav>
            </aside>
            <div id="content">
              <Component {...pageProps} />
            </div>
          </main>
        </RetrieveGlobalData>
      </Authenticated>
    </Provider>
  );
}
