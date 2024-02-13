import { Button, Col, DatePicker, Form, Input, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import SelectResponsaveis from '~/components/cdep/input/responsaveis';
import { SelectTipoAtendimento } from '~/components/cdep/input/tipo-atendimento';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_ASSUMIR_ATENDIMENTO,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
  CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO,
  CDEP_BUTTON_CONFIRMAR,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { Dayjs, dayjs } from '~/core/date/dayjs';
import { AcervoSolicitacaoConfirmarDTO } from '~/core/dto/acervo-solicitacao-confirmar-dto';
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';

import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import 'dayjs/locale/pt-br';
import { AcervoSolicitacaoItemConfirmarDTO } from '~/core/dto/acervo-solicitacao-item-confirmar-dto';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoEnum } from '~/core/enum/situacao-atendimento-enum';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { formatarDataPorFormato, formatterCPFMask, maskTelefone } from '~/core/utils/functions';

export const FormAtendimentoSolicitacoes: React.FC = () => {
  const dataAtual = dayjs();

  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const auth = useAppSelector((store) => store.auth);

  const [formInitialValues, setFormInitialValues] = useState<AcervoSolicitacaoDetalheDTO>();
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoItemDetalheResumidoDTO[]>([]);
  const [dataVisitasEditaveis, setDataVisitasEditaveis] = useState<{
    [key: number]: Dayjs;
  }>();

  const usuarioLogin = auth?.usuarioLogin;
  const acervoSolicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;
  const desabilitarCampos =
    formInitialValues?.situacaoId === SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO;

  const validarSituacaoLinha = (situacaoId: number) => {
    switch (situacaoId) {
      case SituacaoSolicitacaoItemEnum.CANCELADO:
      case SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE:
        return true;

      default:
        return false;
    }
  };

  const columns: ColumnsType<AcervoSolicitacaoItemDetalheResumidoDTO> = [
    {
      title: 'N° do tombo/código',
      dataIndex: 'codigo',
      width: '10%',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      width: '10%',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
      render: (value, linha) => {
        if (value && validarSituacaoLinha(linha.situacaoId)) {
          return TipoAtendimentoEnum?.[value];
        }

        if (validarSituacaoLinha(linha.situacaoId)) return;

        return (
          <SelectTipoAtendimento
            formItemProps={{
              initialValue: value,
              name: ['tipoAtendimento', `${linha.id}`],
              style: {
                margin: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      render: (dataVisita: string, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
        const getTipoAtendimento = form.getFieldValue(['tipoAtendimento', `${linha.id}`]);

        const datePicker = (value?: Dayjs | undefined) => (
          <Row gutter={[8, 8]} align='middle'>
            <Col>
              <DatePicker
                allowClear={false}
                value={value}
                onChange={(date: any) => {
                  form.setFieldValue(['dataVisita', `${linha.id}`], date);
                  onChangeDataVisita(date, linha);
                }}
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                placeholder='Selecione uma data'
                locale={localeDatePicker}
                minDate={dataAtual}
              />
            </Col>
          </Row>
        );

        const mostrarCampoDatePicker = (value?: Dayjs) =>
          getTipoAtendimento === TipoAtendimentoEnum.Presencial ? datePicker(value) : '';

        if (linha?.tipoAtendimento === TipoAtendimentoEnum.Presencial) {
          let value = undefined;

          if (dataVisitasEditaveis?.[linha.id]) {
            value = dataVisitasEditaveis[linha.id];
          }

          if (!dataVisitasEditaveis?.[linha.id] && dataVisita) {
            value = dayjs(dataVisita);
          }

          return mostrarCampoDatePicker(value);
        }

        return mostrarCampoDatePicker();
      },
    },
    {
      title: 'Ações',
      align: 'center',
      width: '100px',
      render: (_, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => (
        <ButtonPrimary
          type='text'
          id={CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO}
          onClick={() => onClickCancelarItemAtendimento(linha.id)}
          disabled={validarSituacaoLinha(linha.situacaoId) || desabilitarCampos}
        >
          Cancelar item
        </ButtonPrimary>
      ),
    },
  ];

  const onClickCancelarItemAtendimento = async (acervoSolicitacaoItemId: number) => {
    confirmacao({
      content: 'Deseja realmente cancelar este item?',
      onOk: async () => {
        const resultado = await acervoSolicitacaoService.cancelarItemAtendimento(
          acervoSolicitacaoItemId,
        );

        if (resultado.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: 'Item cancelado com sucesso',
          });
          carregarDados();
        }
      },
    });
  };

  const onChangeDataVisita = (date: Dayjs, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
    setDataVisitasEditaveis((prevDataVisitas) => ({
      ...prevDataVisitas,
      [linha.id]: date,
    }));
  };

  const carregarDados = useCallback(async () => {
    const resposta = await acervoSolicitacaoService.obterDetalhesAcervoSolicitacao(
      acervoSolicitacaoId,
    );

    if (resposta.sucesso) {
      const dadosSolicitante = resposta.dados.dadosSolicitante;
      dadosSolicitante.cpf = dadosSolicitante?.cpf ? formatterCPFMask(dadosSolicitante.cpf) : '';
      dadosSolicitante.telefone = dadosSolicitante?.telefone
        ? maskTelefone(dadosSolicitante.telefone)
        : '';

      const dataSolicitacao = resposta.dados.dataSolicitacao
        ? formatarDataPorFormato(resposta.dados.dataSolicitacao, 'DD/MM/YYYY - HH:mm')
        : '';

      const dadosMapeados: AcervoSolicitacaoDetalheDTO = {
        ...resposta.dados,
        dadosSolicitante,
        dataSolicitacao,
      };
      setFormInitialValues(dadosMapeados);
      setDataSource(dadosMapeados.itens);
    }
  }, [acervoSolicitacaoId]);

  useEffect(() => {
    if (acervoSolicitacaoId) {
      carregarDados();
    }
  }, [carregarDados, acervoSolicitacaoId]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: 'Você tem certeza que deseja fechar o modo de edição?',
        onOk() {
          navigate(ROUTES.ATENDIMENTO_SOLICITACOES);
        },
      });
    } else {
      navigate(ROUTES.ATENDIMENTO_SOLICITACOES);
    }
  };

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
        },
      });
    }
  };

  const onClickAssumirAtendimento = () => {
    form.setFieldValue('responsavelRf', usuarioLogin);
  };

  const onClickConfirmarAtendimento = async () => {
    form.validateFields().then(async () => {
      const valoresFiltrado = dataSource.filter(
        (item) =>
          item.situacaoId != SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE &&
          item.situacaoId != SituacaoSolicitacaoItemEnum.CANCELADO,
      );

      const valoresParaSalvar = valoresFiltrado.map((item: AcervoSolicitacaoItemConfirmarDTO) => ({
        id: item.id,
        dataVisita: form.getFieldValue(['dataVisita', `${item.id}`]),
        tipoAtendimento: form.getFieldValue(['tipoAtendimento', `${item.id}`]),
      }));

      const params: AcervoSolicitacaoConfirmarDTO = {
        id: acervoSolicitacaoId,
        itens: cloneDeep(valoresParaSalvar),
        responsavelRf: form.getFieldValue('responsavelRf'),
      };

      const resposta = await acervoSolicitacaoService.confirmarAtendimento(params);

      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Atendimento confirmado com sucesso',
        });
        carregarDados();
      }
    });
  };

  const onClickFinalizarAtendimento = () => {
    confirmacao({
      content: 'Deseja realmente finalizar o atendimento?',
      onOk: async () => {
        const resultado = await acervoSolicitacaoService.finalizarAtendimento(acervoSolicitacaoId);

        if (resultado.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: 'Atendimento finalizado com sucesso',
          });
        }
      },
    });
  };

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        validateMessages={validateMessages}
        initialValues={formInitialValues}
        disabled={desabilitarCampos}
      >
        <HeaderPage title='Atendimento de Solicitações'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
              </Col>
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <ButtonSecundary
                      id={CDEP_BUTTON_CANCELAR}
                      onClick={() => onClickCancelar()}
                      disabled={!form.isFieldsTouched()}
                    >
                      Cancelar
                    </ButtonSecundary>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Button
                  block
                  htmlType='submit'
                  id={CDEP_BUTTON_FINALIZAR}
                  style={{ fontWeight: 700 }}
                  disabled={
                    formInitialValues?.situacaoId === SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA
                  }
                  onClick={onClickFinalizarAtendimento}
                >
                  Finalizar
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  id={CDEP_BUTTON_CANCELAR_ATENDIMENTO}
                  style={{ fontWeight: 700 }}
                  disabled
                >
                  Cancelar atendimento
                </Button>
              </Col>
              <Col>
                <ButtonPrimary id={CDEP_BUTTON_CONFIRMAR} onClick={onClickConfirmarAtendimento}>
                  Confirmar
                </ButtonPrimary>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col xs={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={8}>
                <Form.Item label='N° da solicitação' name='id'>
                  <Input
                    type='text'
                    placeholder='N° da solicitação'
                    id={CDEP_INPUT_NUMERO_SOLICITACAO}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={16}>
                <Form.Item label='Nome' name={['dadosSolicitante', 'nome']}>
                  <Input type='text' placeholder='nome' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='CPF' name={['dadosSolicitante', 'cpf']}>
                  <Input type='text' placeholder='CPF' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Telefone' name={['dadosSolicitante', 'telefone']}>
                  <Input type='text' placeholder='telefone' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='E-mail' name={['dadosSolicitante', 'email']}>
                  <Input type='text' placeholder='email' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={16}>
                <Form.Item label='Endereço' name={['dadosSolicitante', 'endereco']}>
                  <Input type='text' placeholder='Endereço' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Data da solicitação' name='dataSolicitacao'>
                  <Input type='text' placeholder='Data da solicitação' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={16}>
                <Space.Compact style={{ width: '100%' }}>
                  <SelectResponsaveis
                    formItemProps={{ style: { width: '100%' } }}
                    selectProps={{ style: { width: '100%' } }}
                  />

                  <Button
                    style={{ marginTop: 24 }}
                    type='primary'
                    id={CDEP_BUTTON_ASSUMIR_ATENDIMENTO}
                    onClick={() => onClickAssumirAtendimento()}
                  >
                    Assumir atendimento
                  </Button>
                </Space.Compact>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item name='situacao' label='Situação'>
                  <Input type='text' placeholder='Situação' disabled />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <Form.Item shouldUpdate>
              {() => {
                return (
                  <DataTable columns={columns} dataSource={dataSource} showOrderButton={false} />
                );
              }}
            </Form.Item>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
