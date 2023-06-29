import { Modal as ModalAntd, Spin } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { AxiosResponse } from 'axios';
import React, { PropsWithChildren, useState } from 'react';
import Modal from '~/components/lib/modal';
import { EnderecoUsuarioExternoDTO } from '~/core/dto/endereco-usuario-externo-dto';
import { SenhaNovaDTO } from '~/core/dto/senha-nova-dto';
import { Colors } from '~/core/styles/colors';

const { confirm } = ModalAntd;

type ModalEditDefaultServiceProps = {
  email: string;
  telefone: string;
} & EnderecoUsuarioExternoDTO &
  SenhaNovaDTO;

type ModalEditDefaultProps = {
  service: (values: ModalEditDefaultServiceProps) => Promise<AxiosResponse<boolean>>;
  updateFields?: (values: ModalEditDefaultServiceProps) => void;
  title: string;
  form: FormInstance<ModalEditDefaultServiceProps>;
  mensagemConfirmarCancelar: string;
  permiteEdicao?: boolean;
  closeModal: () => void;
} & PropsWithChildren;

const ModalEditDefault: React.FC<ModalEditDefaultProps> = ({
  service,
  updateFields,
  title,
  form,
  mensagemConfirmarCancelar,
  closeModal,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);

    service(form.getFieldsValue())
      .then((resposta) => {
        if (resposta?.status === 200 && resposta?.data && updateFields) {
          updateFields(form.getFieldsValue());
        }
        closeModal();
      })
      .catch(() => {
        alert('Erro ao alterar dados');
      })
      .finally(() => setLoading(false));
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      handleOk();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  const showConfirmCancel = () => {
    if (form.isFieldsTouched()) {
      confirm({
        width: 500,
        title: 'Atenção',
        icon: <></>,
        content: mensagemConfirmarCancelar,
        onOk() {
          handleCancel();
        },
        okButtonProps: { type: 'default' },
        cancelButtonProps: {
          type: 'text',
          style: { color: Colors.TEXT },
        },
      });
    } else {
      handleCancel();
    }
  };

  return (
    <Modal
      open
      title={title}
      onOk={validateFields}
      onCancel={showConfirmCancel}
      centered
      destroyOnClose
      cancelButtonProps={{ disabled: loading }}
      okButtonProps={{ disabled: loading }}
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      okText='Alterar'
    >
      <Spin spinning={loading}>{children}</Spin>
    </Modal>
  );
};

export default ModalEditDefault;
