import { Button, Col, Form, Input, Row } from 'antd';
import { useState } from 'react';

import { useForm, useWatch } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';
import autenticacaoService from '~/core/services/autenticacao-service';

import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ERRO_LOGIN } from '~/core/constat/mensagens';
import { AutenticacaoDTO } from '~/core/dto/autenticacao-dto';
import { ValidateErrorEntity } from '~/core/dto/validate-error-entity';
import { ROUTES } from '~/core/enum/routes';
import { setDadosLogin } from '~/core/redux/modules/auth/actions';
import { ErroGeralLogin } from './style';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [erroGeral, setErroGeral] = useState('');

  const [form] = useForm();

  const login = useWatch('login', form);
  const senha = useWatch('senha', form);

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      min: 'Deve conter no mínimo ${min} caracteres',
    },
  };

  const validarExibirErros = (erro: AxiosError<string>) => {
    if (erro?.response?.status === 401) {
      setErroGeral('Login ou senha incorretos');
    } else {
      setErroGeral(erro?.response?.data || ERRO_LOGIN);
    }
  };

  const autenticarCDEP = (loginValidado: string) => {
    autenticacaoService
      .listarPerfisUsuario(loginValidado)
      .then((resposta) => {
        if (resposta?.data?.autenticado) {
          window.clarity('identify', loginValidado);
          dispatch(setDadosLogin(resposta.data));
        }
      })
      .catch(validarExibirErros);
  };

  const onFinish = (values: AutenticacaoDTO) => {
    autenticacaoService
      .autenticar(values)
      .then((resposta) => {
        if (resposta?.data?.login) {
          autenticarCDEP(resposta.data.login);
        }
      })
      .catch(validarExibirErros);
  };

  const onFinishFailed = ({ values }: ValidateErrorEntity<AutenticacaoDTO>) => {
    if (!values?.login && !values?.senha) {
      setErroGeral('Você precisa informar um usuário e senha para acessar o sistema');
    }
  };

  const onClickCriarConta = () => navigate(ROUTES.CRIAR_CONTA);

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
              <Input placeholder='Informe o login' suffix={<span />} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label='Senha'
              name='senha'
              hasFeedback={!senha}
              rules={[{ required: true }, { min: 4 }]}
            >
              <Input.Password autoComplete='off' placeholder='Informe a senha' />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='center' gutter={[0, 40]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button type='primary' block htmlType='submit' style={{ fontWeight: 700 }}>
              Acessar
            </Button>
          </Col>

          <Col span={24}>
            <Button
              type='default'
              block
              style={{ fontWeight: 700 }}
              onClick={() => onClickCriarConta()}
            >
              Crie a sua conta
            </Button>
          </Col>

          {erroGeral ? (
            <Col span={24}>
              <ErroGeralLogin>{erroGeral}</ErroGeralLogin>
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
