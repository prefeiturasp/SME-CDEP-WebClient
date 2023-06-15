import { Button, Col, Form, Input, Row } from 'antd';
import { useState } from 'react';

import cdepLogo from '~/assets/cdep-logo-titulo.svg';
import prefeituraLogo from '~/assets/prefeitura-sp-logo.svg';

import { useForm, useWatch } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';
import autenticacaoService from '~/core/services/autenticacao-service';

import { AxiosError } from 'axios';
import { AutenticacaoDto } from '~/core/dto/autenticacao-dto';
import { ValidateErrorEntity } from '~/core/dto/validate-error-entity';
import { setDadosLogin } from '~/core/redux/modules/auth/actions';
import { ErroGeralLogin, FundoLogin } from './style';

const Login = () => {
  const dispatch = useAppDispatch();

  const [erroGeral, setErroGeral] = useState('');

  const [form] = useForm();

  const login = useWatch('login', form);
  const senha = useWatch('senha', form);

  const autenticarCDEP = (loginValidado: string) => {
    autenticacaoService
      .listarPerfisUsuario(loginValidado)
      .then((resposta) => {
        if (resposta?.data?.autenticado) {
          window.clarity('identify', loginValidado);
          dispatch(setDadosLogin(resposta.data));
        }
      })
      .catch((erro: AxiosError) => {
        if (erro?.response?.status === 401) {
          setErroGeral('Login ou senha incorretos');
        } else {
          setErroGeral('Falha ao tentar autenticar no servidor');
        }
      });
  };

  const onFinish = (values: AutenticacaoDto) => {
    autenticacaoService
      .autenticar(values)
      .then((resposta) => {
        if (resposta?.data?.login) {
          autenticarCDEP(resposta.data.login);
        }
      })
      .catch((erro: AxiosError) => {
        if (erro?.response?.status === 401) {
          setErroGeral('Login ou senha incorretos');
        } else {
          setErroGeral('Falha ao tentar autenticar no servidor');
        }
      });
  };

  const onFinishFailed = ({ values }: ValidateErrorEntity<AutenticacaoDto>) => {
    if (!values?.login && !values?.senha) {
      setErroGeral('Você precisa informar um usuário e senha para acessar o sistema');
    }
  };

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      min: 'O ${name} deve conter no mínimo ${min} caracteres',
    },
  };

  return (
    <Row align='middle' style={{ height: '100vh' }}>
      <Col sm={0} md={8} lg={12}>
        <FundoLogin />
      </Col>
      <Col sm={24} md={16} lg={12} style={{ maxHeight: '100vh', overflow: 'auto' }}>
        <Row justify='center' style={{ margin: '40px 0px' }}>
          <Col span={14}>
            <img style={{ width: '100%', height: '100%' }} src={cdepLogo} alt='CDEP LOGO' />
          </Col>
        </Row>
        <Row justify='center'>
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

                <Col span={24}>
                  <Form.Item validateStatus='error'>
                    <Button type='primary' htmlType='submit' block style={{ fontWeight: 700 }}>
                      Acessar
                    </Button>
                  </Form.Item>
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
        </Row>
        <Row justify='center'>
          <Col span={24}>
            <img
              style={{ width: '100%', height: '62px' }}
              src={prefeituraLogo}
              alt='PREFEITURA SP LOGO'
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Login;
