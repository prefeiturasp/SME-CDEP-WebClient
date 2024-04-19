import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import InputEmail from '~/components/cdep/input/email';
import { CDEP_INPUT_EMAIL } from '~/core/constants/ids/input';
import { validateMessages } from '~/core/constants/validate-messages';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';

type ModalEditEmailProps = {
  initialValues: { email: string };
  updateFields: (values: { email: string }) => void;
  closeModal: () => void;
};

const ModalEditEmail: React.FC<ModalEditEmailProps> = ({
  updateFields,
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);

  const usuarioLogin = auth?.usuarioLogin;

  const alterarEmail = (values: { email: string }) =>
    usuarioService.alterarEmail(usuarioLogin, values?.email);

  return (
    <ModalEditDefault
      form={form}
      title='Alterar e-mail'
      service={alterarEmail}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o novo e-mail, deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <InputEmail inputProps={{ id: CDEP_INPUT_EMAIL }} />
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditEmail;
