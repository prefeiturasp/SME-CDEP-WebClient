import { Col, Form, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import styled from 'styled-components';
import SenhaCadastro from '~/components/cdep/input/senha-cadastro';
import {
  CDEP_INPUT_CONFIRMAR_SENHA,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_SENHA_ATUAL,
} from '~/core/constants/ids/input';
import { validateMessages } from '~/core/constants/validate-messages';
import { SenhaNovaDTO } from '~/core/dto/senha-nova-dto';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';

const RequisitosListaContainer = styled.ul`
  padding-left: 27px;
`;

type ModalEditNovaSenha = {
  closeModal: () => void;
};
const ModalEditNovaSenha: React.FC<ModalEditNovaSenha> = ({ closeModal }) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);

  const login = auth?.usuarioLogin;

  const listaRequisitos = [
    'Uma letra maiúscula',
    'Uma letra minúscula',
    'Um algarismo (número) ou um símbolo (caractere especial)',
    'Não pode permitir caracteres acentuados',
    'Deve ter no mínimo 8 e no máximo 12 caracteres',
  ];

  const alterar = (values: SenhaNovaDTO) => usuarioService.alterarSenha(login, values);

  return (
    <ModalEditDefault
      form={form}
      title='Nova senha'
      service={alterar}
      mensagemConfirmarCancelar='Você não salvou a nova senha, deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Typography.Text strong>Requisitos de segurança da senha</Typography.Text>
            <RequisitosListaContainer>
              {listaRequisitos.map((requisito, i) => (
                <li key={i}>
                  <Typography.Text>{requisito}</Typography.Text>
                </li>
              ))}
            </RequisitosListaContainer>
          </Col>
        </Row>
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditNovaSenha;
