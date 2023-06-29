import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import ModalEditEndereco from './modal-edit-endereco';
import { EnderecoUsuarioExternoDTO } from '~/core/dto/endereco-usuario-externo-dto';

type ModalEditEnderecoButtonProps = {
  formPreview: FormInstance;
  permiteEdicao: boolean;
};

const ModalEditEnderecoButton: React.FC<ModalEditEnderecoButtonProps> = ({
  formPreview,
  permiteEdicao,
}) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  if (!permiteEdicao) return <></>;

  const updateFields = (values: EnderecoUsuarioExternoDTO) => {
    formPreview.setFieldsValue({ ...values });
  };

  return (
    <>
      <Button onClick={showModal}>Editar</Button>
      {open && (
        <ModalEditEndereco
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ModalEditEnderecoButton;
