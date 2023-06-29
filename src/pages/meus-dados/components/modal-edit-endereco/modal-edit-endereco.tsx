import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import InputBairro from '~/components/cdep/input/bairro';
import InputCEP from '~/components/cdep/input/cep';
import InputCidade from '~/components/cdep/input/cidade';
import InputComplemento from '~/components/cdep/input/complemento';
import InputEndereco from '~/components/cdep/input/endereco';
import InputEstado from '~/components/cdep/input/estado';
import InputNumero from '~/components/cdep/input/numero';
import {
  CDEP_INPUT_BAIRRO,
  CDEP_INPUT_CEP,
  CDEP_INPUT_CIDADE,
  CDEP_INPUT_COMPLEMENTO,
  CDEP_INPUT_ENDERECO,
  CDEP_INPUT_NUMERO,
} from '~/core/constats/ids/input';
import { CDEP_SELECT_UF } from '~/core/constats/ids/select';
import { EnderecoUsuarioExternoDTO } from '~/core/dto/endereco-usuario-externo-dto';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';

type ModalEditEnderecoProps = {
  initialValues: EnderecoUsuarioExternoDTO;
  updateFields: (values: EnderecoUsuarioExternoDTO) => void;
  closeModal: () => void;
};

const ModalEditEndereco: React.FC<ModalEditEnderecoProps> = ({
  updateFields,
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();

  const auth = useAppSelector((store) => store.auth);

  const usuarioLogin = auth?.usuarioLogin;

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      range: 'Deve ter entre ${min} e ${max} caracteres',
    },
  };

  const alterar = (values: EnderecoUsuarioExternoDTO) =>
    usuarioService.alterarEndereco(usuarioLogin, values);

  return (
    <ModalEditDefault
      form={form}
      title='Editar endereço'
      service={alterar}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o endereço, deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <InputEndereco inputProps={{ id: CDEP_INPUT_ENDERECO }} />
          </Col>
          <Col span={8}>
            <InputNumero inputProps={{ id: CDEP_INPUT_NUMERO }} />
          </Col>
          <Col span={16}>
            <InputComplemento inputProps={{ id: CDEP_INPUT_COMPLEMENTO }} />
          </Col>
          <Col span={16}>
            <InputBairro inputProps={{ id: CDEP_INPUT_BAIRRO }} />
          </Col>
          <Col span={8}>
            <InputCEP inputProps={{ id: CDEP_INPUT_CEP }} />
          </Col>
          <Col span={16}>
            <InputCidade inputProps={{ id: CDEP_INPUT_CIDADE }} />
          </Col>
          <Col span={8}>
            <InputEstado selectProps={{ id: CDEP_SELECT_UF }} />
          </Col>
        </Row>
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditEndereco;
