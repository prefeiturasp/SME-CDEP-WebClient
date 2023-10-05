import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import ModalEditTipoUsuario from './modal-edit-tipo-usuario';

type ModalEditTipoUsuarioButtonProps = {
  formPreview: FormInstance;
};

const ModalEditTipoUsuarioButton: React.FC<ModalEditTipoUsuarioButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const updateFields = (values: { tipo: number }) => {
    formPreview.setFieldValue('tipo', values?.tipo);
  };

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditTipoUsuario
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ModalEditTipoUsuarioButton;
