import { Button, Spin } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { AxiosResponse } from 'axios';
import React, { PropsWithChildren, useState } from 'react';
import Modal from '~/components/lib/modal';
import { DadosUsuarioDTO } from '~/core/dto/dados-usuario-dto';

type ModalEditDefaultProps = {
  service: (values: DadosUsuarioDTO) => Promise<AxiosResponse<boolean>>;
  updateFields: (value: DadosUsuarioDTO) => void;
  title: string;
  form: FormInstance<DadosUsuarioDTO>;
} & PropsWithChildren;

const ModalEditDefault: React.FC<ModalEditDefaultProps> = ({
  service,
  updateFields,
  title,
  form,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const handleOk = () => {
    setLoading(true);

    service(form.getFieldsValue())
      .then((resposta) => {
        if (resposta?.status === 200 && resposta?.data) {
          updateFields(form.getFieldsValue());
        }
      })
      .catch(() => {
        alert('Erro ao alterar dados');
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>Editar</Button>
      <Modal
        open={open}
        title={title}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        destroyOnClose
        cancelButtonProps={{ disabled: loading }}
        okButtonProps={{ disabled: loading }}
        closable={!loading}
        maskClosable={!loading}
        keyboard={!loading}
        okText='Confirmar'
      >
        <Spin spinning={loading}>{children}</Spin>
      </Modal>
    </>
  );
};

export default ModalEditDefault;
