import { Button, Col, DatePicker, Form, Input, Row, Tooltip } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import 'dayjs/locale/pt-br';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import {
  CDEP_BUTTON_ADICIONAR_ACERVOS,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_EDITAR,
  CDEP_BUTTON_REMOVER_ACERVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { DESEJA_CANCELAR_ALTERACOES, DESEJA_SAIR_MODO_EDICAO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { AcervoSolicitacaoManualDTO } from '~/core/dto/acervo-solicitacao-manual-dto';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import { confirmacao } from '~/core/services/alerta-service';
import { formatarDataParaDDMMYYYY } from '~/core/utils/functions';
import ModalAdicionarAcervo from './components/modal-adicionar-acervo';
import { InputRfCpf } from './components/rf-cpf';

export const SolicitacaoManual: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const nome = Form.useWatch('nome', form);
  const rfCpfWatch = Form.useWatch('rfCpf', form)?.length;

  const solicitacao = useAppSelector((state) => state.solicitacao);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoManualDTO[]>([]);
  const [initialValuesModal, setInitialValuesModal] = useState<AcervoSolicitacaoManualDTO>();

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
      render: (_, linha, index: number) => (
        <Row align='middle'>
          <Col xs={12}>
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
          <Col xs={12}>
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
        </Row>
      ),
    },
  ];

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

  useEffect(() => {
    form.resetFields();
  }, [form]);

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
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col xs={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={8}>
                <InputRfCpf />
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
                      setInitialValuesModal(undefined);
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
              isModalOpen={isModalOpen}
              dataSource={dataSource}
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
