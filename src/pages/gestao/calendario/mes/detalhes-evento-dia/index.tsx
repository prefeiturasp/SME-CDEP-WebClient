import { Col, Form, Input, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useContext, useState } from 'react';
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
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ContainerDiaExpandido, ContainerTypography } from '../styles';

type DetalhesEventoDiaProps = {
  mesEscolhido?: number;
  diaEscolhido?: number;
  evento?: EventoDetalheDTO;
  tipoVisita?: boolean;
  tipoFeriado?: boolean;
  tipoSuspensao?: boolean;
  carregarDadosMesSelecionado?: (mesEscolhido: number) => void;
};

export const DetalhesEventoDia: React.FC<DetalhesEventoDiaProps> = ({
  evento,
  mesEscolhido,
  diaEscolhido,
  carregarDadosMesSelecionado,
  tipoVisita,
  tipoFeriado,
  tipoSuspensao,
}) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const naoTemEventos = !evento;
  const [abrirModal, setAbrirModal] = useState<boolean>(false);
  const { permissao } = useContext(PermissaoContext);

  const detalheVisita = (item?: EventoDetalheDTO) => (
    <ContainerDiaExpandido
      tipoId={item?.tipoId}
      situacaoItem={item?.situacaoSolicitacaoItemId}
      className='visita'
    >
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
        <Col>
          <Row>
            <ContainerTypography>Nome do solicitante:</ContainerTypography>
            <Typography>{item?.solicitante}</Typography>
          </Row>
          <Row>
            <ContainerTypography>Título do acervo:</ContainerTypography>
            <Typography.Text ellipsis>{item?.titulo}</Typography.Text>
          </Row>
          <Row>
            <ContainerTypography>Código/Tombo:</ContainerTypography>
            <Typography.Text ellipsis>{item?.codigoTombo}</Typography.Text>
          </Row>
          <Row>
            <ContainerTypography>Situação:</ContainerTypography>
            <Typography.Text ellipsis>{item?.situacaoSolicitacaoItemDescricao}</Typography.Text>
          </Row>
          <Row>
            <ContainerTypography>Horário:</ContainerTypography>
            <Typography.Text ellipsis>{item?.horario}</Typography.Text>
          </Row>
        </Col>
      </Row>
    </ContainerDiaExpandido>
  );

  const detalheSuspensao = (item?: EventoDetalheDTO) => {
    const justificativa = (
      <Col>
        <Row>
          <ContainerTypography>Justificativa:</ContainerTypography>
          <Typography.Text ellipsis>{item?.justificativa}</Typography.Text>
        </Row>
      </Col>
    );
    return (
      <ContainerDiaExpandido tipoId={item?.tipoId} className='suspensao'>
        <Row gutter={16} align='middle'>
          {permissao.podeIncluir ? (
            <>
              <Col>
                <ButtonSecundary
                  onClick={() => {
                    confirmacao({
                      content: DESEJA_EXCLUIR_SUSPENSAO,
                      onOk: () => {
                        if (item?.id) {
                          deletarSuspensao(item.id).then(() => {
                            notification.success({
                              message: 'Sucesso',
                              description: 'A suspensão foi excluída com sucesso!',
                            });

                            if (carregarDadosMesSelecionado && mesEscolhido) {
                              carregarDadosMesSelecionado(mesEscolhido);
                            }
                          });
                        }
                      },
                    });
                  }}
                >
                  Excluir suspensão
                </ButtonSecundary>
              </Col>
              {justificativa}
            </>
          ) : (
            justificativa
          )}
        </Row>
      </ContainerDiaExpandido>
    );
  };

  const detalheSemEvento = () => (
    <ContainerDiaExpandido className='semEvento'>
      <Col>
        <ButtonPrimary onClick={() => setAbrirModal(true)}>Incluir suspensão</ButtonPrimary>
      </Col>
    </ContainerDiaExpandido>
  );

  const detalheFeriado = (item?: EventoDetalheDTO) => (
    <ContainerDiaExpandido tipoId={item?.tipoId} className='feriado'>
      <Col>
        <Row>
          <ContainerTypography>Feriado:</ContainerTypography>
          <Typography.Text ellipsis>{item?.descricao}</Typography.Text>
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
    form.validateFields().then(() => {
      const justificativa = form.getFieldValue('justificativa');

      const valoresParaSalvar = {
        justificativa,
        dia: diaEscolhido,
        mes: mesEscolhido,
        tipo: TipoEventoEnum.SUSPENSAO,
        descricao: TipoEventoEnumDisplay[TipoEventoEnum.SUSPENSAO],
      };

      inserirSuspensao(valoresParaSalvar).then(() => {
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
      {naoTemEventos && detalheSemEvento()}
      {tipoVisita && detalheVisita(evento)}
      {tipoFeriado && detalheFeriado(evento)}
      {tipoSuspensao && detalheSuspensao(evento)}

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
              <Input.TextArea maxLength={100} placeholder='Justificativa' />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};
