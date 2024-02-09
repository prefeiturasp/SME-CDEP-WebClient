import { Button, Col, DatePicker, Row, Tag, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaChevronDown,
  FaChevronUp,
  FaFileDownload,
  FaTrashAlt,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ButtonPrimary from '~/components/lib/button/primary';
import {
  CDEP_BUTTON_ADICIONAR_ACERVOS,
  CDEP_BUTTON_DOWNLOAD_ARQUIVO,
  CDEP_BUTTON_EXPANDIR_LINHA,
  CDEP_BUTTON_REMOVER_ACERVO,
} from '~/core/constants/ids/button/intex';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '~/core/dto/acervo-solicitacao-item-retorno-cadastro-dto';
import { ArquivoCodigoNomeDTO } from '~/core/dto/arquivo-codigo-nome-dto';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import armazenamentoService from '~/core/services/armazenamento-service';
import { downloadBlob } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { AcervoSolicitacaoContext } from '../../provider';
import dayjs, { Dayjs } from 'dayjs';

const ContainerExpandedTable = styled.div`
  .ant-table-tbody tr.ant-table-expanded-row td {
    cursor: default !important;
    .ant-table {
      :first-child {
        margin: 15px !important;
      }

      .ant-table-container {
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
      }
    }
  }
`;

const ListaAcervosSolicitacao: React.FC = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const dispatch = useAppDispatch();
  const [dataVisitasEditaveis, setDataVisitasEditaveis] = useState<{ [key: number]: string | null }>({});

  const solicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const solicitacao = useAppSelector((state) => state.solicitacao);

  const { setDataSource, dataSource } = useContext(AcervoSolicitacaoContext);
  const { permissao } = useContext(PermissaoContext);

  const [expandedRowKey, setExpandedRowKey] = useState<number>(0);

  const temArquivos: boolean = useMemo(
    () => !!dataSource?.find((item) => !!item?.arquivos?.length),
    [dataSource],
  );

  const onClickAdicionarAcervos = () => {
    navigate(ROUTES.CONSULTA_ACERVO);
  };

  const obterDados = useCallback(async () => {
    const resposta = await acervoSolicitacaoService.obterItensDoAcervoPorFiltros(
      solicitacao.acervosSelecionados,
    );

    if (resposta.sucesso) {
      setDataSource(resposta.dados);
    } else {
      setDataSource([]);
    }
  }, [setDataSource, solicitacao]);

  useEffect(() => {
    if (solicitacao?.acervosSelecionados?.length) {
      obterDados();
    }
  }, [solicitacao, obterDados]);

  const obterDadosPorId = useCallback(async () => {
    const resposta = await acervoSolicitacaoService.obterPorId(solicitacaoId);

    if (resposta.sucesso) {
      setDataSource(resposta.dados);
    } else {
      setDataSource([]);
    }
  }, [setDataSource, solicitacaoId]);

  useEffect(() => {
    if (solicitacaoId && !solicitacao?.acervosSelecionados?.length) {
      obterDadosPorId();
    }
  }, [solicitacao, obterDadosPorId, solicitacaoId]);

  const buttonDownload = (arquivo: ArquivoCodigoNomeDTO) => (
    <ButtonPrimary
      id={CDEP_BUTTON_DOWNLOAD_ARQUIVO}
      icon={<FaFileDownload />}
      style={{ display: 'flex', alignItems: 'center', gap: 3 }}
      onClick={() => {
        onClickDownload(arquivo);
      }}
    >
      Download arquivo
    </ButtonPrimary>
  );

  const onClickExpandir = (
    expandir: boolean,
    linha: AcervoSolicitacaoItemRetornoCadastroDTO,
    qtdAquivos: number,
  ) => {
    if (qtdAquivos > 1 && expandir) {
      setExpandedRowKey(linha.acervoId);
    } else {
      setExpandedRowKey(0);
    }
  };

  const columns: ColumnsType<AcervoSolicitacaoItemRetornoCadastroDTO> = [
    {
      title: 'Tipo de acervo',
      dataIndex: 'tipoAcervo',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      render: (titulo: string) => <div style={{ wordBreak: 'break-word' }}>{titulo}</div>,
    },
    {
      title: 'Autor/Crédito',
      dataIndex: 'autoresCreditos',
      render: (autoresCreditos: string[]) => {
        if (!autoresCreditos?.length) return <></>;

        return (
          <Col>
            <Row gutter={[8, 8]}>
              {autoresCreditos.map((item, i) => (
                <Tag key={i}>{item}</Tag>
              ))}
            </Row>
          </Col>
        );
      },
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
    ...(temArquivos
      ? [
          {
            title: 'Anexo',
            dataIndex: 'anexo',
            render: (_:any, linha: AcervoSolicitacaoItemRetornoCadastroDTO, index: number) => {
              const qtdAquivos = linha?.arquivos?.length || 0;
  
              if (!qtdAquivos) return <>Sem anexo</>;
  
              if (qtdAquivos > 1) {
                const expandido = expandedRowKey === linha?.acervoId;
  
                let icone = expandido ? <FaArrowUp /> : <FaArrowDown />;
                if (qtdAquivos && qtdAquivos > 1) {
                  icone = expandido ? <FaChevronUp /> : <FaChevronDown />;
                }
  
                return (
                  <ButtonPrimary
                    id={`${CDEP_BUTTON_EXPANDIR_LINHA}_${index}`}
                    icon={icone}
                    style={{ display: 'flex', alignItems: 'center', gap: 3 }}
                    onClick={() => {
                      onClickExpandir(!expandido, linha, qtdAquivos);
                    }}
                  >
                    Expandir arquivos
                  </ButtonPrimary>
                );
              }
  
              const arquivo = linha?.arquivos?.[0]?.codigo ? linha.arquivos[0] : null;
  
              if (!arquivo) return <></>;
  
              return buttonDownload(arquivo);
            },
          },
        ]
      : []),
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
    },
    {
      title: 'Data de visita',
      dataIndex: 'dataVisita',
      render: (dataVisita: string, linha: AcervoSolicitacaoItemRetornoCadastroDTO) => {
        const isEditable = linha.alteraDataVisita === true;
  
        return isEditable ? (
          <DatePicker
            value={dataVisitasEditaveis[linha.acervoId] ? dayjs(dataVisitasEditaveis[linha.acervoId], 'DD-MM-YYYY') : dayjs(null, 'DD-MM-YYYY')}
            onChange={(date:any) => handleDataVisitaChange(date, linha)}
            format="DD-MM-YYYY" 
          />
        ) : (
          dataVisita
        );
      },
    },
    {
      title: 'Ações',
      dataIndex: 'acoes',
      render: (_, linha: AcervoSolicitacaoItemRetornoCadastroDTO) => (
        <ButtonPrimary
          id={CDEP_BUTTON_ADICIONAR_ACERVOS}
          onClick={() => onClickSalvarDataVisita(linha)}
          disabled={!dataVisitasEditaveis[linha.acervoId]}
        >
          Confirmar
        </ButtonPrimary>
      ),
    },
  ];

  const handleDataVisitaChange = (date: Dayjs | null, linha: AcervoSolicitacaoItemRetornoCadastroDTO) => {
    setDataVisitasEditaveis((prevDataVisitas) => ({
      ...prevDataVisitas,
      [linha.acervoId]: date ? date.format() : null,
    }));
  };

  const onClickSalvarDataVisita = (linha: AcervoSolicitacaoItemRetornoCadastroDTO) => {
    const dataVisitaEditavel = dataVisitasEditaveis[linha.acervoId];
    if (dataVisitaEditavel) {
      acervoSolicitacaoService.alterarDataVisitaAcervo({
        id: linha.id,
        dataVisita: dataVisitaEditavel
      })
      .then(()=>obterDadosPorId())
      setDataVisitasEditaveis((prevDataVisitas) => {
        const newDataVisitas = { ...prevDataVisitas };
        delete newDataVisitas[linha.acervoId];
        return newDataVisitas;
      });
    }
  };

  const removerAcervo = (index: number, linha: AcervoSolicitacaoItemRetornoCadastroDTO) => {
    const acervos = [...dataSource];
    acervos.splice(index, 1);
    setDataSource(acervos);

    const acervosSelecionados = [...solicitacao.acervosSelecionados];

    const novaListaAcervosSelecionados = acervosSelecionados.filter(
      (acervoId) => acervoId !== linha?.acervoId,
    );

    dispatch(setAcervosSelecionados(novaListaAcervosSelecionados));
  };

  if (!solicitacaoId) {
    columns.push({
      title: 'Ações',
      align: 'center',
      width: '100px',
      render: (_, linha, index: number) => (
        <Tooltip title='Remover acervo'>
          <Button type='text' disabled={permissao.somenteConsulta}>
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
      ),
    });
  }
  const onClickDownload = (arquivo: ArquivoCodigoNomeDTO) => {
    armazenamentoService.obterArquivoParaDownload(arquivo?.codigo).then((resposta) => {
      downloadBlob(resposta.data, arquivo?.nome);
    });
  };

  const expandedRowRender = (linha: AcervoSolicitacaoItemRetornoCadastroDTO) => {
    const columnsArquivos: ColumnsType<ArquivoCodigoNomeDTO> = [
      { title: 'Nome', dataIndex: 'nome' },
      {
        title: 'Anexo',
        dataIndex: 'codigo',
        width: '5%',
        render: (_, arquivo: ArquivoCodigoNomeDTO) => buttonDownload(arquivo),
      },
    ];
    const arquivos = linha?.arquivos;

    return (
      <Table
        rowKey='codigo'
        columns={columnsArquivos}
        dataSource={arquivos}
        pagination={false}
        bordered
        locale={{ emptyText: 'Sem dados' }}
        size='small'
      />
    );
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Row justify='end'>
          <Col>
            <ButtonPrimary
              id={CDEP_BUTTON_ADICIONAR_ACERVOS}
              onClick={() => onClickAdicionarAcervos()}
              disabled={!permissao?.podeIncluir || !!solicitacaoId}
            >
              Adicionar acervos
            </ButtonPrimary>
          </Col>         
        </Row>
      </Col>
      <Col xs={24}>
        <ContainerExpandedTable>
          <Table
            pagination={false}
            bordered
            locale={{ emptyText: 'Sem dados' }}
            size='small'
            rowKey='acervoId'
            columns={columns}
            dataSource={dataSource}
            expandable={{
              expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
              showExpandColumn: false,
              expandedRowRender,
            }}
          />
        </ContainerExpandedTable>
      </Col>
    </Row>
  );
};

export default ListaAcervosSolicitacao;
