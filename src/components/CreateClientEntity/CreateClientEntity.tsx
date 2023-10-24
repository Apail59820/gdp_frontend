import {Form, Input, Modal, Progress, Switch, message} from 'antd';
import { useState } from 'react';
import { Button } from 'projex-ui';
import styles from './CreateClientEntity.module.scss';
import { messages } from '../../../constants/messages';
import Upload, { RcFile, UploadFile } from 'antd/lib/upload';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
    createUsClientCompanyEntity, getUsClientCompanyEntity, getUsClientsCompanyEntities,
} from "../../../services/userService/UsClientsCompanyEntities";
import {
    getUsClientsCompanyEntitiesUsers, updateUsClientCompanyEntityUser
} from '../../../services/userService/UsClientsCompanyEntitiesUsers'
import {isRequestSuccessful} from "../../../utils/isRequestSuccessful";
import {createUsClientCompanyEntityUser} from "../../../services/userService/UsClientsCompanyEntitiesUsers";

type CreateClientEntityFormProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
   // modif: boolean,
    client?: string
};

const CreateClientEntityForm = ({ isOpen, setIsOpen, client = null }: CreateClientEntityFormProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [assetPreview, setAssetPreview] = useState<string | undefined>(undefined);
    const [loadingImage, setLoadingImage] = useState<boolean>(false);
    const [allowToUploadAvatar, setAllowToUploadAvatar] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number | undefined>(0);
    const [uploadedFile, setUploadedFile] = useState<UploadFile<any>>();
    const [profilePictureChange, setProfilePictureChange] = useState<boolean>(false);
    const [onInputUserInfosChange, setOnInputUserInfosChange] = useState<boolean>(false);

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
            setAllowToUploadAvatar(false);
            setUploadProgress(file.percent);
            return;
        }
        if (file.status === 'done') {
            setLoadingImage(false);
            setAllowToUploadAvatar(true);
            setUploadedFile(file);
            getBase64(file.originFileObj, (imageUrl) => setAssetPreview(imageUrl));
            setProfilePictureChange(true);
            setOnInputUserInfosChange(true);
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

    const onFinish = (values: any)=>{
        getUsClientsCompanyEntities({filter:{name: values.entityName}})
            .then(res=>{
                console.log(res)
                if(isRequestSuccessful( res.status ) && res.data.length>0){
                    message.error("Cette entité existe déjà")
                } else {
                    createUsClientCompanyEntity({
                        siren: values.siren,
                        name: values.entityName,
                        address: values.address,
                        country: values.country,
                        phone: values.phone,
                        zip_code: values.zip_code,
                        city: values.city,
                        is_prospect: values.is_prospect,
                        image: null,
                        activities_id : null,
                        clients_company_interactions_id: null,
                        parameters: null,
                        users: null
                    })
                        .then(createRes=>{
                            console.log("/entity:created")
                            getUsClientsCompanyEntities({filter:{name:values.entityName}, fields:'id'})
                                .then(entityResult=>{
                                    const entityId = entityResult.data[0].id
                                    getUsClientsCompanyEntitiesUsers({
                                        filter:{directus_users_id:client},
                                    })
                                        .then(associationResult=>{
                                            if(isRequestSuccessful( associationResult.status )){
                                                console.log('/client:associated')
                                                console.log(
                                                    associationResult.data
                                                        .filter(assoc=>assoc.is_current_job)
                                                )
                                                associationResult.data
                                                    .filter(assoc=>assoc.is_current_job)
                                                    .forEach(assoc=>{
                                                        console.log(new Date());
                                                        updateUsClientCompanyEntityUser(
                                                            `${assoc.id}`,
                                                            {end_date:new Date(),is_current_job:false})
                                                    })
                                            }
                                        })
                                        .finally(()=>{
                                            createUsClientCompanyEntityUser({
                                                is_leader: null,
                                                job_title: null,
                                                start_date: null,
                                                end_date: null,

                                                is_current_job: true,
                                                clients_company_entities_id: entityId,
                                                directus_users_id: client,
                                            })
                                                .then(createRes=>{
                                                    console.log(createRes)
                                                })
                                        })
                                })
                        })
                    setIsOpen(false)
                }
            })
    }
    return (
        <Modal
            open={isOpen}
            closable
            destroyOnClose
            onCancel={() => setIsOpen(false)}
            title={"Ajouter une entité cliente"}
            footer={null}
        >
            <Form name={'editUserProfil'} autoComplete={'off'} layout={'vertical'} onFinish={onFinish}>
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
                <Form.Item label={'Adresse'} id={'address'} name={'address'}>
                    <Input type={'text'}></Input>
                </Form.Item>
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
