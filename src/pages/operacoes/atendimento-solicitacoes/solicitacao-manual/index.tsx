import { StopOutlined } from '@ant-design/icons';
import { Col, DatePicker, Form, Input, Row } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { useForm, useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import _, { cloneDeep } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_ADICIONAR_ACERVOS,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CONFIRMAR,
  CDEP_BUTTON_EDITAR,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_REMOVER_ACERVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ITEM,
  DESEJA_FINALIZAR_ATENDIMENTO,
  DESEJA_REMOVER_ACERVO,
  DESEJA_SAIR_MODO_EDICAO,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { dayjs } from '~/core/date/dayjs';
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';
import {
  AcervoSolicitacaoItemManualDTO,
  AcervoSolicitacaoManualDTO,
} from '~/core/dto/acervo-solicitacao-manual-dto';
import { ROUTES } from '~/core/enum/routes';
import {
  SituacaoSolicitacaoItemEnum,
  SituacaoSolicitacaoItemEnumDisplay,
} from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum, TipoAtendimentoEnumDisplay } from '~/core/enum/tipo-atendimento-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import {
  formatarDataParaDDMMYYYY,
  formatarDataPorFormato,
  maskTelefone,
} from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ModalAdicionarAcervo } from './components/modal-adicionar-acervo';
import { InputRfCpf } from './components/rf-cpf';

export const SolicitacaoManual: React.FC = () => {
  const [form] = useForm();
  const maxDate = dayjs();

  const navigate = useNavigate();
  const paramsRoute = useParams();
  const { desabilitarCampos } = useContext(PermissaoContext);
  const nome = useWatch(['dadosSolicitante', 'nome'], form);
  const rfCpfWatch = useWatch(['dadosSolicitante', 'login'], form)?.length;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [initialValuesModal, setInitialValuesModal] =
    useState<AcervoSolicitacaoItemDetalheResumidoDTO>();
  const [formInitialValues, setFormInitialValues] = useState<AcervoSolicitacaoDetalheDTO>();
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoItemDetalheResumidoDTO[]>([]);

  const values: AcervoSolicitacaoDetalheDTO = form.getFieldsValue(true);
  const temBibliografico: boolean = useMemo(
    () =>
      dataSource?.length
        ? !!dataSource?.find((item) => item?.tipoAcervoId === TipoAcervo.Bibliografico)
        : false,
    [dataSource],
  );

  const semAlteracaoItens = _.isEqual(values.itens, formInitialValues?.itens);

  const acervoSolicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;
  const ehUsuarioExterno =
    form.getFieldsValue(true)?.dadosSolicitante?.tipoId != TipoUsuario.CORESSO;

  const validarSituacaoLinha = (situacaoId: number) => {
    switch (situacaoId) {
      case SituacaoSolicitacaoItemEnum.CANCELADO:
        return true;

      default:
        return false;
    }
  };

  const validarSeEhBibliografico = (tipoAcervo?: TipoAcervo) =>
    tipoAcervo === TipoAcervo.Bibliografico ?? false;

  const columns: ColumnsType<AcervoSolicitacaoItemDetalheResumidoDTO> = [
    {
      title: 'N° do tombo/código',
      dataIndex: 'codigo',
      width: '10%',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
    },
    {
      title: 'Situação',
      dataIndex: 'situacaoId',
      width: '15%',
      render: (situacaoId: SituacaoSolicitacaoItemEnum) =>
        SituacaoSolicitacaoItemEnumDisplay[situacaoId],
    },
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
      width: '10%',
      render: (tipoAtendimento: TipoAtendimentoEnum) => TipoAtendimentoEnumDisplay[tipoAtendimento],
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      width: '10%',
      render: (dataVisita) => formatarDataPorFormato(dataVisita, 'DD/MM/YYYY HH:mm'),
    },
  ];

  if (temBibliografico) {
    columns.push(
      {
        title: 'Data do empréstimo',
        dataIndex: 'dataEmprestimo',
        width: '10%',
        render: (dataEmprestimo, linha) =>
          validarSeEhBibliografico(linha.tipoAcervoId) && formatarDataParaDDMMYYYY(dataEmprestimo),
      },
      {
        title: 'Data da devolução',
        dataIndex: 'dataDevolucao',
        width: '10%',
        render: (dataDevolucao, linha) =>
          validarSeEhBibliografico(linha.tipoAcervoId) && formatarDataParaDDMMYYYY(dataDevolucao),
      },
    );
  }

  columns.push({
    title: 'Ações',
    align: 'center',
    width: '10%',
    render: (_, linha, index: number) => {
      return (
        <Row wrap={false} gutter={[8, 8]}>
          <Col>
            <ButtonSecundary
              icon={<FaEdit />}
              size='small'
              id={`${CDEP_BUTTON_EDITAR}_${index}`}
              onClick={() => {
                setInitialValuesModal(linha);
                setIsModalOpen(true);
              }}
              disabled={linha.situacaoId && validarSituacaoLinha(linha.situacaoId)}
            >
              Editar
            </ButtonSecundary>
          </Col>

          {linha.id ? (
            <Col>
              <ButtonSecundary
                icon={<StopOutlined />}
                size='small'
                id={`${CDEP_BUTTON_REMOVER_ACERVO}_${index}`}
                onClick={() => {
                  onClickCancelarItemAtendimento(linha.id);
                }}
                disabled={linha.situacaoId && validarSituacaoLinha(linha.situacaoId)}
              >
                Cancelar item
              </ButtonSecundary>
            </Col>
          ) : (
            <Col>
              <ButtonSecundary
                size='small'
                icon={<FaTrashAlt />}
                id={`${CDEP_BUTTON_REMOVER_ACERVO}_${index}`}
                onClick={() => {
                  confirmacao({
                    content: DESEJA_REMOVER_ACERVO,
                    onOk() {
                      removerAcervo(index);
                    },
                  });
                }}
              >
                Remover item
              </ButtonSecundary>
            </Col>
          )}
        </Row>
      );
    },
  });

  const carregarDados = useCallback(async () => {
    const resposta = await acervoSolicitacaoService.obterDetalhesParaAtendimentoSolicitacoesPorId(
      acervoSolicitacaoId,
    );

    if (resposta.sucesso) {
      if (resposta.dados.situacaoId === SituacaoSolicitacaoItemEnum.CANCELADO) {
        navigate(ROUTES.ATENDIMENTO_SOLICITACOES);
        notification.success({
          message: 'Sucesso',
          description: 'Atendimento cancelado com sucesso',
        });

        return;
      }

      const dadosSolicitante = resposta.dados.dadosSolicitante;
      dadosSolicitante.telefone = dadosSolicitante?.telefone
        ? maskTelefone(dadosSolicitante.telefone)
        : '';

      const dataSolicitacao = resposta.dados.dataSolicitacao
        ? dayjs(resposta.dados.dataSolicitacao)
        : '';

      const dadosMapeadosItens: AcervoSolicitacaoItemDetalheResumidoDTO[] =
        resposta.dados.itens.map((item) => {
          if (item.dataVisitaFormatada) {
            item.horaVisita = item.dataVisitaFormatada.split(' ')[1];
          }

          form.setFieldValue('horaVisita', item.horaVisita);
          return { ...item };
        });

      const dadosMapeados: AcervoSolicitacaoDetalheDTO = {
        ...resposta.dados,
        dadosSolicitante,
        dataSolicitacao,
        itens: dadosMapeadosItens,
      };

      setFormInitialValues(dadosMapeados);
      setDataSource(dadosMapeadosItens);
    }
  }, [acervoSolicitacaoId]);

  useEffect(() => {
    if (acervoSolicitacaoId) {
      carregarDados();
    }
  }, [carregarDados, acervoSolicitacaoId]);

  const removerAcervo = (index: number) => {
    const values = form.getFieldsValue(true);

    const acervos = [...values.itens];
    acervos.splice(index, 1);
    form.setFieldValue('itens', acervos);
  };

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
          form.resetFields();
        },
      });
    }
  };

  const onClickCancelarItemAtendimento = async (acervoSolicitacaoItemId: number) => {
    confirmacao({
      content: DESEJA_CANCELAR_ITEM,
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

  const onClickConfirmarAtendimento = async () => {
    if (form.isFieldsTouched() || !semAlteracaoItens) {
      form.validateFields().then(async () => {
        const dataSolicitacao = cloneDeep(values?.dataSolicitacao);

        const endpoint = acervoSolicitacaoId
          ? acervoSolicitacaoService.alterarAtendimentoManual
          : acervoSolicitacaoService.confirmarAtendimentoManual;

        const itens: AcervoSolicitacaoItemManualDTO[] = values.itens.map(
          (item: AcervoSolicitacaoItemDetalheResumidoDTO): AcervoSolicitacaoItemManualDTO => {
            const linha: AcervoSolicitacaoItemManualDTO = {
              acervoId: item.acervoId,
              tipoAcervo: item.tipoAcervoId,
              tipoAtendimento: item.tipoAtendimento,
            };

            if (item.id) {
              linha.id = item.id;
            }

            if (item.dataVisita) {
              linha.dataVisita = item.dataVisita;
            }

            if (item.dataEmprestimo) {
              linha.dataEmprestimo = item.dataEmprestimo;
            }

            if (item.dataDevolucao) {
              linha.dataDevolucao = item.dataDevolucao;
            }

            return linha;
          },
        );

        const params: AcervoSolicitacaoManualDTO = {
          usuarioId: values?.dadosSolicitante?.id,
          dataSolicitacao: dayjs(dataSolicitacao).format('YYYY-MM-DD'),
          itens,
        };

        if (acervoSolicitacaoId) {
          params.id = acervoSolicitacaoId;
        }

        endpoint(params).then((resposta) => {
          if (resposta.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: 'Atendimento confirmado com sucesso',
            });

            if (!acervoSolicitacaoId) {
              const newId = resposta.dados;
              navigate(`${ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL}/${newId}`);
            }

            carregarDados();
          }
        });
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
        disabled={desabilitarCampos}
      >
        <HeaderPage title='Atendimento de Solicitações'>
          <Col span={24}>
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => {
                const temItens = values?.itens?.length;
                const temItemSemId = values?.itens?.find(
                  (item: AcervoSolicitacaoItemDetalheResumidoDTO) => item?.id < 1,
                );

                const desabilitarConfirmar =
                  (!form.isFieldsTouched() && semAlteracaoItens) || !temItens;

                return (
                  <Row gutter={[8, 8]}>
                    <Col>
                      <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
                    </Col>

                    <Col>
                      <ButtonSecundary
                        id={CDEP_BUTTON_CANCELAR}
                        onClick={() => onClickCancelar()}
                        disabled={!form.isFieldsTouched()}
                      >
                        Cancelar
                      </ButtonSecundary>
                    </Col>
                    <Col>
                      <ButtonSecundary
                        id={CDEP_BUTTON_FINALIZAR}
                        style={{ fontWeight: 700 }}
                        disabled={
                          !temItens || !!temItemSemId || desabilitarCampos || !desabilitarConfirmar
                        }
                        onClick={onClickFinalizarAtendimento}
                      >
                        Finalizar
                      </ButtonSecundary>
                    </Col>
                    <Col>
                      <ButtonPrimary
                        id={CDEP_BUTTON_CONFIRMAR}
                        onClick={onClickConfirmarAtendimento}
                        disabled={desabilitarConfirmar}
                      >
                        Confirmar
                      </ButtonPrimary>
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
                <InputRfCpf inputProps={{ disabled: !!acervoSolicitacaoId }} />
              </Col>

              <Col xs={24} md={16}>
                <Form.Item label='Nome do solicitante' name={['dadosSolicitante', 'nome']}>
                  <Input type='text' placeholder='Nome do solicitante' disabled />
                </Form.Item>
              </Col>

              {ehUsuarioExterno && (
                <Col xs={24} md={12}>
                  <Form.Item label='Telefone' name={['dadosSolicitante', 'telefone']}>
                    <Input type='text' placeholder='Telefone' disabled />
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} md={12}>
                <Form.Item label='E-mail' name={['dadosSolicitante', 'email']}>
                  <Input type='text' placeholder='E-mail' disabled />
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
                  <DatePicker
                    style={{ width: '100%' }}
                    format='DD/MM/YYYY'
                    placeholder='Selecione uma data'
                    locale={localeDatePicker}
                    disabled={!nome || !rfCpfWatch || desabilitarCampos}
                    maxDate={maxDate}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Row justify='end'>
                <Col>
                  <ButtonPrimary
                    id={CDEP_BUTTON_ADICIONAR_ACERVOS}
                    onClick={() => {
                      setInitialValuesModal(undefined);
                      setIsModalOpen(true);
                    }}
                    disabled={!nome || !rfCpfWatch || desabilitarCampos}
                  >
                    Adicionar acervos
                  </ButtonPrimary>
                </Col>
              </Row>
            </Col>

            <ModalAdicionarAcervo
              isModalOpen={isModalOpen}
              formSolicitacaoManual={form}
              setIsModalOpen={setIsModalOpen}
              initialValuesModal={initialValuesModal}
            />

            <Col xs={24}>
              <Form.Item shouldUpdate>
                {() => {
                  const listData: AcervoSolicitacaoItemDetalheResumidoDTO[] = values.itens?.length
                    ? values.itens
                    : [];

                  return (
                    <DataTable
                      columns={columns}
                      dataSource={listData}
                      showOrderButton={false}
                      pagination={false}
                    />
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
        </CardContent>
      </Form>
    </Col>
  );
};
