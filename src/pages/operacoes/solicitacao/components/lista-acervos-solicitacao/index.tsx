import { Col, Row, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from '~/components/lib/button/primary';
import { CDEP_BUTTON_ADICIONAR_ACERVOS } from '~/core/constants/ids/button/intex';
import { AcervoSolicitacaoItemRetornoDTO } from '~/core/dto/acervo-solicitacao-item-retorno-dto';
import { ROUTES } from '~/core/enum/routes';
import { useAppSelector } from '~/core/hooks/use-redux';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { AcervoSolicitacaoContext } from '../../provider';

const columns: ColumnsType<AcervoSolicitacaoItemRetornoDTO> = [
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
];

const ListaAcervosSolicitacao: React.FC = () => {
  const navigate = useNavigate();

  const solicitacao = useAppSelector((state) => state.solicitacao);

  const { setDataSource, dataSource } = useContext(AcervoSolicitacaoContext);

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

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Row justify='end'>
          <Col>
            <ButtonPrimary
              id={CDEP_BUTTON_ADICIONAR_ACERVOS}
              onClick={() => onClickAdicionarAcervos()}
            >
              Adicionar acervos
            </ButtonPrimary>
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Table
          pagination={false}
          rowKey='acervoId'
          columns={columns}
          dataSource={dataSource}
          bordered
          locale={{ emptyText: 'Sem dados' }}
          size='small'
        />
      </Col>
    </Row>
  );
};

export default ListaAcervosSolicitacao;
