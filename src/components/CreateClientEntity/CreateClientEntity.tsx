import {Form, Input, Modal, Progress, Switch, message, Dropdown, Menu, MenuItemProps, MenuProps} from 'antd';
import React, {useEffect, useState} from 'react';
import { Button } from 'projex-ui-dev';
import styles from './CreateClientEntity.module.scss';
import { messages } from '../../../constants/messages';
import Upload, { RcFile, UploadFile } from 'antd/lib/upload';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
    createUsClientCompanyEntity, getUsClientsCompanyEntities,
} from "../../../services/userService/UsClientsCompanyEntities";
import {
    getUsClientsCompanyEntitiesUsers, updateUsClientCompanyEntityUser
} from '../../../services/userService/UsClientsCompanyEntitiesUsers'
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {createUsClientCompanyEntityUser} from "../../../services/userService/UsClientsCompanyEntitiesUsers";
import PlacesAutocomplete, {geocodeByAddress, Suggestion} from "react-places-autocomplete";
import getConfig from "next/config";
import {Loader} from "@googlemaps/js-api-loader";

const { publicRuntimeConfig } = getConfig();

type CreateClientEntityFormProps = {
    client?: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setNewEntity: React.Dispatch<React.SetStateAction<{ user: string, entityName: string }>>
};

const CreateClientEntityForm = ({ isOpen, setIsOpen, setNewEntity, client = null }: CreateClientEntityFormProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [assetPreview, setAssetPreview] = useState<string | undefined>(undefined);
    const [loadingImage, setLoadingImage] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number | undefined>(0);

    const [address, setAddress] = useState('');
    const [mapsApiLoaded, setMapsApiLoaded] = useState<boolean>(false);

    const [form] = Form.useForm();

    const [geocodingData, setGeocodingData] = useState({
        streetNumber: '',
        route: '',
        locality: '',
        country: '',
        postalCode: '',
    });

    useEffect(() => {
        if(!mapsApiLoaded){

            const loader = new Loader({
                apiKey: `${publicRuntimeConfig.GOOGLE_MAPS_API_KEY}`,
                version: "weekly",
            });

            loader.importLibrary("places").then(async () => {
                setMapsApiLoaded(true);
            });

        }
    }, []);
    /**
     * Before uploading the image: distinguish between Jpg or Png image formats
     * And check the image size which should be less than 4mb
     * @param file Take the uploaded file
     */
    const beforeUpload = (file: { type: string; size: number }) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/svg';
        if (!isJpgOrPng) {
            message.error(messages.general.error('Vous ne pouvez choisir que des fichiers au format JPG ou PNG.'));
        }
        const isLt2M = file.size / Math.pow(1024, 2) < 5;
        if (!isLt2M) {
            message.error(messages.general.error('La taille de votre image doit être inférieure à 5MB.'));
        }
        return isJpgOrPng && isLt2M;
    };

    function getBase64(img: RcFile | undefined, callback: (img: string) => void) {
        if (img) {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result as string));
            reader.readAsDataURL(img as Blob);
        }
    }
    const onImageUpload = (file: UploadFile) => {
        if (file.status === 'uploading') {
            setLoadingImage(true);
            setUploadProgress(file.percent);
            return;
        }
        if (file.status === 'done') {
            setLoadingImage(false);
            getBase64(file.originFileObj, (imageUrl) => setAssetPreview(imageUrl));
        }
        return false;
    };

    function CircularProgressWithLabel(props: { value: number }) {
        const percent = Math.floor(props?.value);
        return (
            <>
                <div className={styles.progressLoadingImage}>
                    <Progress type="circle" percent={percent} width={100} />
                </div>
            </>
        );
    }

    const uploadButton = (
        <div>{loadingImage && uploadProgress && <CircularProgressWithLabel value={uploadProgress} />}</div>
    );

    // @ts-ignore
    const handleChange = (newAddress) => {
        setAddress(newAddress);
    };

    // @ts-ignore
    const handleSelect = (newAddress) => {
        geocodeByAddress(newAddress)
            .then((results) => {
                if (results && results.length > 0) {
                    const result = results[0];
                    const addressComponents = result.address_components;

                    const newData = {
                        streetNumber: '',
                        route: '',
                        locality: '',
                        country: '',
                        postalCode: '',
                    };

                    addressComponents.forEach((component) => {
                        switch (component.types[0]) {
                            case 'street_number':newData.streetNumber = component.long_name;break;
                            case 'route': newData.route = component.long_name; break;
                            case 'locality': newData.locality = component.long_name; break;
                            case 'country': newData.country = component.long_name; break;
                            case 'postal_code': newData.postalCode = component.long_name; break;
                        }
                    });

                    setGeocodingData(newData);

                    form.setFieldsValue({
                        zip_code: newData.postalCode,
                        city: newData.locality,
                        country: newData.country,
                        address: parseInt(newData?.streetNumber) ? newData.streetNumber + ' ' + newData.route : newData.route
                    });
                }
            })
            .catch((error) => console.error('Error', error));
    };

    const onFinish = async (values: any) => {
        const companyEntityRes = await getUsClientsCompanyEntities({
            filter: { name: values?.entityName },
        });
        if (
            isRequestSuccessful(companyEntityRes.status) &&
            companyEntityRes?.data.length > 0
        ) {
            return message.error(
                `Une entité cliente ayant pour nom ${values?.entityName} existe déjà.`
            );
        }

        const createCompanyEntityRes = await createUsClientCompanyEntity({
            siren: values.siren,
            name: values.entityName,
            address: values.address,
            country: values.country,
            phone: values.phone,
            zip_code: values.zip_code,
            city: values.city,
            is_prospect: values.is_prospect,
            image: null,
            activities_id: null,
            clients_company_interactions_id: null,
            parameters: null,
            users: null,
        });

        if (!isRequestSuccessful(createCompanyEntityRes.status)) {
            return message.error(messages.general.error());
        }

        const clientsCompanyEntitiesRes = await getUsClientsCompanyEntities({
            filter: { name: values.entityName },
            fields: "id",
        });

        if (
            !isRequestSuccessful(clientsCompanyEntitiesRes.status) ||
            !clientsCompanyEntitiesRes?.data.length
        ) {
            return message.error(messages.general.error());
        }

        const clientsCompanyEntitiesUsersRes = await getUsClientsCompanyEntitiesUsers(
            { filter: { directus_users_id: client } }
        );

        if (
            !isRequestSuccessful(clientsCompanyEntitiesRes.status) ||
            !clientsCompanyEntitiesUsersRes?.data
        ) {
            return message.error(messages.general.error());
        }

        const entityId = clientsCompanyEntitiesRes.data[0].id;


        clientsCompanyEntitiesUsersRes.data
            .filter((assoc) => assoc.is_current_job)
            .forEach((assoc) => {
                updateUsClientCompanyEntityUser(`${assoc.id}`, {
                    end_date: new Date(),
                    is_current_job: false,
                });
            });

        const createClientCompanyEntityUserRes =
            await createUsClientCompanyEntityUser({
                is_leader: null,
                job_title: null,
                start_date: null,
                end_date: null,

                is_current_job: true,
                clients_company_entities_id: entityId,
                directus_users_id: client,
            });

        if (isRequestSuccessful(createClientCompanyEntityUserRes.status)) {
            setNewEntity({user: client, entityName: values.entityName})
            message.success(messages.general.success("Votre demande", true, false));
        } else {
            message.error(messages.general.error());
        }
        setIsOpen(false);
    };

    return (
        <Modal
            open={isOpen}
            closable
            destroyOnClose
            onCancel={() => setIsOpen(false)}
            title={"Ajouter une entité cliente"}
            footer={null}
        >
            <Form name={'editUserProfil'} form={form} autoComplete={'off'} layout={'vertical'} onFinish={onFinish}>
                {loadingImage
                    ? uploadButton
                    : assetPreview && (
                    <img
                        alt={'Preview'}
                        style={{
                            width: '80px',
                            marginBottom: '16px',
                            padding: '2px',
                            display: 'inline-block',
                            textAlign: 'center',
                        }}
                        src={assetPreview}
                    />
                )}
                    <Form.Item
                        label={"Nom de l'entité"}
                        id={'entityName'}
                        name={'entityName'}
                        style={{ display: 'flex', paddingTop: '1rem' }}
                        rules={[{ required: true, message: 'Veuillez renseigner un nom' }]}
                    >
                        <Input type={'entityName'}></Input>
                    </Form.Item>
                <Form.Item label={'N° SIREN'} id={'siren'} name={'siren'}>
                    <Input type={'text'}></Input>
                </Form.Item>
                {mapsApiLoaded && (
                    <Form.Item
                        label="Adresse"
                        name="address"
                        id="address"
                    >
                        <PlacesAutocomplete
                            value={address || ''}
                            onChange={handleChange}
                            onSelect={handleSelect}
                            shouldFetchSuggestions={address.length > 2}
                            searchOptions={{
                                componentRestrictions: { country: publicRuntimeConfig.ADDRESS_AUTO_COMPLETE_COUNTRY_LIST.split(',') },
                                types: ['address'],
                            }}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <Dropdown
                                    menu={{items:
                                            suggestions.map((suggestion: Suggestion, index: number) => ({
                                                label: (
                                                    <Menu.Item {...getSuggestionItemProps(suggestion) as MenuItemProps}>
                                                        {suggestion.description}
                                                    </Menu.Item>
                                                ),
                                                key: index,
                                            })) as MenuProps['items']
                                    }}
                                    open={suggestions.length > 0}
                                >
                                    <Input {...getInputProps()}/>
                                </Dropdown>
                            )}
                        </PlacesAutocomplete>
                    </Form.Item>
                )}
                <div className={styles.row}>
                    <Form.Item label={'Code postal'} id={'zip_code'} name={'zip_code'}>
                        <Input type={'text'}></Input>
                    </Form.Item>
                    <Form.Item label={'Ville'} id={'city'} name={'city'}>
                        <Input type={'text'}></Input>
                    </Form.Item>
                </div>
                <Form.Item label={'Pays'} id={'country'} name={'country'}>
                    <Input type={'text'}></Input>
                </Form.Item>
                <Form.Item label={'Téléphone'} id={'phone'} name={'phone'}>
                    <Input type={'tel'}></Input>
                </Form.Item>
                <Form.Item label={"L'entité est-il un prospect ?"} id={'is_prospect'} name={'is_prospect'}>
                    <Switch
                        checkedChildren={<CheckOutlined rev={undefined} />}
                        unCheckedChildren={<CloseOutlined rev={undefined} />}
                        defaultChecked={false}
                        className={styles.switch}
                    ></Switch>
                </Form.Item>

                <Form.Item label="Image de l'entité" id="avatar" name="avatar">
                    <Upload
                        id={'profil_picture'}
                        listType="picture-card"
                        className="avatar-uploader"
                        name="profil_picture"
                        accept="image/*"
                        showUploadList={false}
                        onChange={(e) => onImageUpload(e.file)}
                        beforeUpload={beforeUpload}
                    >
                        {!loadingImage && (
                            <span style={{ alignSelf: 'start', display: 'inline-block', width: '100%' }}>
                <Button loading={loading} small style={'secondary'}>
                  Ajouter une image
                </Button>
              </span>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button htmlType={'submit'} loading={loading} small>
                        {"Créer l'entité"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateClientEntityForm;
