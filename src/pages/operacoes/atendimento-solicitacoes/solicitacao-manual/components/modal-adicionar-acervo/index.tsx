import { Col, DatePicker, Form, Input, ModalProps, Row } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { Rule } from 'antd/es/form';
import { FormInstance, FormProps, useForm, useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import InputNumero from '~/components/cdep/input/numero';
import { SelectTipoAtendimento } from '~/components/cdep/input/tipo-atendimento';
import { InputCodigoTombo } from '~/components/cdep/input/tombo-codigo';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';
import { CodigoTomboDTO } from '~/core/dto/codigo-tombo-dto';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { formatarHora } from '~/core/utils/functions';

type ModalAdicionarAcervoProps = {
  modalProps?: ModalProps;
  formProps?: FormProps;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  initialValuesModal?: AcervoSolicitacaoItemDetalheResumidoDTO;
  formSolicitacaoManual: FormInstance;
};

export const ModalAdicionarAcervo: React.FC<ModalAdicionarAcervoProps> = ({
  modalProps,
  formProps,
  isModalOpen,
  setIsModalOpen,
  initialValuesModal,
  formSolicitacaoManual,
}) => {
  const dataAtual = dayjs();
  const minDateMenos7 = dayjs().subtract(7, 'day');
  const [form] = useForm();
  const tipoAtendimentoWatch = useWatch('tipoAtendimento', form);
  const dataVisitaWatch = useWatch('dataVisita', form);
  const minDateDataEmprestimo = dayjs(dataVisitaWatch).add(0, 'day');

  const [desabilitarAdicionar, setDesabilitarAdicionar] = useState<boolean>(false);
  const [tipoAcervo, setTipoAcervo] = useState<TipoAcervo>();
  const ehBibliografico =
    (tipoAcervo || initialValuesModal?.tipoAcervoId) === TipoAcervo.Bibliografico;

  const mostrarSeTiverData = !!initialValuesModal?.dataVisita;
  const ehPresencialWatch = tipoAtendimentoWatch === TipoAtendimentoEnum.Presencial;
  const temDataEhPresencial = mostrarSeTiverData && ehPresencialWatch;

  const rules: Rule[] = [{ required: true }];

  const onFinish = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue(true);

      const [horas, minutos] = values && values.horaVisita ? values.horaVisita.split(':') : [];

      const dataVisitaFormatada = dayjs(values.dataVisita)
        .utc(true)
        .hour(parseInt(horas))
        .minute(parseInt(minutos));

      const ehEmail = values?.tipoAtendimento === TipoAtendimentoEnum.Email;

      const situacaoId = ehEmail
        ? SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE
        : SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA;

      const novoItem: AcervoSolicitacaoItemDetalheResumidoDTO = {
        id: initialValuesModal?.id || 0,
        codigo: values?.dadosCodigoTombo?.codigo,
        acervoId: values?.dadosCodigoTombo?.id,
        titulo: values?.dadosCodigoTombo?.nome,
        tipoAtendimento: ehBibliografico ? TipoAtendimentoEnum.Presencial : values?.tipoAtendimento,
        dataVisita: ehEmail ? '' : dataVisitaFormatada,
        tipoAcervoId: values?.dadosCodigoTombo?.tipo,
        dataEmprestimo: values?.dataEmprestimo,
        dataDevolucao: values?.dataDevolucao,
        horaVisita: values?.horaVisita,
        situacaoId,
      };

      const valuesFormSolicitacaoManual: AcervoSolicitacaoDetalheDTO =
        formSolicitacaoManual.getFieldsValue(true);

      const dataSource: AcervoSolicitacaoItemDetalheResumidoDTO[] = valuesFormSolicitacaoManual
        .itens?.length
        ? valuesFormSolicitacaoManual.itens
        : [];

      const itemDuplicado = dataSource.find(
        (item) =>
          item.acervoId === novoItem.acervoId &&
          item.situacaoId !== SituacaoSolicitacaoItemEnum.CANCELADO,
      );

      if (!initialValuesModal) {
        if (itemDuplicado) {
          notification.error({
            message: 'Erro',
            description: 'N° do tombo/código duplicado',
          });
          return;
        }
      }

      if (!dataSource?.length) {
        formSolicitacaoManual.setFieldValue('itens', [novoItem]);
      } else {
        const indexByAcervoId = dataSource?.findIndex(
          (item) => item.acervoId === novoItem?.acervoId,
        );

        const indexById = dataSource?.findIndex((item) => item.id === initialValuesModal?.id);

        const index = indexById || indexByAcervoId;

        if (dataSource?.length && index > -1) {
          dataSource[index] = { ...novoItem };
          formSolicitacaoManual.setFieldValue('itens', [...dataSource]);
        } else {
          formSolicitacaoManual.setFieldValue('itens', [...dataSource, novoItem]);
        }
      }

      setTipoAcervo(undefined);
      setIsModalOpen(false);
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

  useEffect(() => {
    form.resetFields();
    if (initialValuesModal && isModalOpen) {
      const dadosCodigoTombo: CodigoTomboDTO = {
        tipo: initialValuesModal.tipoAcervoId,
        codigo: initialValuesModal.codigo,
        nome: initialValuesModal.titulo,
        id: initialValuesModal.acervoId,
      };

      form.setFieldValue('dadosCodigoTombo', dadosCodigoTombo);

      if (initialValuesModal?.dataVisita) {
        form.setFieldValue('dataVisita', dayjs(initialValuesModal.dataVisita));
      }

      if (initialValuesModal?.horaVisita || initialValuesModal.dataVisitaFormatada) {
        if (initialValuesModal.dataVisitaFormatada) {
          initialValuesModal.horaVisita = initialValuesModal.dataVisitaFormatada.split(' ')[1];
        }

        form.setFieldValue('horaVisita', initialValuesModal.horaVisita);
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

  useEffect(() => {
    if (ehBibliografico) {
      const dadosTombo: CodigoTomboDTO = form.getFieldValue('dadosCodigoTombo');

      if (
        (dadosTombo?.temControleDisponibilidade && dadosTombo?.estaDisponivel) ||
        !dadosTombo?.temControleDisponibilidade
      ) {
        setDesabilitarAdicionar(false);
      } else {
        setDesabilitarAdicionar(true);
      }

      form.setFieldValue('tipoAtendimento', TipoAtendimentoEnum.Presencial);
      form.setFieldValue('dataVisita', dayjs());
      form.setFieldValue('dataEmprestimo', dayjs());
      form.setFieldValue('dataDevolucao', dayjs().add(7, 'day'));
    }
  }, [form, tipoAcervo, ehBibliografico]);

  return (
    <Modal
      destroyOnClose
      onOk={onFinish}
      okText='Adicionar'
      open={isModalOpen}
      onCancel={onCancel}
      maskClosable={false}
      cancelText='Cancelar'
      title='Inserir acervo à solicitação'
      okButtonProps={{
        disabled: desabilitarAdicionar,
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
        <Col>
          <InputCodigoTombo
            setTipoAcervo={setTipoAcervo}
            inputProps={{ disabled: !!initialValuesModal?.id }}
          />
        </Col>

        <Col>
          <Form.Item
            label='Título do acervo'
            name={['dadosCodigoTombo', 'nome']}
            rules={[{ required: true }]}
          >
            <Input placeholder='Título do acervo' disabled />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={12}>
              <SelectTipoAtendimento
                formItemProps={{ label: 'Tipo de atendimento' }}
                selectProps={{ disabled: ehBibliografico }}
              />
            </Col>

            {(temDataEhPresencial || ehPresencialWatch) && (
              <Col xs={24}>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <Form.Item
                      name='dataVisita'
                      label='Data da visita'
                      dependencies={ehBibliografico ? ['dataEmprestimo', 'dataDevolucao'] : []}
                      rules={[...rules]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        format='DD/MM/YYYY'
                        placeholder='Selecione uma data'
                        locale={localeDatePicker}
                        minDate={minDateMenos7}
                        maxDate={dataAtual}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <InputNumero
                      formItemProps={{
                        label: 'Hora da visita',
                        name: 'horaVisita',
                        getValueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) =>
                          formatarHora(e.target.value),
                        dependencies: ['dataVisita'],
                        rules: [
                          ({ getFieldValue }) => ({
                            required: getFieldValue('dataVisita'),
                            message: 'É necessário informar a hora da visita.',
                          }),
                        ],
                      }}
                      inputProps={{ placeholder: 'Informe a hora', maxLength: 5 }}
                    />
                  </Col>
                </Row>
              </Col>
            )}

            {(temDataEhPresencial || ehPresencialWatch) && ehBibliografico && (
              <>
                <Col xs={12}>
                  <Form.Item
                    name='dataEmprestimo'
                    label='Data do empréstimo'
                    dependencies={['dataVisita', 'dataDevolucao']}
                    rules={[...rules]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format='DD/MM/YYYY'
                      placeholder='Selecione uma data'
                      locale={localeDatePicker}
                      minDate={minDateDataEmprestimo}
                      maxDate={dataAtual}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label='Data da devolução'
                    name='dataDevolucao'
                    dependencies={['dataEmprestimo', 'dataVisita']}
                    rules={[...rules]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format='DD/MM/YYYY'
                      placeholder='Selecione uma data'
                      locale={localeDatePicker}
                      minDate={dataAtual}
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
