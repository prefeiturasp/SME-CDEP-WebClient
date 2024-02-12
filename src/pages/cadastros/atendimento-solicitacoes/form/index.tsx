import { Button, Col, DatePicker, Form, Input, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { cloneDeep } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
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
  CDEP_BUTTON_ADICIONAR_ACERVOS,
  CDEP_BUTTON_ASSUMIR_ATENDIMENTO,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
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
import DataTableContextProvider, { DataTableContext } from '~/components/lib/data-table/provider';
import { ROUTES } from '~/core/enum/routes';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { formatarDataPorFormato, formatterCPFMask, maskTelefone } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

export const FormAtendimentoSolicitacoes: React.FC = () => {
  const [form] = useForm();

  const navigate = useNavigate();
  const paramsRoute = useParams();
  const { tableState } = useContext(DataTableContext);

  const { desabilitarCampos } = useContext(PermissaoContext);

  const auth = useAppSelector((store) => store.auth);

  const usuarioLogin = auth?.usuarioLogin;

  const [formInitialValues, setFormInitialValues] = useState<AcervoSolicitacaoDetalheDTO>();
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoItemDetalheResumidoDTO[]>([]);
  const [dataVisitasEditaveis, setDataVisitasEditaveis] = useState<{
    [key: number]: Dayjs;
  }>();

  const dataAtual = dayjs();
  const tipoAtendimentoWatch = Form.useWatch('tipoAtendimento', form);

  const acervoSolicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const onChangeDataVisita = (date: Dayjs, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
    setDataVisitasEditaveis((prevDataVisitas) => ({
      ...prevDataVisitas,
      [linha.id]: date,
    }));
  };

  const onClickSalvarDataVisita = async (linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
    const dataVisitaEditavel = dataVisitasEditaveis?.[linha.id];

    if (dataVisitaEditavel) {
      const resultado = await acervoSolicitacaoService.alterarDataVisitaDoItemAtendimento({
        id: linha.id,
        dataVisita: dataVisitaEditavel,
      });

      if (resultado.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Data inserida/alterada com sucesso',
        });
      }

      setDataVisitasEditaveis((prevDataVisitas) => {
        const newDataVisitas = { ...prevDataVisitas };
        delete newDataVisitas[linha.id];
        return newDataVisitas;
      });
    }
  };

  const columns: ColumnsType<AcervoSolicitacaoItemDetalheResumidoDTO> = [
    {
      title: 'N° do tombo/código',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: 'Título',
      dataIndex: 'codigo',
      width: '20%',
    },
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
      width: '35%',
      render: (value) => {
        if (value) {
          return TipoAtendimentoEnum?.[value];
        }

        return (
          <SelectTipoAtendimento
            formItemProps={{
              style: {
                margin: 0,
                width: '80%',
              },
            }}
          />
        );
      },
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      width: '35%',
      render: (dataVisita: string, record: AcervoSolicitacaoItemDetalheResumidoDTO) => {
        const datePicker = (value?: Dayjs | undefined, exibirConfirmar?: boolean) => (
          <Row gutter={[8, 8]} align='middle'>
            <Col style={{ width: '60%' }}>
              <DatePicker
                allowClear={false}
                value={value}
                onChange={(date: any) => {
                  form.setFieldValue('dataVisita', date);
                  onChangeDataVisita(date, record);
                }}
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                placeholder='Selecione uma data'
                locale={localeDatePicker}
                minDate={dataAtual}
              />
            </Col>
            {exibirConfirmar && (
              <Col>
                <ButtonPrimary
                  id={CDEP_BUTTON_ADICIONAR_ACERVOS}
                  onClick={() => onClickSalvarDataVisita(record)}
                  disabled={!dataVisitasEditaveis?.[record.id]}
                >
                  Confirmar
                </ButtonPrimary>
              </Col>
            )}
          </Row>
        );

        if (record?.tipoAtendimento === TipoAtendimentoEnum.Presencial) {
          let value = undefined;

          if (dataVisitasEditaveis?.[record.id]) {
            value = dataVisitasEditaveis[record.id];
          }

          if (!dataVisitasEditaveis?.[record.id] && dataVisita) {
            value = dayjs(dataVisita);
          }

          const exibirConfirmar = !!dataVisitasEditaveis?.[record.id];

          return datePicker(value, exibirConfirmar);
        }

        return dataVisita
          ? formatarDataPorFormato(dataVisita, 'DD/MM/YYYY - HH:mm')
          : tipoAtendimentoWatch === TipoAtendimentoEnum.Presencial
          ? datePicker()
          : '';
      },
    },
  ];

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
    form.setFieldValue('responsavel', usuarioLogin);
  };

  const onClickConfirmarAtendimento = async () => {
    const valoresParaSalvar = dataSource.map((item) => ({
      ...item,
      dataVisita: form.getFieldValue('dataVisita'),
      tipoAtendimento: form.getFieldValue('tipoAtendimento'),
    }));

    const params: AcervoSolicitacaoConfirmarDTO = {
      id: acervoSolicitacaoId,
      itens: cloneDeep(valoresParaSalvar),
      responsavelRf: form.getFieldValue('responsavel'),
    };

    const resposta = await acervoSolicitacaoService.confirmarAtendimento(params);

    if (resposta.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Atendimento confirmado com sucesso',
      });

      tableState.reloadData();
    }
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
                  disabled
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
            <DataTableContextProvider>
              <DataTable columns={columns} dataSource={dataSource} showOrderButton={false} />
            </DataTableContextProvider>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
