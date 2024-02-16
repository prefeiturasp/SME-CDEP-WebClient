import { Col, DatePicker, Form, Input, ModalProps, Row } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { FormProps, useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { SelectTipoAtendimento } from '~/components/cdep/input/tipo-atendimento';
import { InputCodigoTombo } from '~/components/cdep/input/tombo-codigo';
import Modal from '~/components/lib/modal';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { AcervoSolicitacaoManualDTO } from '~/core/dto/acervo-solicitacao-manual-dto';
import { CodigoTomboDTO } from '~/core/dto/codigo-tombo-dto';
import {
  SituacaoSolicitacaoManualEnum,
  SituacaoSolicitacaoManualEnumDisplay,
} from '~/core/enum/situacao-atendimento-manual-enum';
import { TipoAtendimentoEnum, TipoAtendimentoEnumDisplay } from '~/core/enum/tipo-atendimento-enum';
import { confirmacao } from '~/core/services/alerta-service';

type ModalAdicionarAcervoProps = {
  modalProps?: ModalProps;
  formProps?: FormProps;
  isModalOpen: boolean;
  dataSource?: any;
  setIsModalOpen: (isOpen: boolean) => void;
  setDataSource: (data: AcervoSolicitacaoManualDTO[]) => void;
  initialValuesModal: AcervoSolicitacaoManualDTO | null;
};

export const ModalAdicionarAcervo: React.FC<ModalAdicionarAcervoProps> = ({
  modalProps,
  formProps,
  isModalOpen,
  setIsModalOpen,
  setDataSource,
  dataSource,
  initialValuesModal,
}) => {
  const minDate = dayjs();
  const [form] = useForm();

  const tipoAtendimentoWatch = Form.useWatch('tipoAtendimento', form);
  const [dadosCodigoTombo, setDadosCodigoTombo] = useState<CodigoTomboDTO>();

  const mostrarSeTiverData = initialValuesModal?.dataVisita;
  const ehPresencialWatch = tipoAtendimentoWatch === TipoAtendimentoEnum.Presencial;
  const temDataEhPresencial = !!mostrarSeTiverData && ehPresencialWatch;

  const onFinish = () => {
    form.validateFields().then((resposta) => {
      const ehEmail = resposta?.tipoAtendimento === TipoAtendimentoEnum.Email;

      const tipoAtendimentoNome = ehEmail
        ? TipoAtendimentoEnumDisplay[TipoAtendimentoEnum.Email]
        : TipoAtendimentoEnumDisplay[TipoAtendimentoEnum.Presencial];

      const situacaoNome = ehEmail
        ? SituacaoSolicitacaoManualEnumDisplay[SituacaoSolicitacaoManualEnum.FINALIZADO_MANUALMENTE]
        : SituacaoSolicitacaoManualEnumDisplay[SituacaoSolicitacaoManualEnum.AGUARDANDO_VISITA];

      const situacaoId = ehEmail
        ? SituacaoSolicitacaoManualEnum.FINALIZADO_MANUALMENTE
        : SituacaoSolicitacaoManualEnum.AGUARDANDO_VISITA;

      const novoItem = {
        acervoId: dadosCodigoTombo?.id,
        codigo: dadosCodigoTombo?.codigo,
        titulo: dadosCodigoTombo?.nome,
        tipoAtendimento: tipoAtendimentoNome,
        tipoAtendimentoId: resposta?.tipoAtendimento,
        situacao: situacaoNome,
        situacaoId,
        dataVisita: resposta?.dataVisita,
      };

      setDataSource([...dataSource, novoItem]);
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
      form.setFieldsValue({
        ...initialValuesModal,
        tipoAtendimento: initialValuesModal.tipoAtendimentoId,
      });
    }
  }, [form, isModalOpen, initialValuesModal]);

  return (
    <Modal
      destroyOnClose
      open={isModalOpen}
      okText='Adicionar'
      title='Inserir acervo à solicitação'
      onOk={onFinish}
      onCancel={onCancel}
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
          <InputCodigoTombo setDadosCodigoTombo={setDadosCodigoTombo} />
        </Col>
        <Col>
          <Form.Item label='Título do acervo' name='titulo' rules={[{ required: true }]}>
            <Input placeholder='Título do acervo' disabled />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={12}>
              <SelectTipoAtendimento formItemProps={{ label: 'Tipo de atendimento' }} />
            </Col>
            {(temDataEhPresencial || ehPresencialWatch) && (
              <Col xs={12}>
                <Form.Item
                  label='Data da visita'
                  name='dataVisita'
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format='DD/MM/YYYY'
                    placeholder='Selecione uma data'
                    locale={localeDatePicker}
                    minDate={minDate}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Col>
      </Form>
    </Modal>
  );
};

export default ModalAdicionarAcervo;
