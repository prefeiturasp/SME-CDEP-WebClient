import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BreadcrumbCDEPProps } from '~/components/cdep/breadcrumb';
import ButtonVoltar from '~/components/cdep/button/voltar';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_NOVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NOVO } from '~/core/constants/ids/input';
import { alterarRegistro, inserirRegistro } from '~/core/services/api';

export type FormPageProps = {
  title: string;
  urlBase: string;
};

export type FormConfigCadastros = {
  breadcrumb: BreadcrumbCDEPProps;
  page: FormPageProps;
};

const FormCadastrosAuxiliares: React.FC<FormConfigCadastros> = ({ page, breadcrumb }) => {
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const id = paramsRoute?.id || 0;

  const [form] = useForm();

  const onClickVoltar = () => navigate(breadcrumb.urlMainPage);

  const onClickCancelar = () => alert('cancelar');

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      range: 'Por favor, digite Nome',
    },
  };

  const salvar = async (values: any) => {
    console.log(values);

    let response = null;
    if (id) {
      response = await alterarRegistro(`${page.urlBase}/${id}`, values);
    } else {
      response = await inserirRegistro(page.urlBase, values);
    }

    if (response.status === HttpStatusCode.Ok) {
      alert('sucesso');
    }
  };

  return (
    <>
      <Col>
        <Form
          form={form}
          layout='vertical'
          autoComplete='off'
          onFinish={salvar}
          validateMessages={validateMessages}
        >
          <HeaderPage title={page.title}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col>
                  <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
                </Col>
                <Col>
                  <Button
                    block
                    type='default'
                    id={CDEP_BUTTON_CANCELAR}
                    onClick={onClickCancelar}
                    style={{ fontWeight: 700 }}
                  >
                    Cancelar
                  </Button>
                </Col>
                <Col>
                  <Button
                    block
                    type='primary'
                    htmlType='submit'
                    id={CDEP_BUTTON_NOVO}
                    style={{ fontWeight: 700 }}
                  >
                    Salvar
                  </Button>
                </Col>
              </Row>
            </Col>
          </HeaderPage>
          <CardContent>
            <Form.Item
              label='Nome'
              name='nome'
              rules={[{ required: true }]}
              style={{ fontWeight: 700 }}
            >
              <Input
                type='text'
                placeholder='Informe o Nome'
                maxLength={200}
                showCount
                id={CDEP_INPUT_NOVO}
              />
            </Form.Item>
          </CardContent>
        </Form>
      </Col>
    </>
  );
};

export default FormCadastrosAuxiliares;
