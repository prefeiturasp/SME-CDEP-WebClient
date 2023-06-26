import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import InputEmail from '~/components/cdep/input/email';
import { CDEP_INPUT_EMAIL } from '~/core/constats/ids/input';
import { DadosUsuarioDTO } from '~/core/dto/dados-usuario-dto';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from './modal-edit-default';

type ModalEditEmailProps = {
  initialValues: DadosUsuarioDTO;
  updateFields: (value: DadosUsuarioDTO) => void;
};

const ModalEditEmail: React.FC<ModalEditEmailProps> = ({ updateFields, initialValues }) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);
  const usuarioLogin = auth?.usuarioLogin;

  const alterarEmail = (values: DadosUsuarioDTO) =>
    usuarioService.alterarEmail(usuarioLogin, values?.email);

  return (
    <ModalEditDefault
      form={form}
      title='Editar e-mail'
      service={alterarEmail}
      updateFields={updateFields}
    >
      <Form form={form} layout='vertical' autoComplete='off' initialValues={initialValues}>
        <InputEmail inputProps={{ id: CDEP_INPUT_EMAIL }} />
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditEmail;
