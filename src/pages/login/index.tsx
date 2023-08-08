import { Button, Col, Form, Input, Row } from 'antd';
import { useState } from 'react';

import { useForm, useWatch } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';
import autenticacaoService from '~/core/services/autenticacao-service';

import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/cdep/erro-geral-login';
import {
  CDEP_BUTTON_ACESSAR,
  CDEP_BUTTON_CRIAR_CONTA,
  CDEP_BUTTON_ESQUECI_SENHA,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_LOGIN, CDEP_INPUT_SENHA } from '~/core/constants/ids/input';
import {
  ERRO_INFORMAR_USUARIO_SENHA,
  ERRO_LOGIN,
  ERRO_LOGIN_SENHA_INCORRETOS,
} from '~/core/constants/mensagens';
import { AutenticacaoDTO } from '~/core/dto/autenticacao-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { ValidateErrorEntity } from '~/core/dto/validate-error-entity';
import { ROUTES } from '~/core/enum/routes';
import { setDadosLogin } from '~/core/redux/modules/auth/actions';
import { setSpinning } from '~/core/redux/modules/spin/actions';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [erroGeral, setErroGeral] = useState<string[]>();

  const [form] = useForm();

  const login = useWatch('login', form);
  const senha = useWatch('senha', form);

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      min: 'Deve conter no mínimo ${min} caracteres',
    },
  };

  const validarExibirErros = (erro: AxiosError<RetornoBaseDTO>) => {
    if (erro?.response?.status === 401) {
      setErroGeral([ERRO_LOGIN_SENHA_INCORRETOS]);
      return;
    }

    const dataErro = erro?.response?.data;

    if (typeof dataErro === 'string') {
      setErroGeral([dataErro]);
      return;
    }

    if (dataErro?.mensagens?.length) {
      setErroGeral(dataErro.mensagens);
      return;
    }

    setErroGeral([ERRO_LOGIN]);
  };

  const autenticarCDEP = (loginValidado: string) => {
    dispatch(setSpinning(true));
    autenticacaoService
      .listarPerfisUsuario(loginValidado)
      .then((resposta) => {
        if (resposta?.data?.autenticado) {
          window.clarity('identify', loginValidado);
          dispatch(setDadosLogin(resposta.data));
        }
      })
      .catch(validarExibirErros)
      .finally(() => dispatch(setSpinning(false)));
  };

  const onFinish = (values: AutenticacaoDTO) => {
    dispatch(setSpinning(true));
    autenticacaoService
      .autenticar(values)
      .then((resposta) => {
        if (resposta?.data?.login) {
          autenticarCDEP(resposta.data.login);
        }
      })
      .catch(validarExibirErros)
      .finally(() => dispatch(setSpinning(false)));
  };

  const onFinishFailed = ({ values }: ValidateErrorEntity<AutenticacaoDTO>) => {
    if (!values?.login && !values?.senha) {
      setErroGeral([ERRO_INFORMAR_USUARIO_SENHA]);
    }
  };

  const onClickCriarConta = () => navigate(ROUTES.CRIAR_CONTA);

  const onClickEsqueciSenha = () => navigate(ROUTES.REDEFINIR_SENHA, { state: login });

  return (
    <Col span={14}>
      <Form
        requiredMark='optional'
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        autoComplete='off'
        validateMessages={validateMessages}
      >
        <Row justify='center' gutter={[0, 14]}>
          <Col span={24}>
            <Form.Item
              label='Login'
              name='login'
              hasFeedback={!login}
              rules={[{ required: true }, { min: 5 }]}
            >
              <Input
                placeholder='Informe o login'
                suffix={<span />}
                maxLength={100}
                id={CDEP_INPUT_LOGIN}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label='Senha'
              name='senha'
              hasFeedback={!senha}
              rules={[{ required: true }, { min: 4 }]}
            >
              <Input.Password
                autoComplete='off'
                placeholder='Informe a senha'
                maxLength={100}
                id={CDEP_INPUT_SENHA}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='center' gutter={[0, 25]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button
              type='primary'
              block
              htmlType='submit'
              style={{ fontWeight: 700 }}
              id={CDEP_BUTTON_ACESSAR}
            >
              Acessar
            </Button>
          </Col>

          <Col span={24}>
            <Button
              type='text'
              block
              style={{ fontSize: 12 }}
              onClick={() => onClickEsqueciSenha()}
              id={CDEP_BUTTON_ESQUECI_SENHA}
            >
              Esqueci minha senha
            </Button>
          </Col>

          <Col span={24}>
            <Button
              type='default'
              block
              style={{ fontWeight: 700 }}
              onClick={() => onClickCriarConta()}
              id={CDEP_BUTTON_CRIAR_CONTA}
            >
              Crie a sua conta
            </Button>
          </Col>

          {erroGeral ? (
            <Col span={24}>
              <ErroGeralLogin erros={erroGeral} />
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Form>
    </Col>
  );
};

export default Login;
