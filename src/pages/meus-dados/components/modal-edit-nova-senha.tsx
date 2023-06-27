import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import SenhaCadastro from '~/components/cdep/input/senha-cadastro';
import {
  CDEP_INPUT_CONFIRMAR_SENHA,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_SENHA_ATUAL,
} from '~/core/constats/ids/input';
import { SenhaNovaDTO } from '~/core/dto/senha-nova-dto';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from './modal-edit-default';

const ModalEditNovaSenha: React.FC = () => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);
  const login = auth?.usuarioLogin;

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      range: 'Deve ter entre ${min} e ${max} caracteres',
    },
  };

  const alterar = (values: SenhaNovaDTO) => usuarioService.alterarSenha(login, values);

  return (
    <ModalEditDefault form={form} title='Nova senha' service={alterar}>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <SenhaCadastro
              formItemProps={{ label: 'Senha atual', name: 'senhaAtual' }}
              inputProps={{ id: CDEP_INPUT_SENHA_ATUAL }}
            />
          </Col>
          <Col span={24}>
            <SenhaCadastro
              formItemProps={{ label: 'Nova senha', name: 'senhaNova' }}
              inputProps={{ id: CDEP_INPUT_SENHA }}
            />
          </Col>
          <Col span={24}>
            <SenhaCadastro
              formItemProps={{ label: 'Confirmação da nova senha', name: 'confirmarSenha' }}
              inputProps={{ id: CDEP_INPUT_CONFIRMAR_SENHA }}
              confirmarSenha={{ fieldName: 'senhaNova' }}
            />
          </Col>
        </Row>
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditNovaSenha;
