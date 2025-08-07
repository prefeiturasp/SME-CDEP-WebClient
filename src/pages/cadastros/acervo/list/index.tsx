import { Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useContext } from 'react';
import { FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import SelectCreditoAutoria from '~/components/cdep/input/credito-autoria';
import SelectEditora from '~/components/cdep/input/editora';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import ButtonPrimary from '~/components/lib/button/primary';
import ButtonSecundary from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import {
  CDEP_BUTTON_IMPORTAR,
  CDEP_BUTTON_NOVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_CODIGO, CDEP_INPUT_TITULO } from '~/core/constants/ids/input';
import { URL_API_ACERVO } from '~/core/constants/urls-api';
import { IdTipoTituloCreditoAutoriaCodigoAcervoDTO } from '~/core/dto/id-tipo-titulo-credito-autoria-codigo-acervo-dto';
import { ROUTES } from '~/core/enum/routes';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

const ListAcervo: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const { permissao } = useContext(PermissaoContext);

  const columns: ColumnsType<IdTipoTituloCreditoAutoriaCodigoAcervoDTO> = [
    {
      title: 'Tipo de acervo',
      dataIndex: 'tipoAcervo',
    },
    {
      title: 'Editora',
      dataIndex: 'editora',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      render: (titulo: string) => <div style={{ wordBreak: 'break-word' }}>{titulo}</div>,
    },
    {
      title: 'Crédito/Autoria',
      dataIndex: 'creditoAutoria',
    },
    {
      title: 'Tombo/Código',
      dataIndex: 'codigo',
    },
  ];

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickNovo = () => {
    if (permissao.podeIncluir) navigate(ROUTES.ACERVO_NOVO);
  };

  const onClickEditar = (row: IdTipoTituloCreditoAutoriaCodigoAcervoDTO) =>
    navigate(`${ROUTES.ACERVO}/editar/${row.acervoId}`, {
      state: { tipoAcervoId: row.tipoAcervoId },
      replace: true,
    });

  const onClickImportar = () => {
    if (permissao.podeIncluir) navigate(ROUTES.ACERVO_IMPORTAR);
  };

  return (
    <Col>
      <HeaderPage title='Acervo'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <ButtonSecundary
                id={CDEP_BUTTON_IMPORTAR}
                onClick={() => onClickImportar()}
                icon={<FaFileExcel size={16} />}
                disabled={!permissao.podeIncluir}
              >
                Importar
              </ButtonSecundary>
            </Col>
            <Col>
              <ButtonPrimary
                id={CDEP_BUTTON_NOVO}
                onClick={() => onClickNovo()}
                disabled={!permissao.podeIncluir}
              >
                Novo
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

                  <Col xs={24} sm={12}>
                  <Form.Item label="Título" name="titulo">
                    <Input type="text" placeholder="Título" id={CDEP_INPUT_TITULO} />
                  </Form.Item>
                </Col>
                 <Col xs={24} sm={12}>
                  <SelectCreditoAutoria />
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item label="Tombo/Código" name="codigo">
                    <Input type="text" placeholder="Tombo/Código" id={CDEP_INPUT_CODIGO} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <SelectTipoAcervo />
                </Col>
                <Col xs={24} sm={8}>
                  <SelectEditora />
                </Col>

                <Col span={24}>
                  <DataTable
                    rowKey="acervoId"
                    filters={form.getFieldsValue()}
                    url={URL_API_ACERVO}
                    columns={columns}
                    onRow={(row) => ({
                      onClick: () => {
                        onClickEditar(row);
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

export default ListAcervo;
