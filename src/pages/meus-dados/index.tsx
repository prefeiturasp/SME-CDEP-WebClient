import { Col, Form, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
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
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CDEP_INPUT_BAIRRO,
  CDEP_INPUT_CEP,
  CDEP_INPUT_CIDADE,
  CDEP_INPUT_COMPLEMENTO,
  CDEP_INPUT_EMAIL,
  CDEP_INPUT_ENDERECO,
  CDEP_INPUT_INSTITUICAO_EMPRESA,
  CDEP_INPUT_NUMERO,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_TELEFONE,
} from '~/core/constants/ids/input';
import { CDEP_SELECT_TIPO_USUARIO, CDEP_SELECT_UF } from '~/core/constants/ids/select';
import { DadosUsuarioDTO } from '~/core/dto/dados-usuario-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import usuarioService from '~/core/services/usuario-service';
import ModalEditEmailButton from './components/modal-edit-email/modal-edit-email-button';
import ModalEditEnderecoButton from './components/modal-edit-endereco/modal-edit-endereco-button';
import ModalEditNovaSenhaButton from './components/modal-edit-nova-senha/modal-edit-nova-senha-button';
import ModalEditTelefoneButton from './components/modal-edit-telefone/modal-edit-telefone-button';
import { LISTA_TIPO_USUARIO } from '~/core/constants/lista-tipo-usuario';
import ModalEditTipoUsuarioButton from './components/modal-edit-tipo-usuario/modal-edit-tipo-usuario-button';
import InputTipoUsuario from '~/components/cdep/input/tipo-usuario';
import InputInstituicao from '~/components/cdep/input/instituicao';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';

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
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const auth = useAppSelector((store) => store.auth);
  const perfil = useAppSelector((store) => store.perfil);

  const usuarioLogin = auth?.usuarioLogin;
  const usuarioNome = auth?.usuarioNome;
  const perfilNome = perfil.perfilSelecionado?.perfilNome;

  const [meusDados, setMeusDados] = useState<DadosUsuarioDTO>();

  const tipoUsuario = LISTA_TIPO_USUARIO.filter(
    (tipo) => tipo.value === meusDados?.tipo && tipo.label,
  );

  const usuarioCORESSO = meusDados?.tipo === TipoUsuario.CORESSO;

  const perfil2 = useAppSelector((state) => state.perfil);

  const perfisAdmin = [
    TipoPerfil.ADMIN_GERAL,
    TipoPerfil.ADMIN_BIBLIOTECA,
    TipoPerfil.ADMIN_MEMORIA,
    TipoPerfil.ADMIN_MEMORIAL,
  ];

  const ehPerfilAdmin =
    perfil2 && perfisAdmin.includes(perfil.perfilSelecionado?.perfil as TipoPerfil);

  const onClickVoltar = () => navigate(ehPerfilAdmin ? ROUTES.INDICADORES : ROUTES.PRINCIPAL);

  const obterDados = useCallback(() => {
    dispatch(setSpinning(true));
    usuarioService
      .obterMeusDados(usuarioLogin)
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          setMeusDados({ ...resposta.data });
          form.setFieldsValue(resposta.data);
        }
      })
      .catch(() => alert('erro ao obter meus dados'))
      .finally(() => dispatch(setSpinning(false)));
  }, [usuarioLogin, form, dispatch]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

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
              <Typography.Text strong>{usuarioNome}</Typography.Text>
              <Typography.Text>Perfil: {perfilNome} </Typography.Text>
              <Typography.Text>Login: {meusDados?.login}</Typography.Text>
              <Typography.Text>CPF: {meusDados?.cpf}</Typography.Text>
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
                    <ModalEditEmailButton formPreview={form} />
                  </Row>
                </Col>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <SenhaCadastro
                      inputProps={{
                        id: CDEP_INPUT_SENHA,
                        disabled: true,
                      }}
                      formItemProps={{
                        initialValue: '************',
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <ModalEditNovaSenhaButton />
                  </Row>
                </Col>
                {!usuarioCORESSO && (
                  <>
                    <Col span={24}>
                      <Row wrap={false} align='middle'>
                        <InputTelefone
                          inputProps={{ id: CDEP_INPUT_TELEFONE, disabled: true }}
                          formItemProps={{
                            style: { width: '100%', marginRight: '8px' },
                            required: false,
                          }}
                        />
                        <ModalEditTelefoneButton formPreview={form} />
                      </Row>
                    </Col>
                    <Col span={8}>
                      <Row wrap={false} align='middle'>
                        <InputCEP
                          inputProps={{ id: CDEP_INPUT_CEP, disabled: true }}
                          formItemProps={{
                            required: false,
                            style: { width: '100%', marginRight: '8px' },
                          }}
                        />
                      </Row>
                    </Col>
                    <Col span={16}>
                      <Row wrap={false} align='middle'>
                        <InputEndereco
                          inputProps={{ id: CDEP_INPUT_ENDERECO, disabled: true }}
                          formItemProps={{
                            required: false,
                            style: { width: '100%', marginRight: '8px' },
                          }}
                        />
                        <ModalEditEnderecoButton formPreview={form} />
                      </Row>
                    </Col>
                    <Col span={8}>
                      <InputNumero
                        inputProps={{ id: CDEP_INPUT_NUMERO, disabled: true }}
                        formItemProps={{ required: false }}
                      />
                    </Col>
                    <Col span={16}>
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
                    <Col span={16}>
                      <InputCidade
                        inputProps={{ id: CDEP_INPUT_CIDADE, disabled: true }}
                        formItemProps={{ required: false }}
                      />
                    </Col>
                    <Col span={8}>
                      <InputEstado
                        selectProps={{ id: CDEP_SELECT_UF, disabled: true }}
                        formItemProps={{ required: false }}
                      />
                    </Col>
                    <Col span={24}>
                      <Row wrap={false} align='middle'>
                        <InputTipoUsuario
                          selectProps={{
                            disabled: true,
                            id: CDEP_SELECT_TIPO_USUARIO,
                            value: tipoUsuario[0]?.label,
                          }}
                          formItemProps={{
                            required: false,
                            style: { width: '100%', marginRight: '8px' },
                          }}
                        />
                        <ModalEditTipoUsuarioButton formPreview={form} />
                      </Row>
                    </Col>
                    <Col span={24}>
                      <InputInstituicao
                        inputProps={{ id: CDEP_INPUT_INSTITUICAO_EMPRESA, disabled: true }}
                        formItemProps={{ required: false }}
                      />
                    </Col>
                  </>
                )}
              </Row>
            </Form>
          </Col>
        </Row>
      </CardContent>
    </>
  );
};

export default MeusDados;
