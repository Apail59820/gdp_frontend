import React from 'react';
import { Form, Modal } from 'antd';
import { Button } from 'projex-ui';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CreateCERBEForm( {isOpen, setIsOpen }: Props ) {

    return (
        <>
            <Modal
                open={isOpen}
                closable
                onCancel={()=>setIsOpen(false)}
                footer={null}
                title={'Créer un CERBE'}
            >
                <Form
                    // Formulaire de création de CERBE
                >
                    <footer style={{display: 'flex'}}>
                        <Button small htmlType={'submit'}>Créer le CERBE</Button>
                        <Button small style={'text'} onClick={() => setIsOpen(false)}>
                            Annuler
                        </Button>
                    </footer>
                </Form>
            </Modal>
        </>
    );
}