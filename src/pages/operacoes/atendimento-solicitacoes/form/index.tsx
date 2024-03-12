import { Button, Col, DatePicker, Form, Input, Row, Tag, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { cloneDeep } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import { SelectTipoAtendimento } from '~/components/cdep/input/tipo-atendimento';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
  CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO,
  CDEP_BUTTON_CONFIRMAR,
  CDEP_BUTTON_DEVOLVER_ITEM,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_PRORROGAR_ITEM,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ATENDIMENTO,
  DESEJA_CANCELAR_ITEM_E_DESCARTAR_ITENS_NAO_CONFIRMADOS,
  DESEJA_FINALIZAR_ATENDIMENTO,
  DESEJA_SAIR_MODO_EDICAO,
  ERRO_DATA_DEVOLUCAO,
  ERRO_DATA_EMPRESTIMO,
  ERRO_DATA_VISITA,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { Dayjs, dayjs } from '~/core/date/dayjs';
import { AcervoSolicitacaoConfirmarDTO } from '~/core/dto/acervo-solicitacao-confirmar-dto';
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';

import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import 'dayjs/locale/pt-br';
import { AcervoEmprestimoProrrogacaoDTO } from '~/core/dto/acervo-emprestimo-prorrogacao-dto';
import { AcervoSolicitacaoItemConfirmarDTO } from '~/core/dto/acervo-solicitacao-item-confirmar-dto';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoEnum } from '~/core/enum/situacao-atendimento-enum';
import { SituacaoEmprestimoEnum } from '~/core/enum/situacao-emprestimo-enum';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import { devolverEmprestimo, prorrogarEmprestimo } from '~/core/services/acervo-emprestimo';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { formatarDataParaDDMMYYYY, formatterCPFMask, maskTelefone } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { configTagAcervoDisponibilidadeMap } from '../../solicitacao/components/lista-acervos-solicitacao/utils';

export const FormAtendimentoSolicitacoes: React.FC = () => {
  const [form] = useForm();
  const dataAtual = dayjs();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const { desabilitarCampos } = useContext(PermissaoContext);

  const [formInitialValues, setFormInitialValues] = useState<AcervoSolicitacaoDetalheDTO>();
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoItemDetalheResumidoDTO[]>([]);
  const [dataVisitasEditaveis, setDatasEditaveis] = useState<{
    [key: number]: Dayjs;
  }>();
  const [linhasCamposTocados, setLinhasCamposTocados] = useState<{
    [key: number]: { [key: string]: boolean };
  }>({});

  const temItemFinalizadoAutomaticamente = formInitialValues?.itens.find(
    (item) => item.situacaoId === SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE,
  );

  const temItemFinalizadoManualmente = formInitialValues?.itens.find(
    (item) => item.situacaoId === SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
  );

  const temBibliografico: boolean = useMemo(
    () =>
      dataSource?.length
        ? !!dataSource?.find((item) => item?.tipoAcervoId === TipoAcervo.Bibliografico)
        : false,
    [dataSource],
  );

  const ehUsuarioExterno = formInitialValues?.dadosSolicitante.tipoId != TipoUsuario.CORESSO;
  const acervoSolicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const atendimentoFinalizado =
    formInitialValues?.situacaoId === SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO;

  const atendimentoTaCancelado =
    formInitialValues?.situacaoId === SituacaoSolicitacaoEnum.CANCELADO;

  const podeCancelarAtendimento = () => {
    return !!(
      desabilitarCampos ||
      atendimentoTaCancelado ||
      temItemFinalizadoManualmente ||
      temItemFinalizadoAutomaticamente
    );
  };

  const podeFinalizarAtendimento = () => {
    return !!(
      desabilitarCampos ||
      formInitialValues?.situacaoId === SituacaoSolicitacaoEnum.ATENDIDO_PARCIALMENTE ||
      formInitialValues?.situacaoId === SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO ||
      formInitialValues?.situacaoId === SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO
    );
  };

  const validarSituacaoLinha = (situacaoId: number) => {
    switch (situacaoId) {
      case SituacaoSolicitacaoItemEnum.CANCELADO:
      case SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE:
        return true;

      default:
        return false;
    }
  };

  const validarSituacaoEmprestimoLinha = (situacaoId: number) => {
    switch (situacaoId) {
      case SituacaoEmprestimoEnum.DEVOLVIDO:
        return true;

      default:
        return false;
    }
  };

  const marcarCampoComoTocado = (linhaId: number, fieldName: string) => {
    setLinhasCamposTocados((prev) => {
      const updated = { ...(prev || {}) };

      updated[linhaId] = { [fieldName]: true };

      limparCamposTocadosDeOutrasLinhas(updated, linhaId);

      return updated;
    });
  };

  const limparCamposTocadosDeOutrasLinhas = (
    updated: { [key: number]: { [key: string]: boolean } },
    linhaId: number,
  ) => {
    Object.entries(updated).forEach(([key, value]) => {
      const linhaKey = parseInt(key);

      if (linhaKey !== linhaId && linhaKey in updated && Object.values(value).includes(true)) {
        Object.keys(value).forEach((campo) => {
          updated[linhaKey][campo] = false;
        });
      }
    });
  };

  const camposTocado = (linhaId: number, fieldsName: string[] | undefined) => {
    if (!fieldsName || !Array.isArray(fieldsName) || fieldsName.length === 0) {
      return false;
    }
    return fieldsName?.some((fieldName) => linhasCamposTocados[linhaId]?.[fieldName]);
  };

  const handleChange = (fieldsName: string[], linhaId: number) => {
    fieldsName.forEach((fieldName) => marcarCampoComoTocado(linhaId, fieldName));
  };

  const validarDatas = (linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
    const getDataVisita = form.getFieldValue(['dataVisita', linha.id]);
    const getDataDevolucao = form.getFieldValue(['dataDevolucao', linha.id]);
    const getDataEmprestimo = form.getFieldValue(['dataEmprestimo', linha.id]);

    if ((linha.dataVisita || getDataVisita) && getDataEmprestimo && getDataDevolucao) {
      return dayjs(linha.dataVisita || getDataVisita).isSameOrBefore(getDataEmprestimo, 'day') &&
        dayjs(getDataEmprestimo).isSameOrAfter(linha.dataVisita || getDataVisita, 'day') &&
        dayjs(getDataDevolucao).isSameOrAfter(getDataEmprestimo, 'day')
        ? Promise.resolve()
        : Promise.reject();
    }
  };

  const columns: ColumnsType<AcervoSolicitacaoItemDetalheResumidoDTO> = [
    {
      title: 'N° do tombo/código',
      dataIndex: 'codigo',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      render(value, linha) {
        if (linha && linha.tipoAcervoId) {
          const config = configTagAcervoDisponibilidadeMap[linha.tipoAcervoId];

          return (
            <Col>
              <Row>
                <Typography.Text>{value}</Typography.Text>
                {linha.tipoAcervoId === TipoAcervo.Bibliografico && (
                  <Tag color={config.bgColor}>
                    <Typography.Text
                      style={{
                        color: config.labelColor,
                      }}
                    >
                      {config.valor}
                    </Typography.Text>
                  </Tag>
                )}
              </Row>
            </Col>
          );
        }
      },
    },
    {
      title: 'Tipo de acervo',
      dataIndex: 'tipoAcervo',
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      width: '15%',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      width: '15%',
    },
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
      width: '10%',
      render: (value, linha) => {
        if (value && linha.situacaoId && validarSituacaoLinha(linha.situacaoId)) {
          return TipoAtendimentoEnum?.[value];
        }

        if (linha.situacaoId && validarSituacaoLinha(linha.situacaoId)) return;

        return (
          <SelectTipoAtendimento
            formItemProps={{
              initialValue: value === 0 ? null : value,
              name: ['tipoAtendimento', `${linha.id}`],
              style: {
                margin: 0,
              },
            }}
            selectProps={{
              onChange: () => {
                handleChange(['tipoAtendimento'], linha.id);
              },
              disabled: desabilitarCampos || atendimentoFinalizado,
            }}
          />
        );
      },
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      width: '10%',
      render: (dataVisita: string, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
        const getTipoAtendimento = form.getFieldValue(['tipoAtendimento', `${linha.id}`]);

        const datePicker = (value?: Dayjs | undefined) => {
          const initialValueData = linha?.dataVisita ? dayjs(linha?.dataVisita) : value;

          return (
            <Form.Item
              style={{ margin: 0 }}
              initialValue={initialValueData}
              name={`${['dataVisita', linha.id]}`}
              dependencies={[
                ['dataEmprestimo', linha.id],
                ['dataDevolucao', linha.id],
              ]}
              rules={[
                {
                  message: ERRO_DATA_VISITA,
                  validator: () => validarDatas(linha),
                },
              ]}
            >
              <DatePicker
                allowClear={false}
                onChange={(date: Dayjs) => {
                  form.setFieldValue(['dataVisita', `${linha.id}`], date);
                  onChangeDatas(date, linha);
                  handleChange(['dataVisita'], linha.id);
                }}
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                placeholder='Selecione uma data'
                locale={localeDatePicker}
                minDate={dataAtual}
                disabled={desabilitarCampos || atendimentoFinalizado}
              />
            </Form.Item>
          );
        };

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
  ];

  if (temBibliografico) {
    columns.push(
      {
        title: 'Data do empréstimo',
        dataIndex: 'dataEmprestimo',
        width: '10%',
        render: (_, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
          const dataAtual = dayjs();
          const initialValueData = linha?.dataEmprestimo ? dayjs(linha?.dataEmprestimo) : dataAtual;

          return linha.tipoAcervoId !== TipoAcervo.Bibliografico ? (
            ''
          ) : (
            <Form.Item
              style={{ margin: 0 }}
              initialValue={initialValueData}
              name={['dataEmprestimo', linha.id]}
              dependencies={[
                ['dataVisita', linha.id],
                ['dataDevolucao', linha.id],
              ]}
              rules={[
                {
                  message: ERRO_DATA_EMPRESTIMO,
                  validator: () => validarDatas(linha),
                },
              ]}
            >
              <DatePicker
                allowClear={false}
                onChange={(date: Dayjs) => {
                  form.setFieldValue(['dataEmprestimo', `${linha.id}`], date);
                  onChangeDatas(date, linha);
                  handleChange(['dataEmprestimo'], linha.id);
                }}
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                placeholder='Selecione uma data'
                locale={localeDatePicker}
                disabled={desabilitarCampos || atendimentoFinalizado}
              />
            </Form.Item>
          );
        },
      },
      {
        title: 'Data da devolução',
        dataIndex: 'dataDevolucao',
        width: '10%',
        render: (_, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
          const dataAtual = dayjs();
          const dataSugerida = dataAtual.add(7, 'day');
          const desabilitarData = !!(
            linha.situacaoEmprestimo && validarSituacaoEmprestimoLinha(linha.situacaoEmprestimo)
          );

          const initialValueData = linha?.dataDevolucao
            ? dayjs(linha?.dataDevolucao)
            : dataSugerida;

          return linha.tipoAcervoId !== TipoAcervo.Bibliografico ? (
            ''
          ) : (
            <Form.Item
              style={{ margin: 0 }}
              initialValue={initialValueData}
              name={['dataDevolucao', linha.id]}
              dependencies={[
                ['dataEmprestimo', linha.id],
                ['dataVisita', linha.id],
              ]}
              rules={[
                {
                  message: ERRO_DATA_DEVOLUCAO,
                  validator: () => validarDatas(linha),
                },
              ]}
            >
              <DatePicker
                allowClear={false}
                onChange={(date: Dayjs) => {
                  form.setFieldValue(['dataDevolucao', `${linha.id}`], date);
                  onChangeDatas(date, linha);
                  handleChange(['dataDevolucao'], linha.id);
                }}
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                placeholder='Selecione uma data'
                locale={localeDatePicker}
                disabled={desabilitarData}
              />
            </Form.Item>
          );
        },
      },
    );
  }

  columns.push({
    title: 'Ações',
    align: 'center',
    width: '10%',
    render: (_, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
      const getDataDevolucao = form.getFieldValue(['dataDevolucao', linha.id]);

      const olharCamposTocados = [
        'tipoAtendimento',
        'dataVisita',
        'dataEmprestimo',
        'dataDevolucao',
      ];

      const acervoEhBibliografico = linha.tipoAcervoId === TipoAcervo.Bibliografico;

      const params: AcervoEmprestimoProrrogacaoDTO = {
        acervoSolicitacaoItemId: linha.id,
        dataDevolucao: getDataDevolucao,
      };

      const desabilitarBotao = linha.situacaoEmprestimo
        ? validarSituacaoEmprestimoLinha(linha.situacaoEmprestimo)
        : false;

      return atendimentoFinalizado && acervoEhBibliografico ? (
        <Row wrap={false}>
          <ButtonPrimary
            size='small'
            type='text'
            id={CDEP_BUTTON_PRORROGAR_ITEM}
            onClick={() => onClickProrrogarDevolucao(params)}
            disabled={!camposTocado(linha.id, olharCamposTocados)}
          >
            Prorrogar
          </ButtonPrimary>
          <ButtonPrimary
            size='small'
            id={CDEP_BUTTON_DEVOLVER_ITEM}
            onClick={() => onClickDevolverEmprestimo(linha.id)}
            disabled={desabilitarBotao}
          >
            Devolver item
          </ButtonPrimary>
        </Row>
      ) : (
        <Row wrap={false}>
          <ButtonPrimary
            size='small'
            type='text'
            id={CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO}
            onClick={() => onClickCancelarItemAtendimento(linha.id)}
            disabled={
              (linha.situacaoId && validarSituacaoLinha(linha.situacaoId)) ||
              desabilitarCampos ||
              atendimentoFinalizado
            }
          >
            Cancelar item
          </ButtonPrimary>
          <ButtonPrimary
            size='small'
            id={CDEP_BUTTON_CONFIRMAR}
            onClick={() => onClickConfirmarParcial(linha)}
            disabled={
              desabilitarCampos ||
              atendimentoFinalizado ||
              validarSituacaoLinha(linha.id) ||
              !camposTocado(linha.id, olharCamposTocados)
            }
          >
            Confirmar
          </ButtonPrimary>
        </Row>
      );
    },
  });

  const onClickCancelarItemAtendimento = async (acervoSolicitacaoItemId: number) => {
    confirmacao({
      content: DESEJA_CANCELAR_ITEM_E_DESCARTAR_ITENS_NAO_CONFIRMADOS,
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

  const onChangeDatas = (date: Dayjs, linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
    setDatasEditaveis((prevData) => ({
      ...prevData,
      [linha.id]: date,
    }));
  };

  const carregarDados = useCallback(async () => {
    const resposta = await acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId(
      acervoSolicitacaoId,
    );

    if (resposta.sucesso) {
      const dadosSolicitante = resposta.dados.dadosSolicitante;

      dadosSolicitante.login = dadosSolicitante?.login
        ? formatterCPFMask(dadosSolicitante.login)
        : '';
      dadosSolicitante.telefone = dadosSolicitante?.telefone
        ? maskTelefone(dadosSolicitante.telefone)
        : '';

      const dataSolicitacao = resposta.dados.dataSolicitacao
        ? formatarDataParaDDMMYYYY(resposta.dados.dataSolicitacao)
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

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SAIR_MODO_EDICAO,
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
          setLinhasCamposTocados({});
          form.resetFields();
        },
      });
    }
  };

  const onClickCancelarAtendimento = async () => {
    confirmacao({
      content: DESEJA_CANCELAR_ATENDIMENTO,
      onOk() {
        acervoSolicitacaoService.cancelarAtendimento(acervoSolicitacaoId).then((resposta) => {
          if (resposta.sucesso) {
            navigate(ROUTES.ATENDIMENTO_SOLICITACOES);
            notification.success({
              message: 'Sucesso',
              description: 'Atendimento cancelado com sucesso',
            });
          }
        });
      },
    });
  };

  const onClickConfirmarParcial = async (linha: AcervoSolicitacaoItemDetalheResumidoDTO) => {
    if (form.isFieldsTouched()) {
      form.validateFields(['tipoAtendimento', linha.id]).then(async () => {
        const valoresParaSalvar = dataSource
          ?.filter((item) => item.id === linha.id)
          .map((item) => {
            let novaDataVisita;
            const valorTipoAtendimento = form.getFieldValue(['tipoAtendimento', `${item.id}`]);

            if (valorTipoAtendimento === TipoAtendimentoEnum.Email) {
              novaDataVisita = undefined;
            } else {
              novaDataVisita = form.getFieldValue(['dataVisita', `${item.id}`]) ?? item.dataVisita;
            }

            const paramsItem: AcervoSolicitacaoItemConfirmarDTO = {
              id: item.id,
              dataVisita: novaDataVisita,
              tipoAcervo: linha.tipoAcervoId,
              tipoAtendimento: valorTipoAtendimento,
              dataEmprestimo:
                form.getFieldValue(['dataEmprestimo', `${item.id}`]) ?? item.dataEmprestimo,
              dataDevolucao:
                form.getFieldValue(['dataDevolucao', `${item.id}`]) ?? item.dataDevolucao,
            };

            return paramsItem;
          });

        const params: AcervoSolicitacaoConfirmarDTO = {
          id: acervoSolicitacaoId,
          itens: cloneDeep(valoresParaSalvar),
        };

        const resposta = await acervoSolicitacaoService.confirmarAtendimento(params);

        if (resposta.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: 'O item foi confirmado com sucesso',
          });
          carregarDados();
          setLinhasCamposTocados({});
        }
      });
    }
  };

  const onClickFinalizarAtendimento = () => {
    confirmacao({
      content: DESEJA_FINALIZAR_ATENDIMENTO,
      onOk() {
        acervoSolicitacaoService.finalizarAtendimento(acervoSolicitacaoId).then((resposta) => {
          if (resposta.sucesso) {
            navigate(ROUTES.ATENDIMENTO_SOLICITACOES);
            notification.success({
              message: 'Sucesso',
              description: 'Atendimento finalizado com sucesso',
            });
          }
        });
      },
    });
  };

  const onClickProrrogarDevolucao = (params: AcervoEmprestimoProrrogacaoDTO) => {
    prorrogarEmprestimo(params).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Item prorrogado com sucesso',
        });
      }
    });
  };

  const onClickDevolverEmprestimo = (id: number) => {
    devolverEmprestimo(id).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Item devolvido com sucesso',
        });
      }
    });
  };

  useEffect(() => {
    if (acervoSolicitacaoId) {
      carregarDados();
    }
  }, [carregarDados, acervoSolicitacaoId]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        validateMessages={validateMessages}
        initialValues={formInitialValues}
      >
        <HeaderPage title='Atendimento de Solicitações'>
          <Col span={24}>
            <Form.Item shouldUpdate style={{ margin: 0 }}>
              {(formItem) => {
                const desabilitarConfirmarECancelar = !formItem.isFieldsTouched();

                return (
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
                            disabled={desabilitarConfirmarECancelar}
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
                        disabled={podeFinalizarAtendimento() || !desabilitarConfirmarECancelar}
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
                        disabled={podeCancelarAtendimento()}
                        onClick={onClickCancelarAtendimento}
                      >
                        Cancelar atendimento
                      </Button>
                    </Col>
                  </Row>
                );
              }}
            </Form.Item>
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

              {ehUsuarioExterno && (
                <>
                  <Col xs={24} md={8}>
                    <Form.Item label='CPF' name={['dadosSolicitante', 'login']}>
                      <Input type='text' placeholder='CPF' disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label='Telefone' name={['dadosSolicitante', 'telefone']}>
                      <Input type='text' placeholder='telefone' disabled />
                    </Form.Item>
                  </Col>
                </>
              )}

              <Col xs={24} md={8}>
                <Form.Item label='E-mail' name={['dadosSolicitante', 'email']}>
                  <Input type='text' placeholder='email' disabled />
                </Form.Item>
              </Col>

              {ehUsuarioExterno && (
                <Col xs={24} md={16}>
                  <Form.Item label='Endereço' name={['dadosSolicitante', 'endereco']}>
                    <Input type='text' placeholder='Endereço' disabled />
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} md={8}>
                <Form.Item label='Data da solicitação' name='dataSolicitacao'>
                  <Input type='text' placeholder='Data da solicitação' disabled />
                </Form.Item>
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
