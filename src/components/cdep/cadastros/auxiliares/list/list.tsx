import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BreadcrumbCDEPProps } from '~/components/cdep/breadcrumb';
import ButtonVoltar from '~/components/cdep/button/voltar';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_NOVO, CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CadastroAuxiliarDTO } from '~/core/dto/cadastro-auxiliar-dto';
import { ROUTES } from '~/core/enum/routes';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

export type ListPageProps = {
  title: string;
  urlApiBase: string;
};

export type ListConfigCadastrosAuxiliaresProps = {
  breadcrumb: BreadcrumbCDEPProps;
  page: ListPageProps;
};

const ListCadastrosAuxiliares: React.FC<ListConfigCadastrosAuxiliaresProps> = ({
  page,
  breadcrumb,
}) => {
  const navigate = useNavigate();

  const { permissao } = useContext(PermissaoContext);

  const [filters, setFilters] = useState({ nome: '' });

  const columns: ColumnsType<CadastroAuxiliarDTO> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickNovo = () => {
    if (permissao.podeIncluir) navigate(`${breadcrumb.urlMainPage}/novo`);
  };

  const onClickEditar = (id: number) =>
    navigate(`${breadcrumb.urlMainPage}/editar/${id}`, { replace: true });

  return (
    <Col>
      <HeaderPage title={page.title}>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CDEP_BUTTON_NOVO}
                style={{ fontWeight: 700 }}
                onClick={() => onClickNovo()}
                disabled={!permissao.podeIncluir}
              >
                Novo
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Row gutter={[8, 16]}>
          <Col span={24}>
            <Input
              type='text'
              placeholder='Nome'
              prefix={<SearchOutlined />}
              onChange={(e: any) => {
                setFilters({ nome: e.target.value });
              }}
            />
          </Col>

          <Col span={24}>
            <DataTable
              filters={filters}
              url={page.urlApiBase}
              columns={columns}
              onRow={(row) => ({
                onClick: () => {
                  onClickEditar(row.id);
                },
              })}
            />
          </Col>
        </Row>
      </CardContent>
    </Col>
  );
};

export default ListCadastrosAuxiliares;
