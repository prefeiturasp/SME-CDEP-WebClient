import { Button, Col, Form, Input, Row, Space, Tag, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
  CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO,
  CDEP_BUTTON_DEVOLVER_ITEM,
  CDEP_BUTTON_EDITAR,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ATENDIMENTO,
  DESEJA_CANCELAR_ITEM_E_DESCARTAR_ITENS_NAO_CONFIRMADOS,
  DESEJA_DEVOLVER_ITEM,
  DESEJA_SAIR_MODO_EDICAO,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { AcervoSolicitacaoDetalheDTO } from '~/core/dto/acervo-solicitacao-detalhe-dto';
import { AcervoSolicitacaoItemDetalheResumidoDTO } from '~/core/dto/acervo-solicitacao-item-detalhe-resumido-dto';

import { FaEdit } from 'react-icons/fa';
import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { ROUTES } from '~/core/enum/routes';
import { SituacaoSolicitacaoEnum } from '~/core/enum/situacao-atendimento-enum';
import { SituacaoEmprestimoEnum } from '~/core/enum/situacao-emprestimo-enum';
import { SituacaoSolicitacaoItemEnum } from '~/core/enum/situacao-item-atendimento-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoAtendimentoEnum } from '~/core/enum/tipo-atendimento-enum';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { devolverEmprestimo } from '~/core/services/acervo-emprestimo';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import {
  formatarDataParaDDMMYYYY,
  formatarDataPorFormato,
  formatterCPFMask,
  maskTelefone,
} from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { configTagAcervoDisponibilidadeMap } from '../../solicitacao/components/lista-acervos-solicitacao/utils';
import { ModalAtendimento } from './components/modal-atendimento';

export const FormAtendimentoSolicitacoes: React.FC = () => {
  const [form] = useForm();

  const navigate = useNavigate();
  const paramsRoute = useParams();
  const { desabilitarCampos } = useContext(PermissaoContext);
  const perfilSelecionado = useAppSelector((state) => state.perfil.perfilSelecionado?.perfil);

  const [initialValuesModal, setInitialValuesModal] =
    useState<AcervoSolicitacaoItemDetalheResumidoDTO>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formInitialValues, setFormInitialValues] = useState<AcervoSolicitacaoDetalheDTO>();
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoItemDetalheResumidoDTO[]>([]);

  const ehAdminGeral = perfilSelecionado === TipoPerfil.ADMIN_GERAL;
  const temItemFinalizadoAutomaticamente = formInitialValues?.itens.find(
    (item) => item.situacaoId === SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE,
  );

  const temItemFinalizadoManualmente = formInitialValues?.itens.find(
    (item) => item.situacaoId === SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE,
  );

  const ehUsuarioExterno = formInitialValues?.dadosSolicitante.tipoId != TipoUsuario.CORESSO;
  const acervoSolicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const atendimentoFinalizado =
    formInitialValues?.situacaoId === SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO;

  const atendimentoTaCancelado =
    formInitialValues?.situacaoId === SituacaoSolicitacaoEnum.CANCELADO;

  const podeCancelarAtendimento = () => {
    if (!ehAdminGeral) return true;

    return !!(
      desabilitarCampos ||
      atendimentoTaCancelado ||
      temItemFinalizadoManualmente ||
      temItemFinalizadoAutomaticamente
    );
  };

  const validarSituacaoLinha = (situacaoId?: number) => {
    switch (situacaoId) {
      case SituacaoSolicitacaoItemEnum.CANCELADO:
      case SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE:
      case SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE:
        return true;

      default:
        return false;
    }
  };

  const validarSituacaoEmprestimoLinha = (situacaoId?: number) => {
    switch (situacaoId) {
      case SituacaoEmprestimoEnum.DEVOLVIDO:
      case SituacaoSolicitacaoItemEnum.CANCELADO:
        return true;

      default:
        return false;
    }
  };

  const validarSeEhBibliografico = (tipoAcervoId?: TipoAcervo) => {
    return tipoAcervoId === TipoAcervo.Bibliografico ?? false;
  };

  const temBibliografico: boolean = useMemo(
    () =>
      dataSource?.length
        ? !!dataSource?.find((item) => validarSeEhBibliografico(item?.tipoAcervoId))
        : false,
    [dataSource],
  );

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
          let config;
          const validarDisponibilidade = linha.temControleDisponibilidade && linha.estaDisponivel;

          if (validarDisponibilidade) {
            config =
              configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL];
          } else if (!validarDisponibilidade) {
            config = {};
          }

          return (
            <Col>
              <Row>
                <Typography.Text>{value}</Typography.Text>
                {validarSeEhBibliografico(linha.tipoAcervoId) && validarDisponibilidade && (
                  <Tag color={config?.bgColor}>
                    <Typography.Text
                      style={{
                        color: config?.labelColor,
                      }}
                    >
                      {linha.situacaoDisponibilidade}
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
      render: (value) => TipoAtendimentoEnum?.[value],
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      width: '10%',
      render: (value) => formatarDataPorFormato(value, 'DD/MM/YYYY HH:mm'),
    },
  ];

  if (temBibliografico) {
    columns.push(
      {
        title: 'Data do empréstimo',
        dataIndex: 'dataEmprestimo',
        width: '10%',
        render: (value) => formatarDataParaDDMMYYYY(value),
      },
      {
        title: 'Data da devolução',
        dataIndex: 'dataDevolucao',
        width: '10%',
        render: (value) => formatarDataParaDDMMYYYY(value),
      },
    );
  }

  columns.push({
    title: 'Ações',
    align: 'center',
    width: '10%',
    render: (_, linha: AcervoSolicitacaoItemDetalheResumidoDTO, index: number) => {
      const itemEstaFinalizadoManualmente =
        linha.situacaoId === SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE;
      const itemEstaCancelado = linha.situacaoId === SituacaoSolicitacaoItemEnum.CANCELADO;

      const itemDevolvido = linha.situacaoEmprestimo
        ? validarSituacaoEmprestimoLinha(linha.situacaoEmprestimo)
        : false;

      const esconderBotoes = itemDevolvido || itemEstaCancelado;

      const podeProrrogarDevolverItem =
        itemEstaFinalizadoManualmente && validarSeEhBibliografico(linha.tipoAcervoId);

      const btnEditar = () =>
        esconderBotoes ? (
          <></>
        ) : (
          <ButtonSecundary
            icon={<FaEdit />}
            size='small'
            id={`${CDEP_BUTTON_EDITAR}_${index}`}
            onClick={() => {
              setInitialValuesModal(linha);
              setIsModalOpen(true);
            }}
            disabled={desabilitarCampos}
          >
            {podeProrrogarDevolverItem ? 'Prorrogar' : 'Editar'}
          </ButtonSecundary>
        );

      return podeProrrogarDevolverItem ? (
        <Row wrap={false} justify='center'>
          <Space>
            {btnEditar()}
            {esconderBotoes ? (
              <></>
            ) : (
              <ButtonSecundary
                size='small'
                id={CDEP_BUTTON_DEVOLVER_ITEM}
                onClick={() => onClickDevolverEmprestimo(linha.id)}
                disabled={itemDevolvido}
              >
                Devolver item
              </ButtonSecundary>
            )}
          </Space>
        </Row>
      ) : (
        <Row wrap={false} justify='center'>
          <Space>
            {btnEditar()}
            {esconderBotoes ? (
              <></>
            ) : (
              <ButtonSecundary
                size='small'
                id={CDEP_BUTTON_CANCELAR_ITEM_SOLICITACAO}
                onClick={() => onClickCancelarItemAtendimento(linha.id)}
                disabled={
                  (linha.situacaoId && validarSituacaoLinha(linha.situacaoId)) ||
                  desabilitarCampos ||
                  atendimentoFinalizado
                }
              >
                Cancelar item
              </ButtonSecundary>
            )}
          </Space>
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

      const dadosMapeadosItens: AcervoSolicitacaoItemDetalheResumidoDTO[] = dadosMapeados.itens.map(
        (item) => {
          if (validarSeEhBibliografico(item.tipoAcervoId)) {
            item.tipoAtendimento = TipoAtendimentoEnum.Presencial;
          }

          return { ...item };
        },
      );

      setFormInitialValues(dadosMapeados);
      setDataSource(dadosMapeadosItens);
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

  const onClickDevolverEmprestimo = (id: number) => {
    confirmacao({
      content: DESEJA_DEVOLVER_ITEM,
      onOk: () => {
        devolverEmprestimo(id).then((resposta) => {
          if (resposta.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: 'Item devolvido com sucesso',
            });

            carregarDados();
          }
        });
      },
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

          <ModalAtendimento
            isModalOpen={isModalOpen}
            carregarDados={carregarDados}
            setIsModalOpen={setIsModalOpen}
            initialValuesModal={initialValuesModal}
            acervoSolicitacaoId={acervoSolicitacaoId}
            initialValuesAtendimento={formInitialValues}
          />
        </CardContent>
      </Form>
    </Col>
  );
};
