import { Spin } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { AxiosResponse, HttpStatusCode } from 'axios';
import React, { PropsWithChildren, useState } from 'react';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_MODAL_ALTERAR,
  CDEP_BUTTON_MODAL_CANCELAR,
} from '~/core/constants/ids/button/intex';
import { DadosUsuarioDTO } from '~/core/dto/dados-usuario-dto';
import { EnderecoUsuarioExternoDTO } from '~/core/dto/endereco-usuario-externo-dto';
import { SenhaNovaDTO } from '~/core/dto/senha-nova-dto';
import { confirmacao } from '~/core/services/alerta-service';

type ModalEditDefaultServiceProps = {
  email: string;
  telefone: string;
} & DadosUsuarioDTO &
  EnderecoUsuarioExternoDTO &
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

  const openNotificationError = (mensagens: string[]) => {
    mensagens.forEach((description) => {
      notification.error({
        message: 'Erro',
        description,
      });
    });
  };

  const openNotificationSuccess = () => {
    notification.success({
      message: 'Sucesso',
      description: 'Registro alterado com sucesso!',
    });
  };

  const handleOk = () => {
    setLoading(true);

    service(form.getFieldsValue())
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok && resposta?.data && updateFields) {
          updateFields(form.getFieldsValue());
          openNotificationSuccess();
        }
        closeModal();
      })
      .catch((erro) => {
        if (erro?.response?.data?.mensagens?.length) {
          openNotificationError(erro.response.data.mensagens);
        }
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
      confirmacao({
        content: mensagemConfirmarCancelar,
        onOk() {
          handleCancel();
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
      cancelButtonProps={{ disabled: loading, id: CDEP_BUTTON_MODAL_CANCELAR }}
      okButtonProps={{ disabled: loading, id: CDEP_BUTTON_MODAL_ALTERAR }}
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      okText='Alterar'
      cancelText='Cancelar'
    >
      <Spin spinning={loading}>{children}</Spin>
    </Modal>
  );
};

export default ModalEditDefault;
