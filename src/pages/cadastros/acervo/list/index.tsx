import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import SelectCreditoAutoria from '~/components/cdep/input/credito-autoria';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_NOVO, CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_CODIGO, CDEP_INPUT_TITULO } from '~/core/constants/ids/input';
import { IdTipoTituloCreditoAutoriaCodigoAcervoDTO } from '~/core/dto/id-tipo-titulo-credito-autoria-codigo-acervo-dto';
import { ROUTES } from '~/core/enum/routes';
import { URL_API_ACERVO } from '~/core/services/acervo-service';

const ListAcervo: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const columns: ColumnsType<IdTipoTituloCreditoAutoriaCodigoAcervoDTO> = [
    {
      title: 'Tipo de acervo',
      dataIndex: 'tipoAcervo',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
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

  const onClickNovo = () => navigate(ROUTES.ACERVO_NOVO);

  const onClickEditar = (id: number) =>
    navigate(`${ROUTES.ACERVO}/editar/${id}`, { replace: true });

  return (
    <Col>
      <HeaderPage title='Acervo'>
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
              >
                Novo
              </Button>
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
                  <SelectTipoAcervo />
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label='Título' name='titulo'>
                    <Input type='text' placeholder='Título' id={CDEP_INPUT_TITULO} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <SelectCreditoAutoria />
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label='Tombo/Código' name='codigo'>
                    <Input type='text' placeholder='Tombo/Código' id={CDEP_INPUT_CODIGO} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <DataTable
                    rowKey='acervoId'
                    filters={form.getFieldsValue()}
                    url={URL_API_ACERVO}
                    columns={columns}
                    onRow={(row) => ({
                      onClick: () => {
                        onClickEditar(row?.acervoId);
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
