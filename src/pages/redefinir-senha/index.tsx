import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { useState } from 'react';

import { useForm, useWatch } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';

import { IoInformationCircleSharp } from 'react-icons/io5';
import { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/cdep/erro-geral-login';
import { CDEP_BUTTON_CONTINUAR, CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_LOGIN } from '~/core/constants/ids/input';
import { ERRO_RECUPERACAO_SENHA } from '~/core/constants/mensagens';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { ROUTES } from '~/core/enum/routes';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import Modal from '~/components/lib/modal';

const RedefinirSenha = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [erroGeral, setErroGeral] = useState<string[]>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [mensagemRecuperacaoSenha, setMensagemRecuperacaoSenha] = useState<string>();

  const usuarioLogin = location.state;
  const login = useWatch('login', form);

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      min: 'Deve conter no mínimo ${min} caracteres',
    },
  };

  const validarExibirErros = (erro: AxiosError<RetornoBaseDTO>) => {
    const dataErro = erro?.response?.data;

    if (typeof dataErro === 'string') {
      setErroGeral([dataErro]);
      return;
    }

    if (dataErro?.mensagens?.length) {
      setErroGeral(dataErro.mensagens);
      return;
    }

    setErroGeral([ERRO_RECUPERACAO_SENHA]);
  };

  const onFinish = (values: { login: string }) => {
    dispatch(setSpinning(true));
    usuarioService
      .solicitarRecuperacaoSenha(values?.login)
      .then((resposta) => {
        if (resposta?.data) {
          setMensagemRecuperacaoSenha(resposta?.data);
          setOpenModal(true);
        }
      })
      .catch(validarExibirErros)
      .finally(() => dispatch(setSpinning(false)));
  };

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  return (
    <>
      {openModal ? (
        <Modal
          open
          centered
          footer={null}
          destroyOnClose
          title='Esqueci minha senha'
          onCancel={() => setOpenModal(false)}
        >
          <Typography.Text style={{ fontSize: 16 }}>{mensagemRecuperacaoSenha}</Typography.Text>
        </Modal>
      ) : (
        <></>
      )}
      <Col span={14}>
        <Form
          form={form}
          layout='vertical'
          autoComplete='off'
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row justify='center' gutter={[0, 30]}>
            <Col span={24}>
              <Typography.Text strong style={{ fontSize: 16 }}>
                Esqueci minha senha
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Form.Item
                name='login'
                label='Login'
                hasFeedback={!login}
                initialValue={usuarioLogin}
                rules={[{ required: true }, { min: 5 }]}
              >
                <Input
                  maxLength={100}
                  suffix={<span />}
                  id={CDEP_INPUT_LOGIN}
                  placeholder='Informe o login'
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Typography.Text style={{ fontSize: 14 }}>
                <IoInformationCircleSharp fontSize={17} style={{ verticalAlign: '-0.18em' }} />
                Ao continuar será acionada a opção de recuperação de senha e você receberá um e-mail
                com as orientações.
              </Typography.Text>
            </Col>
          </Row>

          <Row justify='center' gutter={[0, 25]} style={{ marginTop: '20px' }}>
            <Col span={24}>
              <Button
                block
                type='primary'
                htmlType='submit'
                disabled={!login}
                id={CDEP_BUTTON_CONTINUAR}
                style={{ fontWeight: 700 }}
              >
                Continuar
              </Button>
            </Col>

            <Col span={24}>
              <Button
                type='default'
                block
                style={{ fontWeight: 700 }}
                onClick={() => onClickVoltar()}
                id={CDEP_BUTTON_VOLTAR}
              >
                Voltar
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
    </>
  );
};

export default RedefinirSenha;
