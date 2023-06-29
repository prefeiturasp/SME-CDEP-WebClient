import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import InputTelefone from '~/components/cdep/input/telefone';
import { CDEP_INPUT_TELEFONE } from '~/core/constants/ids/input';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';

type ModalEditTelefoneProps = {
  initialValues: { telefone: string };
  updateFields: (value: { telefone: string }) => void;
  closeModal: () => void;
};

const ModalEditTelefone: React.FC<ModalEditTelefoneProps> = ({
  updateFields,
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);

  const usuarioLogin = auth?.usuarioLogin;

  const validateMessages = {
    required: 'Campo obrigatório',
  };

  const alterar = (values: { telefone: string }) =>
    usuarioService.alterarTelefone(usuarioLogin, values?.telefone);

  return (
    <ModalEditDefault
      form={form}
      title='Editar telefone'
      service={alterar}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o telefone, deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <InputTelefone inputProps={{ id: CDEP_INPUT_TELEFONE }} />
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditTelefone;
