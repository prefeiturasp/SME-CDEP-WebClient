import { Button, Col, Form, Row, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';

import { AxiosError, HttpStatusCode } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ErroGeralLogin from '~/components/cdep/erro-geral-login';
import SenhaCadastro from '~/components/cdep/input/senha-cadastro';
import Spin from '~/components/cdep/spin';
import {
  CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_CONFIRMAR_SENHA, CDEP_INPUT_SENHA } from '~/core/constants/ids/input';
import { ERRO_RECUPERACAO_SENHA } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { ROUTES } from '~/core/enum/routes';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { validarAutenticacao } from '~/core/utils/perfil';
import TokenExpirado from './token-expirado';

const RedefinirSenhaToken = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const paramsRoute = useParams();

  const token = paramsRoute?.token || '';

  const [erroGeral, setErroGeral] = useState<string[]>();
  const [tokenValido, setTokenValido] = useState<boolean>(false);
  const [validandoToken, setValidandoToken] = useState<boolean>(!!token);

  const [form] = useForm();

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

  const validarToken = useCallback(() => {
    setValidandoToken(true);

    usuarioService
      .tokenRecuperacaoSenhaEstaValido(token)
      .then((resposta) => {
        if (resposta.status === HttpStatusCode.Ok && resposta.data) {
          setTokenValido(true);
        } else {
          setTokenValido(false);
        }
      })
      .catch((error) => {
        validarExibirErros(error);
        setTokenValido(false);
      })
      .finally(() => setValidandoToken(false));
  }, [token]);

  useEffect(() => {
    if (token) validarToken();
  }, [token, validarToken]);

  const onFinish = (values: { novaSenha: string }) => {
    dispatch(setSpinning(true));

    usuarioService
      .alterarSenhaComTokenRecuperacao({ novaSenha: values.novaSenha, token })
      .then((resposta) => {
        if (resposta.status === HttpStatusCode.Ok) {
          validarAutenticacao(resposta.data);
          navigate(ROUTES.PRINCIPAL);
        }
      })
      .catch(validarExibirErros)
      .finally(() => dispatch(setSpinning(false)));
  };

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  if (!validandoToken && !tokenValido) return <TokenExpirado />;

  return (
    <Col span={14}>
      <Spin spinning={validandoToken} tip='Validando token...'>
        {tokenValido ? (
          <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            autoComplete='off'
            validateMessages={validateMessages}
          >
            <Row justify='center' gutter={[0, 30]}>
              <Col span={24}>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  Redefinição de Senha
                </Typography.Text>
              </Col>
              <Col span={24}>
                <SenhaCadastro
                  formItemProps={{ label: 'Nova senha', name: 'novaSenha' }}
                  inputProps={{ id: CDEP_INPUT_SENHA, placeholder: 'Nova senha' }}
                />
              </Col>
              <Col span={24}>
                <SenhaCadastro
                  formItemProps={{ label: 'Confirmação da nova senha', name: 'confirmarSenha' }}
                  inputProps={{
                    id: CDEP_INPUT_CONFIRMAR_SENHA,
                    placeholder: 'Confirmação da nova senha',
                  }}
                  confirmarSenha={{ fieldName: 'novaSenha' }}
                />
              </Col>
            </Row>

            <Row justify='center' gutter={[0, 25]} style={{ marginTop: '20px' }}>
              <Col span={24}>
                <Button
                  type='primary'
                  block
                  htmlType='submit'
                  style={{ fontWeight: 700 }}
                  id={CDEP_BUTTON_CONFIRMAR_REDEFINICAO_SENHA}
                >
                  Confirmar redefinição de senha
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
        ) : (
          <></>
        )}
      </Spin>
    </Col>
  );
};

export default RedefinirSenhaToken;
