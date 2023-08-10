import { Button, Col, Row } from 'antd';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadcrumbCDEP from '~/components/cdep/breadcrumb';
import ButtonVoltar from '~/components/cdep/button/voltar';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_CADASTRAR, CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import CardTableCadastros from '../components/card-table';
import { ColumnsType } from 'antd/es/table';

const SerieColecao: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);
  const onClickNovo = () => navigate(ROUTES.SERIE_COLECAO_NOVO);
  const obterDados = useCallback(() => {
    dispatch(setSpinning(false));
  }, [dispatch]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);
  interface DataType {
    key: string;
    name: string;
  }
  const data: DataType[] = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      key: i.toString(),
      name: `Nome ${i}`,
    });
  }
  const columns: ColumnsType<DataType> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <>
      <BreadcrumbCDEP menu='Cadastros' paginaPai='Crédito' urlPaginaPai={ROUTES.CREDITO} />
      <HeaderPage title='Série/Coleção'>
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
                id={CDEP_BUTTON_CADASTRAR}
                style={{ fontWeight: 700 }}
                onClick={() => onClickNovo()}
              >
                Novo
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardTableCadastros dadosTabela={data} colunasTabela={columns} />
    </>
  );
};

export default SerieColecao;
