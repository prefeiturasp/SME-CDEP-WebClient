import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
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
} from '~/core/constants/ids/input';
import { CDEP_SELECT_UF } from '~/core/constants/ids/select';
import { EnderecoUsuarioExternoDTO } from '~/core/dto/endereco-usuario-externo-dto';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';
import { RetornoCEPDTO } from '~/core/dto/retorno-cep-dto';
import enderecoService from '~/core/services/endereco-service';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';

type ModalEditEnderecoProps = {
  closeModal: () => void;
  initialValues: EnderecoUsuarioExternoDTO;
  updateFields: (values: EnderecoUsuarioExternoDTO) => void;
};

const ModalEditEndereco: React.FC<ModalEditEnderecoProps> = ({
  closeModal,
  updateFields,
  initialValues,
}) => {
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [obterCEP, setObterCEP] = useState<RetornoCEPDTO | undefined>();

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

  const getCEP = (value: string) => {
    setLoading(true);
    enderecoService
      .obterDadosCEP(value)
      .then((resposta) => {
        const data = resposta.data;
        const {
          cep,
          bairro,
          uf: estado,
          complemento,
          localidade: cidade,
          logradouro: endereco,
        } = data;

        setObterCEP({ ...data });
        form.setFieldsValue({
          cep,
          estado,
          bairro,
          cidade,
          endereco,
          complemento,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <ModalEditDefault
      form={form}
      title='Alterar endereço'
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
          <Col span={8}>
            <InputCEP
              inputProps={{
                id: CDEP_INPUT_CEP,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = removerTudoQueNaoEhDigito(e.target.value);
                  value.length === 8 ? getCEP(value) : '';
                },
              }}
              formItemProps={{
                hasFeedback: loading,
                validateStatus: loading ? 'validating' : '',
              }}
            />
          </Col>
          <Col span={16}>
            <InputEndereco inputProps={{ id: CDEP_INPUT_ENDERECO }} />
          </Col>
          <Col span={8}>
            <InputNumero inputProps={{ id: CDEP_INPUT_NUMERO }} />
          </Col>
          <Col span={16}>
            <InputComplemento
              inputProps={{ id: CDEP_INPUT_COMPLEMENTO, value: obterCEP?.complemento }}
            />
          </Col>
          <Col span={24}>
            <InputBairro inputProps={{ id: CDEP_INPUT_BAIRRO, value: obterCEP?.bairro }} />
          </Col>
          <Col span={16}>
            <InputCidade inputProps={{ id: CDEP_INPUT_CIDADE, value: obterCEP?.localidade }} />
          </Col>
          <Col span={8}>
            <InputEstado selectProps={{ id: CDEP_SELECT_UF, value: obterCEP?.uf }} />
          </Col>
        </Row>
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditEndereco;
