import { Col, DatePicker, Form, ModalProps, Row } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { FormProps, useForm, useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useContext, useEffect } from 'react';
import { SelectTipoAtendimento } from '~/components/cdep/input/tipo-atendimento';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { Dayjs } from '~/core/date/dayjs';
import { AcervoEmprestimoProrrogacaoDTO } from '~/core/dto/acervo-emprestimo-prorrogacao-dto';
import { AcervoSolicitacaoConfirmarDTO } from '~/core/dto/acervo-solicitacao-confirmar-dto';
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';
import { SituacaoSolicitacaoEnum } from '~/core/enum/situacao-atendimento-enum';
import { SituacaoEmprestimoEnum } from '~/core/enum/situacao-emprestimo-enum';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { prorrogarEmprestimo } from '~/core/services/acervo-emprestimo';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

type ModalAtendimentoProps = {
  modalProps?: ModalProps;
  formProps?: FormProps;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  initialValuesModal?: AcervoSolicitacaoItemDetalheResumidoDTO;
  initialValuesAtendimento?: AcervoSolicitacaoDetalheDTO;
  acervoSolicitacaoId: number;
  carregarDados: () => void;
};

export const ModalAtendimento: React.FC<ModalAtendimentoProps> = ({
  modalProps,
  formProps,
  isModalOpen,
  setIsModalOpen,
  initialValuesModal,
  initialValuesAtendimento,
  acervoSolicitacaoId,
  carregarDados,
}) => {
  const [form] = useForm();
  const dataVisitaWatch = useWatch('dataVisita', form);
  const dataDevolucaoWatch = useWatch('dataDevolucao', form);
  const dataEmprestimoWatch = useWatch('dataEmprestimo', form);
  const tipoAtendimentoWatch = useWatch('tipoAtendimento', form);
  const { desabilitarCampos } = useContext(PermissaoContext);

  const dataAtual = dayjs();
  const formatoData = 'DD/MM/YYYY';
  const minDateDataEmprestimo = dayjs(dataVisitaWatch).add(0, 'day');
  const minDateDataDevolucao =
    dayjs(dataEmprestimoWatch).add(1, 'day') || initialValuesModal?.dataEmprestimo;

  const situacaoItemAtendimento = initialValuesModal?.situacaoId;
  const ehBibliografico = initialValuesModal?.tipoAcervoId === TipoAcervo.Bibliografico;
  const atendimentoFinalizado =
    initialValuesAtendimento?.situacaoId === SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO;

  const mostrarSeTiverData = !!initialValuesModal?.dataVisita;
  const ehPresencialWatch = tipoAtendimentoWatch === TipoAtendimentoEnum.Presencial;
  const temDataEhPresencial = mostrarSeTiverData && ehPresencialWatch;

  const onClickConfirmarParcial = async () => {
    if (form.isFieldsTouched()) {
      form.validateFields().then(async () => {
        const values: AcervoSolicitacaoItemDetalheResumidoDTO = form.getFieldsValue(true);

        const dataVisitaFormatada = dayjs(values.dataVisita);

        let novaDataVisita;
        if (values.tipoAtendimento === TipoAtendimentoEnum.Email) {
          novaDataVisita = undefined;
        } else {
          novaDataVisita = dataVisitaFormatada ?? initialValuesModal?.dataVisita;
        }

        const valoresParaSalvar: AcervoSolicitacaoConfirmarDTO = {
          id: acervoSolicitacaoId,
          dataVisita: novaDataVisita,
          itemId: initialValuesModal?.id,
          dataDevolucao: values?.dataDevolucao,
          dataEmprestimo: values?.dataEmprestimo,
          tipoAtendimento: values?.tipoAtendimento,
          tipoAcervo: initialValuesModal?.tipoAcervoId,
        };

        const resposta = await acervoSolicitacaoService.confirmarAtendimento(valoresParaSalvar);

        if (resposta.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: 'O item foi confirmado com sucesso',
          });

          carregarDados();
          setIsModalOpen(false);
        }
      });
    }
  };

  const onClickProrrogarDevolucao = (params: AcervoEmprestimoProrrogacaoDTO) => {
    prorrogarEmprestimo(params).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Item prorrogado com sucesso',
        });

        carregarDados();
        setIsModalOpen(false);
      }
    });
  };

  const onCancel = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
          setIsModalOpen(false);
        },
      });
    } else {
      form.resetFields();
      setIsModalOpen(false);
    }
  };

  const validarSituacaoItem = (situacaoId?: number, ehDataDevolucao?: boolean) => {
    switch (situacaoId) {
      case SituacaoSolicitacaoItemEnum.CANCELADO:
      case !ehDataDevolucao && SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE:
      case SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE:
        return true;

      default:
        return false;
    }
  };

  const ehDataVisitaFuturaDesabilitarEmprestimoEDevolucao = () => {
    const getDataVisita = form.getFieldValue('dataVisita');

    return dayjs(getDataVisita || initialValuesModal?.dataVisita)?.isAfter(dataAtual);
  };

  const validarSituacaoEmprestimoItem = (situacaoId?: number) => {
    switch (situacaoId) {
      case SituacaoEmprestimoEnum.DEVOLVIDO:
      case SituacaoSolicitacaoItemEnum.CANCELADO:
        return true;

      default:
        return false;
    }
  };

  const desabilitarDataDevolucao = () => {
    const desabilitarSeDevolvido = !!(
      initialValuesModal?.situacaoEmprestimo &&
      validarSituacaoEmprestimoItem(initialValuesModal?.situacaoEmprestimo)
    );

    if (atendimentoFinalizado) {
      return false;
    } else if (
      desabilitarSeDevolvido ||
      validarSituacaoItem(situacaoItemAtendimento, true) ||
      ehDataVisitaFuturaDesabilitarEmprestimoEDevolucao()
    ) {
      return true;
    }
  };

  useEffect(() => {
    form.resetFields();
    if (initialValuesModal && isModalOpen) {
      if (initialValuesModal?.dataVisita) {
        form.setFieldValue('dataVisita', dayjs(initialValuesModal.dataVisita));
      }

      if (initialValuesModal?.dataEmprestimo) {
        form.setFieldValue('dataEmprestimo', dayjs(initialValuesModal.dataEmprestimo));
      }

      if (initialValuesModal?.dataDevolucao) {
        form.setFieldValue('dataDevolucao', dayjs(initialValuesModal.dataDevolucao));
      }

      form.setFieldValue('tipoAtendimento', initialValuesModal?.tipoAtendimento);
    }
  }, [form, isModalOpen, initialValuesModal]);

  const onFinish = () => {
    if (initialValuesModal) {
      const itemEstaFinalizadoManualmente =
        initialValuesModal.situacaoId === SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE;

      if (ehBibliografico && itemEstaFinalizadoManualmente) {
        const params: AcervoEmprestimoProrrogacaoDTO = {
          acervoSolicitacaoItemId: initialValuesModal.id,
          dataDevolucao: dataDevolucaoWatch,
        };

        onClickProrrogarDevolucao(params);
      } else {
        onClickConfirmarParcial();
      }
    }
  };

  return (
    <Modal
      destroyOnClose
      onOk={onFinish}
      okText='Confirmar'
      open={isModalOpen}
      onCancel={onCancel}
      cancelText='Cancelar'
      title='Editar solicitação'
      okButtonProps={{
        disabled: desabilitarCampos || validarSituacaoItem(initialValuesModal?.id),
      }}
      {...modalProps}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        validateMessages={validateMessages}
        {...formProps}
      >
        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={12}>
              <SelectTipoAtendimento
                formItemProps={{ label: 'Tipo de atendimento' }}
                selectProps={{
                  disabled: ehBibliografico || desabilitarCampos || atendimentoFinalizado,
                }}
              />
            </Col>

            {(temDataEhPresencial || ehPresencialWatch) && (
              <Col xs={12}>
                <Form.Item
                  name='dataVisita'
                  label='Data da visita'
                  dependencies={ehBibliografico ? ['dataEmprestimo', 'dataDevolucao'] : []}
                >
                  <DatePicker
                    allowClear
                    format={formatoData}
                    style={{ width: '100%' }}
                    placeholder='Selecione uma data'
                    locale={localeDatePicker}
                    minDate={dataAtual}
                    onChange={(date: Dayjs) => {
                      form.setFieldValue('dataVisita', date);
                      form.setFieldValue('dataDevolucao', undefined);
                      form.setFieldValue('dataEmprestimo', undefined);
                    }}
                    disabled={
                      desabilitarCampos ||
                      atendimentoFinalizado ||
                      validarSituacaoItem(situacaoItemAtendimento)
                    }
                  />
                </Form.Item>
              </Col>
            )}

            {(temDataEhPresencial || ehPresencialWatch) && ehBibliografico && (
              <>
                <Col xs={12}>
                  <Form.Item
                    name='dataEmprestimo'
                    label='Data do empréstimo'
                    dependencies={['dataVisita', 'dataDevolucao']}
                  >
                    <DatePicker
                      allowClear
                      format={formatoData}
                      style={{ width: '100%' }}
                      placeholder='Selecione uma data'
                      locale={localeDatePicker}
                      maxDate={dataAtual}
                      minDate={minDateDataEmprestimo}
                      onChange={(date: Dayjs) => {
                        form.setFieldValue('dataEmprestimo', date);
                        form.setFieldValue('dataDevolucao', date?.add(7, 'day'));
                      }}
                      disabled={
                        desabilitarCampos ||
                        atendimentoFinalizado ||
                        ehDataVisitaFuturaDesabilitarEmprestimoEDevolucao() ||
                        validarSituacaoItem(situacaoItemAtendimento)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    name='dataDevolucao'
                    label='Data da devolução'
                    dependencies={['dataEmprestimo', 'dataVisita']}
                  >
                    <DatePicker
                      allowClear
                      format={formatoData}
                      style={{ width: '100%' }}
                      placeholder='Selecione uma data'
                      locale={localeDatePicker}
                      minDate={minDateDataDevolucao}
                      onChange={(date: Dayjs) => form.setFieldValue('dataDevolucao', date)}
                      disabled={desabilitarDataDevolucao()}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Col>
      </Form>
    </Modal>
  );
};
