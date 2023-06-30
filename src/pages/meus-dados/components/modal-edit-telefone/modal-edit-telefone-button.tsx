import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import ModalEditTelefone from './modal-edit-telefone';

type ModalEditTelefoneButtonProps = {
  formPreview: FormInstance;
  permiteEdicao: boolean;
};

const ModalEditTelefoneButton: React.FC<ModalEditTelefoneButtonProps> = ({
  formPreview,
  permiteEdicao,
}) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  if (!permiteEdicao) return <></>;

  const updateFields = (values: { telefone: string }) => {
    formPreview.setFieldValue('telefone', values?.telefone);
  };

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditTelefone
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ModalEditTelefoneButton;
