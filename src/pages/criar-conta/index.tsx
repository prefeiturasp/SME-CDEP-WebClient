import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/cdep/erro-geral-login';
import InputCEP from '~/components/cdep/input/cep';
import InputCPF from '~/components/cdep/input/cpf';
import SenhaCadastro from '~/components/cdep/input/senha-cadastro';
import InputTelefone from '~/components/cdep/input/telefone';
import { CDEP_BUTTON_CADASTRAR, CDEP_BUTTON_CANCELAR } from '~/core/constats/ids/button/intex';
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
} from '~/core/constats/ids/input';
import { CDEP_SELECT_TIPO_USUARIO, CDEP_SELECT_UF } from '~/core/constats/ids/select';
import { LISTA_TIPO_USUARIO } from '~/core/constats/lista-tipo-usuario';
import { LISTA_UF } from '~/core/constats/lista-uf';
import { ERRO_CADASTRO_USUARIO } from '~/core/constats/mensagens';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { UsuarioExternoDTO } from '~/core/dto/usuario-externo-dto';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import usuarioService from '~/core/services/usuario-service';
const CriarConta = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form] = useForm();

  const [erroGeral, setErroGeral] = useState<string[]>();

  const validateMessages = {
    types: { email: 'Não é um e-mail válido' },
    required: 'Campo obrigatório',
    string: {
      range: 'Deve ter entre ${min} e ${max} caracteres',
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

    setErroGeral([ERRO_CADASTRO_USUARIO]);
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
        onFinish={onFinish}
        layout='vertical'
        autoComplete='off'
        validateMessages={validateMessages}
      >
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <InputCPF id={CDEP_INPUT_CPF} />
          </Col>
          <Col span={24}>
            <Form.Item label='Nome completo' name='nome' rules={[{ required: true }]}>
              <Input
                placeholder='Informe o nome completo'
                id={CDEP_INPUT_NOME_COMPLETO}
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputTelefone id={CDEP_INPUT_TELEFONE} />
          </Col>
          <Col span={24}>
            <Form.Item label='E-mail' name='email' rules={[{ required: true, type: 'email' }]}>
              <Input
                placeholder='Informe o e-mail'
                autoComplete='off'
                id={CDEP_INPUT_EMAIL}
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Endereço' name='endereco' rules={[{ required: true }]}>
              <Input placeholder='Informe a rua/avenida' id={CDEP_INPUT_ENDERECO} maxLength={200} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Número'
              name='numero'
              rules={[{ required: true }]}
              getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
                `${e?.target?.value}`.replace(/\D/g, '')
              }
            >
              <Input placeholder='Informe o nº' id={CDEP_INPUT_NUMERO} maxLength={9} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Complemento' name='complemento'>
              <Input
                placeholder='Informe o complemento'
                id={CDEP_INPUT_COMPLEMENTO}
                maxLength={20}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Bairro' name='bairro' rules={[{ required: true }]}>
              <Input placeholder='Informe o bairro' id={CDEP_INPUT_BAIRRO} maxLength={200} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputCEP id={CDEP_INPUT_CEP} />
          </Col>
          <Col span={24}>
            <Form.Item label='Cidade' name='cidade' rules={[{ required: true }]}>
              <Input placeholder='Informe a cidade' id={CDEP_INPUT_CIDADE} maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='UF' name='estado' rules={[{ required: true }]}>
              <Select placeholder='Informe a UF' options={LISTA_UF} id={CDEP_SELECT_UF} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Tipo' name='tipoUsuario' rules={[{ required: true }]}>
              <Select
                placeholder='Selecione o tipo'
                options={LISTA_TIPO_USUARIO}
                id={CDEP_SELECT_TIPO_USUARIO}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <SenhaCadastro label='Senha' name='senha' id={CDEP_INPUT_SENHA} />
          </Col>
          <Col span={24}>
            <SenhaCadastro
              label='Confirmar senha'
              name='confirmarSenha'
              confirmarSenha
              id={CDEP_INPUT_CONFIRMAR_SENHA}
            />
          </Col>
        </Row>

        <Row justify='center' gutter={[0, 21]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button
              type='primary'
              block
              htmlType='submit'
              style={{ fontWeight: 700 }}
              id={CDEP_BUTTON_CADASTRAR}
            >
              Cadastre-se
            </Button>
          </Col>

          <Col span={24}>
            <Button
              type='default'
              block
              style={{ fontWeight: 700 }}
              onClick={onClickCancelar}
              id={CDEP_BUTTON_CANCELAR}
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
