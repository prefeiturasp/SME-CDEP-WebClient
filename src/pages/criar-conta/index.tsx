import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputCEP from '~/components/cdep/input/cep';
import InputCPF from '~/components/cdep/input/cpf';
import SenhaCadastro from '~/components/cdep/input/senha-cadastro';
import InputTelefone from '~/components/cdep/input/telefone';
import { LISTA_TIPO_USUARIO } from '~/core/constat/lista-tipo-usuario';
import { LISTA_UF } from '~/core/constat/lista-uf';
import { ERRO_CADASTRO_USUARIO } from '~/core/constat/mensagens';
import { UsuarioExternoDTO } from '~/core/dto/usuario-externo-dto';
import { ROUTES } from '~/core/enum/routes';
import usuarioService from '~/core/services/usuario-service';
import { ErroGeralLogin } from '../login/style';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';

const CriarConta = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form] = useForm();

  const [erroGeral, setErroGeral] = useState('');

  const validateMessages = {
    types: { email: 'Não é um e-mail válido' },
    required: 'Campo obrigatório',
    string: {
      range: 'Deve ter entre ${min} e ${max} caracteres',
    },
  };

  const validarExibirErros = (erro: AxiosError<any>) => {
    const dataErro = erro?.response?.data;

    if (typeof dataErro === 'string') {
      setErroGeral(erro?.response?.data);
    } else {
      setErroGeral(ERRO_CADASTRO_USUARIO);
    }
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
            <InputCPF />
          </Col>
          <Col span={24}>
            <Form.Item label='Nome completo' name='nome' rules={[{ required: true }]}>
              <Input placeholder='Informe o nome completo' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputTelefone />
          </Col>
          <Col span={24}>
            <Form.Item label='E-mail' name='email' rules={[{ required: true, type: 'email' }]}>
              <Input placeholder='Informe o e-mail' autoComplete='off' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Endereço' name='endereco' rules={[{ required: true }]}>
              <Input placeholder='Informe a rua/avenida' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Número' name='numero' rules={[{ required: true }]}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder='Informe o nº'
                controls={false}
                type='number'
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Complemento' name='complemento'>
              <Input placeholder='Informe o complemento' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Bairro' name='bairro' rules={[{ required: true }]}>
              <Input placeholder='Informe o bairro' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputCEP />
          </Col>
          <Col span={24}>
            <Form.Item label='Cidade' name='cidade' rules={[{ required: true }]}>
              <Input placeholder='Informe a cidade' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='UF' name='estado' rules={[{ required: true }]}>
              <Select placeholder='Informe a UF' options={LISTA_UF} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Tipo' name='tipo' rules={[{ required: true }]}>
              <Select placeholder='Selecione o tipo' options={LISTA_TIPO_USUARIO} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <SenhaCadastro label='Senha' name='senha' />
          </Col>
          <Col span={24}>
            <SenhaCadastro label='Confirmar senha' name='confirmarSenha' confirmarSenha />
          </Col>
        </Row>

        <Row justify='center' gutter={[0, 21]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button type='primary' block htmlType='submit' style={{ fontWeight: 700 }}>
              Cadastre-se
            </Button>
          </Col>

          <Col span={24}>
            <Button type='default' block style={{ fontWeight: 700 }} onClick={onClickCancelar}>
              Cancelar
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

export default CriarConta;
