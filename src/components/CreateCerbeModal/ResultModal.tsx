import { Modal, Result } from "antd";
import { messages } from "../../../constants/messages";
import { Button } from "projex-ui";
import React from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  subject: "project" | "affair";
  subject_title: string;
  onClickConfirm: () => void;
};
const ResultModal = ({
  isOpen,
  setIsOpen,
  error,
  subject,
  subject_title,
  onClickConfirm,
}: Props) => {
  return (
    <Modal
      closable
      destroyOnClose
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      width={"40%"}
      footer={null}
    >
      <Result
        status={error ? "warning" : "success"}
        title={
          error
            ? `Une erreur est survenue lors de la création ${subject === "project" ? "du projet" : "de l'affaire"}.`
            : `${subject === "project" ? "Projet" : "Affaire"} créé${subject === "affair" && "e"} avec succès !`
        }
        subTitle={
          error
            ? messages.general.error()
            : `${subject === "project" ? "Le projet" : "L'affaire"} ${subject_title} a été créé${subject === "affair" && "e"} avec succès.`
        }
        extra={[
          <div
            style={{
              display: "inline-flex",
              gap: 20,
            }}
          >
            {!error && (
              <Button style={"primary"} small onClick={onClickConfirm}>
                Aller au formulaire CERBE
              </Button>
            )}

            <Button
              key="cancel"
              style={"secondary"}
              small
              onClick={() => setIsOpen(false)}
            >
              Retour
            </Button>
          </div>,
        ]}
      ></Result>
    </Modal>
  );
};

export default ResultModal;
