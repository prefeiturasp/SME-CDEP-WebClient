import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from '~/components/lib/button/primary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_NOVA_SOLICITACAO } from '~/core/constants/ids/button/intex';
import { URL_API_ACERVO_SOLICITACAO } from '~/core/constants/urls-api';
import { MinhaSolicitacaoDTO } from '~/core/dto/minha-solicitacao-dto';
import { ROUTES } from '~/core/enum/routes';

const Inicial: React.FC = () => {
  const navigate = useNavigate();

  const columns: ColumnsType<MinhaSolicitacaoDTO> = [
    {
      title: 'Número da solicitação',
      dataIndex: 'acervoSolicitacaoId',
    },
    {
      title: 'Tipo de acervo',
      dataIndex: 'tipoAcervo',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
    },
    {
      title: 'Data da solicitação',
      dataIndex: 'dataCriacao',
      render: (dataCriacao: string) => (dataCriacao ? dataCriacao : ''),
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      render: (dataVisita: string) => (dataVisita ? dataVisita : ''),
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
  ];

  const onClickEditar = (row: MinhaSolicitacaoDTO) =>
    navigate(`${ROUTES.SOLICITACAO}/${row.acervoSolicitacaoId}`);

  const novaSolicitacao = () => navigate(`${ROUTES.SOLICITACAO}`);

  return (
    <Col>
      <HeaderPage title='Minhas solicitações'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonPrimary onClick={() => novaSolicitacao()} id={CDEP_BUTTON_NOVA_SOLICITACAO}>
                Nova Solicitação
              </ButtonPrimary>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <DataTable
              showOrderButton={false}
              url={`${URL_API_ACERVO_SOLICITACAO}/minhas-solicitacoes`}
              columns={columns}
              onRow={(row) => ({
                onClick: () => {
                  onClickEditar(row);
                },
              })}
            />
          </Col>
        </Row>
      </CardContent>
    </Col>
  );
};

export default Inicial;
