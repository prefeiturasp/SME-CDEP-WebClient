import { Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';

import SelectResponsaveis from '~/components/cdep/input/responsaveis';
import { SelectSituacaoAtendimento } from '~/components/cdep/input/situacao-atendimento';
import { SelectSituacaoEmprestimo } from '~/components/cdep/input/situacao-emprestimo';
import { RangePicker } from '~/components/cdep/range-picker';
import ButtonPrimary from '~/components/lib/button/primary';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_NOVA_SOLICITACAO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import { URL_API_ACERVO_SOLICITACAO } from '~/core/constants/urls-api';
import { SolicitacaoDTO } from '~/core/dto/solicitacao-dto';
import { ROUTES } from '~/core/enum/routes';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { InputRfCpfSolicitante } from './components/rf-cpf-solicitante';
import InputNumero from '~/components/lib/inputs/number';

export type FiltroSolicitacaoProps = {
  tipoAcervo: number | null;
  acervoSolicitacaoId: number | null;
  dataSolicitacaoInicio: string | null;
  dataSolicitacaoFim: string | null;
  dataVisitaInicio: string | null;
  dataVisitaFim: string | null;
  situacaoItem: number | null;
  responsavel: string | null;
  solicitanteRf: string | null;
  situacaoEmprestimo: string | null;
};

const DEFAULT_VALUES: FiltroSolicitacaoProps = {
  acervoSolicitacaoId: null,
  tipoAcervo: null,
  dataSolicitacaoInicio: null,
  dataSolicitacaoFim: null,
  dataVisitaInicio: null,
  dataVisitaFim: null,
  situacaoItem: null,
  responsavel: null,
  solicitanteRf: null,
  situacaoEmprestimo: null,
};

const columns: ColumnsType<SolicitacaoDTO> = [
  {
    title: 'N° da solicitação',
    dataIndex: 'acervoSolicitacaoId',
    align: 'center',
  },
  {
    title: 'Tipo de acervo',
    dataIndex: 'tipoAcervo',
    align: 'center',
  },
  {
    title: 'Título',
    dataIndex: 'titulo',
    align: 'center',
  },
  {
    title: 'Data da solicitação',
    dataIndex: 'dataCriacao',
    align: 'center',
    render: (dataCriacao: string) => dataCriacao,
  },
  {
    title: 'Solicitante',
    dataIndex: 'solicitante',
    align: 'center',
  },
  {
    title: 'Responsável pelo atendimento',
    dataIndex: 'responsavel',
    align: 'center',
  },
  {
    title: 'Data da visita',
    dataIndex: 'dataVisita',
    align: 'center',
    render: (dataVisita: string) => (dataVisita ? dataVisita : ''),
  },
  {
    title: 'Situação do Item',
    dataIndex: 'situacao',
    align: 'center',
  },
  {
    title: 'Situação do Empréstimo',
    dataIndex: 'situacaoEmprestimo',
    align: 'center',
  },
];

export const ListAtendimentoSolicitacoes: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const { permissao } = useContext(PermissaoContext);

  const [filters, setFilters] = useState<FiltroSolicitacaoProps>(DEFAULT_VALUES);

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      form.resetFields();
      setFilters(DEFAULT_VALUES);
    }
  };

  const obterFiltros = () => {
    setFilters({
      tipoAcervo: form.getFieldValue('tipoAcervo'),
      responsavel: form.getFieldValue('responsavel'),
      acervoSolicitacaoId: form.getFieldValue('acervoSolicitacaoId'),
      situacaoItem: form.getFieldValue('situacaoItem'),
      dataSolicitacaoInicio: form?.getFieldValue('dataSolicitacao')?.[0],
      dataSolicitacaoFim: form?.getFieldValue('dataSolicitacao')?.[1],
      dataVisitaInicio: form?.getFieldValue('dataVisita')?.[0],
      dataVisitaFim: form?.getFieldValue('dataVisita')?.[1],
      solicitanteRf: form?.getFieldValue('solicitanteRf'),
      situacaoEmprestimo: form?.getFieldValue('situacaoEmprestimo'),
    });
  };

  const onClickDetalheSolicitacao = (row: SolicitacaoDTO) =>
    navigate(`${ROUTES.ATENDIMENTO_SOLICITACOES}/${row.acervoSolicitacaoId}`, {
      replace: true,
    });

  return (
    <Col>
      <HeaderPage title='Atendimento de Solicitações'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                <ButtonSecundary
                  id={CDEP_BUTTON_CANCELAR}
                  onClick={() => onClickCancelar()}
                  disabled={!form.isFieldsTouched()}
                >
                  Cancelar
                </ButtonSecundary>
              </Form.Item>
            </Col>
            <Col>
              <ButtonPrimary
                id={CDEP_BUTTON_NOVA_SOLICITACAO}
                onClick={() => {
                  navigate(ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL);
                }}
                disabled={!permissao?.podeIncluir}
              >
                Nova solicitação
              </ButtonPrimary>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Form form={form} layout='vertical' autoComplete='off'>
          <Form.Item shouldUpdate>
            {() => (
              <Row gutter={[16, 8]}>
                <Col xs={24} md={8}>
                  <InputNumero
                    formItemProps={{
                      label: 'N° da solicitação',
                      name: 'acervoSolicitacaoId',
                      }}
                      inputProps={{ 
                        placeholder: 'N° da solicitação', 
                        id: CDEP_INPUT_NUMERO_SOLICITACAO,
                        maxLength: 18,
                        onChange: obterFiltros
                      }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <SelectTipoAcervo
                    formItemProps={{ name: 'tipoAcervo' }}
                    selectProps={{ onChange: obterFiltros }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <RangePicker
                    formItemProps={{
                      label: 'Data da solicitação',
                      name: 'dataSolicitacao',
                    }}
                    rangerPickerProps={{ onChange: obterFiltros }}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <RangePicker
                    formItemProps={{
                      label: 'Data da visita',
                      name: 'dataVisita',
                    }}
                    rangerPickerProps={{ onChange: obterFiltros }}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <SelectResponsaveis
                    formItemProps={{ name: 'responsavel' }}
                    selectProps={{ onChange: obterFiltros }}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <SelectSituacaoAtendimento selectProps={{ onChange: obterFiltros }} />
                </Col>

                <Col xs={24} md={8}>
                  <InputRfCpfSolicitante obterFiltros={obterFiltros} />
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label='Nome do solicitante' name='nomeSolicitante'>
                    <Input type='text' placeholder='Nome do solicitante' disabled />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <SelectSituacaoEmprestimo selectProps={{ onChange: obterFiltros }} />
                </Col>

                <Col xs={24}>
                  <DataTable
                    showOrderButton={false}
                    filters={filters}
                    url={`${URL_API_ACERVO_SOLICITACAO}/atendimento-solicitacoes`}
                    columns={columns}
                    onRow={(row) => ({
                      onClick: () => {
                        onClickDetalheSolicitacao(row);
                      },
                    })}
                  />
                </Col>
              </Row>
            )}
          </Form.Item>
        </Form>
      </CardContent>
    </Col>
  );
};
