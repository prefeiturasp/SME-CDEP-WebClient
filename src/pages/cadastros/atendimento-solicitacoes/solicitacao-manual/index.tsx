import { Button, Col, DatePicker, Form, Input, Row, Tooltip, notification } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import {
  CDEP_BUTTON_ADICIONAR_ACERVOS,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_CANCELAR_ATENDIMENTO,
  CDEP_BUTTON_CONFIRMAR,
  CDEP_BUTTON_EDITAR,
  CDEP_BUTTON_FINALIZAR,
  CDEP_BUTTON_REMOVER_ACERVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ATENDIMENTO,
  DESEJA_FINALIZAR_ATENDIMENTO,
  DESEJA_SAIR_MODO_EDICAO,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { AcervoSolicitacaoManualConfirmarDTO } from '~/core/dto/acervo-solicitacao-manual-confirmar-dto';
import {
  AcervoSolicitacaoManualDTO,
  AcervoSolicitacaoManualItemDTO,
} from '~/core/dto/acervo-solicitacao-manual-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoAtendimentoEnumDisplay } from '~/core/enum/tipo-atendimento-enum';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { formatarDataParaDDMMYYYY } from '~/core/utils/functions';
import ModalAdicionarAcervo from './components/modal-adicionar-acervo';
import { InputRfCpf } from './components/rf-cpf';

export const SolicitacaoManual: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const dispatch = useAppDispatch();
  const nome = Form.useWatch('nome', form);
  const rfCpfWatch = Form.useWatch('rfCpf', form)?.length;

  const solicitacao = useAppSelector((state) => state.solicitacao);
  const [acervoSolicitacaoId, setAcervoSolicitacaoId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoManualDTO[]>([]);
  const [initialValuesModal, setInitialValuesModal] = useState<AcervoSolicitacaoManualDTO | null>(
    null,
  );

  const solicitacaoId = params?.id || 0;

  const columns: ColumnsType<AcervoSolicitacaoManualDTO> = [
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
      dataIndex: 'situacao',
      width: '15%',
    },
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
      width: '10%',
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      width: '10%',
      render: (value) => {
        return formatarDataParaDDMMYYYY(value);
      },
    },
    {
      title: 'Ações',
      align: 'center',
      width: '10%',
      render: (_, linha, index: number) => {
        return (
          <Row>
            <Col xs={12} md={10}>
              <Tooltip title='Editar acervo'>
                <Button type='text'>
                  <FaEdit
                    cursor='pointer'
                    fontSize={16}
                    id={CDEP_BUTTON_EDITAR}
                    onClick={() => {
                      setInitialValuesModal(linha);
                      setIsModalOpen(true);
                    }}
                  />
                </Button>
              </Tooltip>
            </Col>
            {!linha.id && (
              <Col xs={12} md={10}>
                <Tooltip title='Remover acervo'>
                  <Button type='text'>
                    <FaTrashAlt
                      cursor='pointer'
                      fontSize={16}
                      id={`${CDEP_BUTTON_REMOVER_ACERVO}_${index}`}
                      onClick={() => {
                        removerAcervo(index, linha);
                      }}
                    />
                  </Button>
                </Tooltip>
              </Col>
            )}
          </Row>
        );
      },
    },
  ];

  const carregarDados = () => {
    acervoSolicitacaoService
      .obterDetalhesAcervoSolicitacaoManual(acervoSolicitacaoId)
      .then((resposta) => {
        const dados = resposta?.dados;
        const dadosSolicitante = dados?.dadosSolicitante;

        const novoItem = dados.itens.map((item) => {
          return {
            ...item,
            tipoAtendimento: TipoAtendimentoEnumDisplay[item.tipoAtendimento],
          };
        });

        setDataSource(novoItem);
        form.setFieldsValue({
          rfCpf: dados.responsavelRf,
          nome: dadosSolicitante.nome,
          telefone: dadosSolicitante.telefone,
          email: dadosSolicitante.email,
          endereco: dadosSolicitante.endereco,
          dataSolicitacao: dayjs(dados?.dataSolicitacao),
        });
      });
  };

  const removerAcervo = (index: number, linha: AcervoSolicitacaoManualDTO) => {
    const acervos = [...dataSource];
    acervos.splice(index, 1);
    setDataSource(acervos);

    const acervosSelecionados = [...solicitacao.acervosSelecionados];

    const novaListaAcervosSelecionados = acervosSelecionados.filter(
      (acervoId) => acervoId !== linha?.id,
    );

    dispatch(setAcervosSelecionados(novaListaAcervosSelecionados));
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
          setDataSource([]);
        },
      });
    }
  };

  const onClickCancelarAtendimento = async () => {
    confirmacao({
      content: DESEJA_CANCELAR_ATENDIMENTO,
      onOk() {
        // acervoSolicitacaoService.cancelarAtendimento(acervoSolicitacaoId).then((resposta) => {
        //   if (resposta.sucesso) {
        //     navigate(ROUTES.ATENDIMENTO_SOLICITACOES);
        //     notification.success({
        //       message: 'Sucesso',
        //       description: 'Atendimento cancelado com sucesso',
        //     });
        //   }
        // });
      },
    });
  };

  useEffect(() => {
    if (acervoSolicitacaoId) {
      carregarDados();
    }
  }, [acervoSolicitacaoId]);

  const onClickConfirmarAtendimento = async () => {
    if (form.isFieldsTouched()) {
      form.validateFields().then(async () => {
        const dataSolicitacao = form.getFieldValue('dataSolicitacao');

        const valoresParaSalvar: AcervoSolicitacaoManualItemDTO[] = dataSource.map((item) => {
          return {
            id: item.id,
            acervoId: item.acervoId,
            tipoAtendimento: item.tipoAtendimentoId,
            situacao: item.situacaoId,
            dataVisita: item.dataVisita || null,
          };
        });

        const params: AcervoSolicitacaoManualConfirmarDTO = {
          usuarioId,
          dataSolicitacao,
          itens: cloneDeep(valoresParaSalvar),
        };

        if (solicitacaoId) {
          acervoSolicitacaoService.alterarAtendimentoManual(params).then((resposta) => {
            setAcervoSolicitacaoId(resposta.dados);
            navigate(`${ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL}/${resposta.dados}`);
            notification.success({
              message: 'Sucesso',
              description: 'Atendimento confirmado com sucesso',
            });
            form.resetFields();
          });
        } else {
          acervoSolicitacaoService.confirmarAtendimentoManual(params).then((resposta) => {
            setAcervoSolicitacaoId(resposta.dados);
            navigate(`${ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL}/${resposta.dados}`);
            notification.success({
              message: 'Sucesso',
              description: 'Atendimento confirmado com sucesso',
            });
            form.resetFields();
          });
        }
      });
    }
  };

  const onClickFinalizarAtendimento = () => {
    confirmacao({
      content: DESEJA_FINALIZAR_ATENDIMENTO,
      onOk() {
        // acervoSolicitacaoService.finalizarAtendimento(acervoSolicitacaoId).then((resposta) => {
        //   if (resposta.sucesso) {
        //     navigate(ROUTES.ATENDIMENTO_SOLICITACOES);
        //     notification.success({
        //       message: 'Sucesso',
        //       description: 'Atendimento finalizado com sucesso',
        //     });
        //   }
        // });
      },
    });
  };

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
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
                  // disabled={podeCancelarAtendimento()}
                  onClick={onClickCancelarAtendimento}
                >
                  Cancelar solicitação
                </Button>
              </Col>
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <ButtonPrimary
                      id={CDEP_BUTTON_CONFIRMAR}
                      onClick={onClickConfirmarAtendimento}
                      disabled={!form.isFieldsTouched()}
                    >
                      Confirmar
                    </ButtonPrimary>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col xs={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={8}>
                <InputRfCpf setUsuarioId={setUsuarioId} />
              </Col>

              <Col xs={24} md={16}>
                <Form.Item label='Nome do solicitante' name='nome'>
                  <Input type='text' placeholder='Nome do solicitante' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label='Telefone' name='telefone'>
                  <Input type='text' placeholder='Telefone' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label='E-mail' name='email'>
                  <Input type='text' placeholder='E-mail' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={16}>
                <Form.Item label='Endereço' name='endereco'>
                  <Input type='text' placeholder='Endereço' disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label='Data da solicitação' name='dataSolicitacao'>
                  <DatePicker
                    style={{ width: '100%' }}
                    format='DD/MM/YYYY'
                    placeholder='Selecione uma data'
                    locale={localeDatePicker}
                    disabled={!nome || !rfCpfWatch}
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
                      setInitialValuesModal(null);
                      setIsModalOpen(true);
                    }}
                    disabled={!nome || !rfCpfWatch}
                  >
                    Adicionar acervos
                  </ButtonPrimary>
                </Col>
              </Row>
            </Col>

            <ModalAdicionarAcervo
              dataSource={dataSource}
              isModalOpen={isModalOpen}
              setDataSource={setDataSource}
              setIsModalOpen={setIsModalOpen}
              initialValuesModal={initialValuesModal}
            />

            <Col xs={24}>
              <Form.Item shouldUpdate>
                {() => {
                  return (
                    <DataTable columns={columns} dataSource={dataSource} showOrderButton={false} />
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
