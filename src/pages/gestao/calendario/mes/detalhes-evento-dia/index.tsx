import { Col, Form, Input, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import Modal from '~/components/lib/modal';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { EventoDetalheDTO } from '~/core/dto/calendario-evento-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoEventoEnum } from '~/core/enum/tipo-evento-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { ContainerDiaExpandido } from '../styles';

type DetalhesEventoDiaProps = {
  evento: any;
};

const stylesText = {
  marginRight: 6,
  fontWeight: 'bold',
};

export const DetalhesEventoDia: React.FC<DetalhesEventoDiaProps> = ({ evento }) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const detalhes = evento?.find((item: EventoDetalheDTO) => item);
  const [abrirModal, setAbrirModal] = useState<boolean>(false);

  const detalheVisita = () => (
    <ContainerDiaExpandido className='visita'>
      <Row gutter={16}>
        <Col>
          <ButtonSecundary
            onClick={() => {
              navigate(
                `${ROUTES.ATENDIMENTO_SOLICITACOES_EDITAR}/${detalhes?.acervoSolicitacaoId}`,
              );
            }}
          >
            {detalhes?.tipo}
          </ButtonSecundary>
        </Col>
        {detalhes?.solicitante && detalhes?.titulo && (
          <Col>
            <Row>
              <Typography style={stylesText}>Nome do solicitante:</Typography>
              <Typography>{detalhes?.solicitante}</Typography>
            </Row>
            <Row>
              <Typography style={stylesText}>Título do acervo:</Typography>
              <Typography.Text ellipsis>{detalhes?.titulo}</Typography.Text>
            </Row>
          </Col>
        )}
      </Row>
    </ContainerDiaExpandido>
  );

  const detalheSuspensao = () => (
    <ContainerDiaExpandido tipoId={detalhes?.tipoId} className='suspensao'>
      <Row gutter={16} style={{ width: '100%' }}>
        <Col xs={4}>
          <ButtonSecundary
            onClick={() => {
              alert('Suspensão');
            }}
          >
            Suspensão
          </ButtonSecundary>
        </Col>
        <Col xs={20}>
          <Row align={'middle'} justify={'space-between'}>
            <Row>
              <Typography style={stylesText}>Justificativa:</Typography>
              <Typography.Text ellipsis>Adicionar a justificativa aqui</Typography.Text>
            </Row>
            <Col>
              <ButtonSecundary
                onClick={() => {
                  alert('Excluir suspensão');
                }}
              >
                Excluir suspensão
              </ButtonSecundary>
            </Col>
          </Row>
        </Col>
      </Row>
    </ContainerDiaExpandido>
  );

  const detalheSemEvento = () => (
    <ContainerDiaExpandido tipoId={detalhes?.tipoId} className='semEvento'>
      <Col>
        <ButtonPrimary onClick={() => setAbrirModal(true)}>Incluir suspensão</ButtonPrimary>
      </Col>
    </ContainerDiaExpandido>
  );

  const onCancel = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
          setAbrirModal(false);
        },
      });
    } else {
      form.resetFields();
      setAbrirModal(false);
    }
  };

  return (
    <>
      {detalhes?.tipoId === TipoEventoEnum.VISITA && detalheVisita()}
      {detalhes?.tipoId === TipoEventoEnum.SUSPENSAO && detalheSuspensao()}
      {!detalhes && detalheSemEvento()}
      <Modal
        open={abrirModal}
        destroyOnClose
        okText='Salvar'
        onCancel={onCancel}
        cancelText='Cancelar'
        title='Cadastro de suspensão'
      >
        <Form form={form} layout='vertical'>
          <Col xs={24}>
            <Form.Item
              label='Justificativa'
              name='justificativa'
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Input.TextArea placeholder='Justificativa' />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};
