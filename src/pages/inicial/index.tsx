import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { dayjs } from '~/core/date/dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
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
      render: (dataCriacao: string) => (dataCriacao ? dayjs(dataCriacao).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Data da visita',
      dataIndex: 'dataVisita',
      render: (dataVisita: string) => (dataVisita ? dayjs(dataVisita).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
  ];

  const onClickEditar = (row: MinhaSolicitacaoDTO) =>
    navigate(`${ROUTES.SOLICITACAO}/${row.acervoSolicitacaoId}`);

  return (
    <Col>
      <HeaderPage title='Minhas solicitações' />
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
