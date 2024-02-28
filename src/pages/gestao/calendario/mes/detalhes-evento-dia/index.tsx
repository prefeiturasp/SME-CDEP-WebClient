import { Col, Form, Input, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { DESEJA_CANCELAR_ALTERACOES, DESEJA_EXCLUIR_SUSPENSAO } from '~/core/constants/mensagens';
import { EventoDetalheDTO } from '~/core/dto/calendario-evento-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoEventoEnum, TipoEventoEnumDisplay } from '~/core/enum/tipo-evento-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { deletarSuspensao, inserirSuspensao } from '~/core/services/calendario-eventos-service';
import { ContainerDiaExpandido, ContainerTypography } from '../styles';

type DetalhesEventoDiaProps = {
  evento: any;
  mesEscolhido: number | undefined;
  diaEscolhido: number | undefined;
  carregarDadosMesSelecionado?: (mesEscolhido: number) => Promise<AxiosResponse<void>>;
};

export const DetalhesEventoDia: React.FC<DetalhesEventoDiaProps> = ({
  evento,
  mesEscolhido,
  diaEscolhido,
  carregarDadosMesSelecionado,
}) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const naoTemEventos = !evento.length;
  const [abrirModal, setAbrirModal] = useState<boolean>(false);

  const detalheVisita = (item: EventoDetalheDTO) => (
    <ContainerDiaExpandido className='visita'>
      <Row gutter={16}>
        <Col>
          <ButtonSecundary
            onClick={() => {
              navigate(`${ROUTES.ATENDIMENTO_SOLICITACOES}/${item?.acervoSolicitacaoId}`);
            }}
          >
            {item?.tipo}
          </ButtonSecundary>
        </Col>
        {item?.solicitante && item?.titulo && (
          <Col>
            <Row>
              <ContainerTypography>Nome do solicitante:</ContainerTypography>
              <Typography>{item?.solicitante}</Typography>
            </Row>
            <Row>
              <ContainerTypography>Título do acervo:</ContainerTypography>
              <Typography.Text ellipsis>{item?.titulo}</Typography.Text>
            </Row>
          </Col>
        )}
      </Row>
    </ContainerDiaExpandido>
  );

  const detalheSuspensao = (item: EventoDetalheDTO) => (
    <ContainerDiaExpandido tipoId={item?.tipoId} className='suspensao'>
      <Row
        gutter={16}
        align={'middle'}
        justify={'space-between'}
        style={{ width: '100%', marginLeft: 2 }}
      >
        <Row>
          <ContainerTypography>Justificativa:</ContainerTypography>
          <Typography.Text ellipsis>{item.justificativa}</Typography.Text>
        </Row>
        <Col>
          <ButtonSecundary
            onClick={() => {
              confirmacao({
                title: DESEJA_EXCLUIR_SUSPENSAO,
                onOk: () => {
                  deletarSuspensao(item.id).then(() => {
                    notification.success({
                      message: 'Sucesso',
                      description: 'A suspensão foi excluída com sucesso!',
                    });

                    if (carregarDadosMesSelecionado && mesEscolhido) {
                      carregarDadosMesSelecionado(mesEscolhido);
                    }
                  });
                },
              });
            }}
          >
            Excluir suspensão
          </ButtonSecundary>
        </Col>
      </Row>
    </ContainerDiaExpandido>
  );

  const detalheSemEvento = (item: EventoDetalheDTO) => (
    <ContainerDiaExpandido tipoId={item?.tipoId} className='semEvento'>
      <Col>
        <ButtonPrimary onClick={() => setAbrirModal(true)}>Incluir suspensão</ButtonPrimary>
      </Col>
    </ContainerDiaExpandido>
  );

  const detalheFeriado = (item: EventoDetalheDTO) => (
    <ContainerDiaExpandido tipoId={item?.tipoId} className='semEvento'>
      <Col>
        <Row>
          <ContainerTypography>Feriado:</ContainerTypography>
          <Typography.Text ellipsis>{item.descricao}</Typography.Text>
        </Row>
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

  const onFinish = () => {
    form.validateFields().then(async () => {
      const justificativa = form.getFieldValue('justificativa');

      const valoresParaSalvar = {
        justificativa,
        dia: diaEscolhido,
        mes: mesEscolhido,
        tipo: TipoEventoEnum.SUSPENSAO,
        descricao: TipoEventoEnumDisplay[TipoEventoEnum.SUSPENSAO],
      };

      await inserirSuspensao(valoresParaSalvar).then(() => {
        notification.success({
          message: 'Sucesso',
          description: 'A suspensão foi inserida com sucesso!',
        });

        if (carregarDadosMesSelecionado && mesEscolhido) {
          carregarDadosMesSelecionado(mesEscolhido);
          setAbrirModal(false);
        }
      });
    });
  };

  return (
    <>
      {evento.map((item: EventoDetalheDTO) => {
        if (item?.tipoId === TipoEventoEnum.VISITA) {
          return detalheVisita(item);
        } else if (item?.tipoId === TipoEventoEnum.SUSPENSAO) {
          return detalheSuspensao(item);
        } else if (item?.tipoId === TipoEventoEnum.FERIADO) {
          return detalheFeriado(item);
        }
      })}

      {naoTemEventos && detalheSemEvento(evento)}

      <Modal
        open={abrirModal}
        destroyOnClose
        okText='Salvar'
        onOk={onFinish}
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
