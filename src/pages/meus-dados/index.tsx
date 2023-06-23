import { Button, Col, Form, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ButtonVoltar from '~/components/cdep/button/voltar';
import InputBairro from '~/components/cdep/input/bairro';
import InputCEP from '~/components/cdep/input/cep';
import InputCidade from '~/components/cdep/input/cidade';
import InputComplemento from '~/components/cdep/input/complemento';
import InputEmail from '~/components/cdep/input/email';
import InputEndereco from '~/components/cdep/input/endereco';
import InputEstado from '~/components/cdep/input/estado';
import InputNumero from '~/components/cdep/input/numero';
import SenhaCadastro from '~/components/cdep/input/senha-cadastro';
import InputTelefone from '~/components/cdep/input/telefone';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_VOLTAR } from '~/core/constats/ids/button/intex';
import {
  CDEP_INPUT_BAIRRO,
  CDEP_INPUT_CEP,
  CDEP_INPUT_CIDADE,
  CDEP_INPUT_COMPLEMENTO,
  CDEP_INPUT_EMAIL,
  CDEP_INPUT_ENDERECO,
  CDEP_INPUT_NUMERO,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_TELEFONE,
} from '~/core/constats/ids/input';
import { CDEP_SELECT_UF } from '~/core/constats/ids/select';
import { ROUTES } from '~/core/enum/routes';

export const DadosPerfil = styled.div`
  color: #a4a4a4;

  svg {
    font-size: 200px;
  }

  @media (max-width: 600px) {
    svg {
      font-size: 100px !important;
    }
  }

  @media (max-width: 500px) {
    svg {
      font-size: 70px !important;
    }
  }
`;

const MeusDados: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  return (
    <>
      <HeaderPage title='Meus dados'>
        <Row>
          <Col span={24}>
            <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
          </Col>
        </Row>
      </HeaderPage>
      <CardContent>
        <Row>
          <Col xs={24} md={12}>
            <Space direction='vertical' align='center' style={{ width: '100%' }}>
              <DadosPerfil>
                <FaUserCircle />
              </DadosPerfil>
            </Space>
            <Space direction='vertical' align='center' style={{ width: '100%' }}>
              <Typography.Text strong>TODO NOME</Typography.Text>
              <Typography.Text>Perfil: TODO</Typography.Text>
              <Typography.Text>RF: TODO</Typography.Text>
              <Typography.Text>CPF: TODO</Typography.Text>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Form form={form} layout='vertical' autoComplete='off'>
              <Row gutter={16}>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <InputEmail
                      inputProps={{ id: CDEP_INPUT_EMAIL, disabled: true }}
                      formItemProps={{
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <Button>Editar</Button>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <SenhaCadastro
                      inputProps={{ id: CDEP_INPUT_SENHA, disabled: true }}
                      formItemProps={{
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <Button>Editar</Button>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <InputTelefone
                      inputProps={{ id: CDEP_INPUT_TELEFONE, disabled: true }}
                      formItemProps={{
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <Button>Editar</Button>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <InputEndereco
                      inputProps={{ id: CDEP_INPUT_ENDERECO, disabled: true }}
                      formItemProps={{
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <Button>Editar</Button>
                  </Row>
                </Col>
                <Col span={12}>
                  <InputNumero
                    inputProps={{ id: CDEP_INPUT_NUMERO, disabled: true }}
                    formItemProps={{ required: false }}
                  />
                </Col>
                <Col span={12}>
                  <InputComplemento
                    inputProps={{ id: CDEP_INPUT_COMPLEMENTO, disabled: true }}
                    formItemProps={{ required: false }}
                  />
                </Col>
                <Col span={24}>
                  <InputBairro
                    inputProps={{ id: CDEP_INPUT_BAIRRO, disabled: true }}
                    formItemProps={{ required: false }}
                  />
                </Col>
                <Col span={24}>
                  <InputCEP
                    inputProps={{ id: CDEP_INPUT_CEP, disabled: true }}
                    formItemProps={{ required: false }}
                  />
                </Col>
                <Col span={24}>
                  <InputCidade
                    inputProps={{ id: CDEP_INPUT_CIDADE, disabled: true }}
                    formItemProps={{ required: false }}
                  />
                </Col>
                <Col span={12}>
                  <InputEstado
                    selectProps={{ id: CDEP_SELECT_UF, disabled: true }}
                    formItemProps={{ required: false }}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </CardContent>
    </>
  );
};

export default MeusDados;
