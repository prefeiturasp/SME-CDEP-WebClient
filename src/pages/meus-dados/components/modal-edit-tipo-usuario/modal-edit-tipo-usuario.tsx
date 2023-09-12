import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import InputTipoUsuario from '~/components/cdep/input/tipo-usuario';
import { CDEP_SELECT_TIPO_USUARIO } from '~/core/constants/ids/select';
import { validateMessages } from '~/core/constants/validate-messages';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';

type ModalEditTipoUsuarioProps = {
  initialValues: { tipo: number };
  updateFields: (values: { tipo: number }) => void;
  closeModal: () => void;
};

const ModalEditTipoUsuario: React.FC<ModalEditTipoUsuarioProps> = ({
  updateFields,
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);

  const usuarioLogin = auth?.usuarioLogin;

  const alterarTipoUsuario = (values: { tipo: number }) =>
    usuarioService.alterarTipoUsuario(usuarioLogin, values?.tipo);

  return (
    <ModalEditDefault
      form={form}
      title='Alterar o tipo'
      service={alterarTipoUsuario}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o novo tipo, deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <InputTipoUsuario
          selectProps={{ id: CDEP_SELECT_TIPO_USUARIO }}
          formItemProps={{ required: true }}
        />
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditTipoUsuario;
