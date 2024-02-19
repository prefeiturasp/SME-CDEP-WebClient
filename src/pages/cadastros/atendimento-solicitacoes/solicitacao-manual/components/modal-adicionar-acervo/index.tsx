import { Col, DatePicker, Form, Input, ModalProps, Row } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { FormProps, useForm, useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { SelectTipoAtendimento } from '~/components/cdep/input/tipo-atendimento';
import { InputCodigoTombo } from '~/components/cdep/input/tombo-codigo';
import Modal from '~/components/lib/modal';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { confirmacao } from '~/core/services/alerta-service';

type ModalAdicionarAcervoProps = {
  modalProps?: ModalProps;
  formProps?: FormProps;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  initialValuesModal?: AcervoSolicitacaoItemDetalheResumidoDTO;
  dataSource?: AcervoSolicitacaoItemDetalheResumidoDTO[];
  setDataSource: React.Dispatch<React.SetStateAction<AcervoSolicitacaoItemDetalheResumidoDTO[]>>;
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

  const tipoAtendimentoWatch = useWatch('tipoAtendimento', form);

  const mostrarSeTiverData = !!initialValuesModal?.dataVisita;
  const ehPresencialWatch = tipoAtendimentoWatch === TipoAtendimentoEnum.Presencial;
  const temDataEhPresencial = mostrarSeTiverData && ehPresencialWatch;

  const onFinish = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue(true);
      const ehEmail = values?.tipoAtendimento === TipoAtendimentoEnum.Email;

      const situacaoId = ehEmail
        ? SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE
        : SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA;

      const novoItem: AcervoSolicitacaoItemDetalheResumidoDTO = {
        id: 0,
        codigo: values?.dadosCodigoTombo?.codigo,
        acervoId: values?.dadosCodigoTombo?.id,
        titulo: values?.dadosCodigoTombo?.nome,
        tipoAtendimento: values?.tipoAtendimento,
        dataVisita: values?.dataVisita,
        situacaoId,
      };

      if (!dataSource?.length) {
        setDataSource([novoItem]);
      } else {
        const indexByAcervoId = dataSource?.findIndex(
          (item) => item.acervoId === novoItem?.acervoId,
        );
        const indexById = dataSource?.findIndex((item) => item.id === initialValuesModal?.id);

        const index = indexById || indexByAcervoId;

        if (dataSource?.length && index > -1) {
          dataSource[index] = { ...novoItem };
          setDataSource([...dataSource]);
        } else {
          setDataSource([...dataSource, novoItem]);
        }
      }

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
      const dadosCodigoTombo = {
        codigo: initialValuesModal.codigo,
        nome: initialValuesModal.titulo,
        id: initialValuesModal.acervoId,
      };
      form.setFieldValue('dadosCodigoTombo', dadosCodigoTombo);
      form.setFieldValue('dataVisita', initialValuesModal.dataVisita);
      form.setFieldValue('tipoAtendimento', initialValuesModal.tipoAtendimento);
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
          <InputCodigoTombo />
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
