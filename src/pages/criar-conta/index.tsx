import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError, HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/cdep/erro-geral-login';
import InputBairro from '~/components/cdep/input/bairro';
import InputCEP from '~/components/cdep/input/cep';
import InputCidade from '~/components/cdep/input/cidade';
import InputComplemento from '~/components/cdep/input/complemento';
import InputCPF from '~/components/cdep/input/cpf';
import InputEmail from '~/components/cdep/input/email';
import InputEndereco from '~/components/cdep/input/endereco';
import InputEstado from '~/components/cdep/input/estado';
import InputNumero from '~/components/cdep/input/numero';
import SenhaCadastro from '~/components/cdep/input/senha-cadastro';
import InputTelefone from '~/components/cdep/input/telefone';
import InputInstituicao from '~/components/cdep/input/instituicao';
import { CDEP_BUTTON_CADASTRAR, CDEP_BUTTON_CANCELAR } from '~/core/constants/ids/button/intex';
import {
  CDEP_INPUT_BAIRRO,
  CDEP_INPUT_CEP,
  CDEP_INPUT_CIDADE,
  CDEP_INPUT_COMPLEMENTO,
  CDEP_INPUT_CONFIRMAR_SENHA,
  CDEP_INPUT_CPF,
  CDEP_INPUT_EMAIL,
  CDEP_INPUT_ENDERECO,
  CDEP_INPUT_NOME_COMPLETO,
  CDEP_INPUT_NUMERO,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_TELEFONE,
  CDEP_INPUT_INSTITUICAO_EMPRESA,
} from '~/core/constants/ids/input';
import { CDEP_SELECT_TIPO_USUARIO, CDEP_SELECT_UF } from '~/core/constants/ids/select';
import { LISTA_TIPO_USUARIO } from '~/core/constants/lista-tipo-usuario';
import { ERRO_CADASTRO_USUARIO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { RetornoCEPDTO } from '~/core/dto/retorno-cep-dto';
import { UsuarioExternoDTO } from '~/core/dto/usuario-externo-dto';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import enderecoService from '~/core/services/endereco-service';
import usuarioService from '~/core/services/usuario-service';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions/index';

const CriarConta = () => {
  const [form] = useForm();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [erroCPF, setErroCPF] = useState<boolean>(false);
  const [erroGeral, setErroGeral] = useState<string[]>();
  const [loadingCPF, setLoadingCPF] = useState<boolean>(false);
  const [loadingCEP, setLoadingCEP] = useState<boolean>(false);
  const [CPFExistente, setCPFExistente] = useState<string[]>();
  const [CEPExistente, setCEPExistente] = useState<string[]>();
  const [obterCEP, setObterCEP] = useState<RetornoCEPDTO | undefined>();

  useEffect(() => {
    form.getFieldInstance('cpf').focus();
    erroCPF && form.getFieldInstance('cpf').focus();
  }, [erroCPF, form]);

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

    setErroGeral([ERRO_CADASTRO_USUARIO]);
  };

  const validaCPFExistente = (value: string) => {
    setCPFExistente([]);
    setLoadingCPF(true);
    usuarioService
      .validaCPFExistente(value)
      .then((resposta) => {
        !resposta.data && form.getFieldInstance('nome').focus();
      })
      .catch((erro: AxiosError<RetornoBaseDTO>) => {
        const dataErro = erro?.response?.data;

        if (dataErro?.mensagens?.length) {
          setErroCPF(true);
          setCPFExistente(dataErro.mensagens);
        }
      })
      .finally(() => setLoadingCPF(false));
  };

  const getCEP = (value: string) => {
    setLoadingCEP(true);
    enderecoService
      .obterDadosCEP(value)
      .then((resposta) => {
        const data = resposta.data;
        const { bairro, uf: estado, complemento, localidade: cidade, logradouro: endereco } = data;

        data && form.getFieldInstance('numero').focus();
        resposta.status === HttpStatusCode.NoContent && form.getFieldInstance('endereco').focus();

        setObterCEP({ ...data });
        form.setFieldsValue({
          estado,
          bairro,
          cidade,
          endereco,
          complemento,
        });
      })
      .catch((erro: AxiosError<RetornoBaseDTO>) => {
        const dataErro = erro?.response?.data;

        if (dataErro?.mensagens?.length) {
          setErroCPF(true);
          setCEPExistente(dataErro.mensagens);
        }
      })
      .finally(() => setLoadingCEP(false));
  };

  const onFinish = (values: UsuarioExternoDTO) => {
    dispatch(setSpinning(true));
    usuarioService
      .cadastrarUsuarioExterno(values)
      .then((resposta) => {
        if (resposta.data) {
          navigate(ROUTES.LOGIN);
        }
      })
      .catch(validarExibirErros)
      .finally(() => dispatch(setSpinning(false)));
  };

  const onClickCancelar = () => navigate(ROUTES.LOGIN);

  return (
    <Col span={14}>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <InputCPF
              formItemProps={{
                help: CPFExistente,
                hasFeedback: loadingCPF,
                validateStatus: CPFExistente?.length ? 'error' : loadingCPF ? 'validating' : '',
              }}
              inputProps={{
                name: 'cpf',
                id: CDEP_INPUT_CPF,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = removerTudoQueNaoEhDigito(e.target.value);
                  value.length === 11 ? validaCPFExistente(value) : setCPFExistente([]);
                },
              }}
            />
          </Col>
          <Col span={24}>
            <Form.Item label='Nome completo' name='nome' rules={[{ required: true }]}>
              <Input
                maxLength={100}
                id={CDEP_INPUT_NOME_COMPLETO}
                placeholder='Informe o nome completo'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputTelefone inputProps={{ id: CDEP_INPUT_TELEFONE }} />
          </Col>
          <Col span={24}>
            <InputEmail inputProps={{ id: CDEP_INPUT_EMAIL }} />
          </Col>
          <Col span={24}>
            <InputCEP
              formItemProps={{
                help: CEPExistente,
                hasFeedback: loadingCEP,
                validateStatus: CEPExistente?.length ? 'error' : loadingCEP ? 'validating' : '',
              }}
              inputProps={{
                id: CDEP_INPUT_CEP,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = removerTudoQueNaoEhDigito(e.target.value);
                  value.length === 8 ? getCEP(value) : '';
                },
              }}
            />
          </Col>
          <Col span={24}>
            <InputEndereco
              inputProps={{ id: CDEP_INPUT_ENDERECO, defaultValue: obterCEP?.localidade }}
            />
          </Col>
          <Col span={12}>
            <InputNumero inputProps={{ id: CDEP_INPUT_NUMERO }} />
          </Col>
          <Col span={12}>
            <InputComplemento
              inputProps={{ id: CDEP_INPUT_COMPLEMENTO, defaultValue: obterCEP?.complemento }}
            />
          </Col>
          <Col span={24}>
            <InputBairro inputProps={{ id: CDEP_INPUT_BAIRRO, defaultValue: obterCEP?.bairro }} />
          </Col>
          <Col span={24}>
            <InputCidade
              inputProps={{ id: CDEP_INPUT_CIDADE, defaultValue: obterCEP?.localidade }}
            />
          </Col>
          <Col span={12}>
            <InputEstado selectProps={{ id: CDEP_SELECT_UF, value: obterCEP?.uf }} />
          </Col>
          <Col span={24}>
            <Form.Item label='Tipo' name='tipo' rules={[{ required: true }]}>
              <Select
                options={LISTA_TIPO_USUARIO}
                id={CDEP_SELECT_TIPO_USUARIO}
                placeholder='Selecione o tipo'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputInstituicao inputProps={{ id: CDEP_INPUT_INSTITUICAO_EMPRESA }} />
          </Col>
          <Col span={24}>
            <SenhaCadastro inputProps={{ id: CDEP_INPUT_SENHA }} />
          </Col>
          <Col span={24}>
            <SenhaCadastro
              confirmarSenha={{ fieldName: 'senha' }}
              inputProps={{ id: CDEP_INPUT_CONFIRMAR_SENHA }}
              formItemProps={{ label: 'Confirmar senha', name: 'confirmarSenha' }}
            />
          </Col>
        </Row>

        <Row justify='center' gutter={[0, 21]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button
              block
              type='primary'
              htmlType='submit'
              id={CDEP_BUTTON_CADASTRAR}
              style={{ fontWeight: 700 }}
            >
              Cadastre-se
            </Button>
          </Col>

          <Col span={24}>
            <Button
              block
              type='default'
              id={CDEP_BUTTON_CANCELAR}
              onClick={onClickCancelar}
              style={{ fontWeight: 700 }}
            >
              Cancelar
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

export default CriarConta;
