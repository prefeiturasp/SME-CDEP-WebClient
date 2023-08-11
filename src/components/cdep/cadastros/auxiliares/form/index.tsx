import { Button, Col, Form, Input, Modal, Row, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
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
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
} from '~/core/constants/mensagens';
import { alterarRegistro, inserirRegistro, obterRegistro } from '~/core/services/api';
import { Colors } from '~/core/styles/colors';
const { confirm } = Modal;

type FormPageInputsProps = {
  name: string;
  placeholder: string;
};

export type FormPageProps = {
  title: string;
  urlBase: string;
  inputs: FormPageInputsProps[];
};

export type FormConfigCadastros = {
  breadcrumb: BreadcrumbCDEPProps;
  page: FormPageProps;
};

const FormCadastrosAuxiliares: React.FC<FormConfigCadastros> = ({ page, breadcrumb }) => {
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const [form] = useForm();

  const [formInitialValues, setFormInitialValues] = useState({});

  const id = paramsRoute?.id || 0;

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      range: 'Por favor, digite Nome',
    },
  };

  const carregarDados = useCallback(async () => {
    const resposta = await obterRegistro<any>(`${page.urlBase}/${id}`);

    if (resposta.sucesso) {
      setFormInitialValues(resposta.dados);
    }
  }, [page, id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirm({
        width: 500,
        title: 'Atenção',
        icon: <></>,
        content: DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          navigate(breadcrumb.urlMainPage);
        },
        cancelText: 'Cancelar',
        okButtonProps: { type: 'default' },
        cancelButtonProps: {
          type: 'text',
          style: { color: Colors.TEXT },
        },
      });
    } else {
      navigate(breadcrumb.urlMainPage);
    }
  };

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      confirm({
        width: 500,
        title: 'Atenção',
        icon: <></>,
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
        },
        cancelText: 'Cancelar',
        okButtonProps: { type: 'default' },
        cancelButtonProps: {
          type: 'text',
          style: { color: Colors.TEXT },
        },
      });
    }
  };

  const openNotificationSuccess = () => {
    notification.success({
      message: 'Sucesso',
      description: `Registro ${id ? 'alterado' : 'inserido'} com sucesso!`,
    });
  };

  const salvar = async (values: any) => {
    let response = null;
    if (id) {
      response = await alterarRegistro(page.urlBase, {
        id,
        ...values,
      });
    } else {
      response = await inserirRegistro(page.urlBase, values);
    }

    if (response.status === HttpStatusCode.Ok) {
      openNotificationSuccess();
      navigate(breadcrumb.urlMainPage);
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
          initialValues={formInitialValues}
        >
          <HeaderPage title={page.title}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col>
                  <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
                </Col>
                <Col>
                  <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                    {() => (
                      <Button
                        block
                        type='default'
                        id={CDEP_BUTTON_CANCELAR}
                        onClick={onClickCancelar}
                        style={{ fontWeight: 700 }}
                        disabled={!form.isFieldsTouched()}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Form.Item>
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
            {page.inputs.map((input) => (
              // TODO - Criar uma função quando tiver mais campos
              <Form.Item
                key={input.name}
                label='Nome'
                name={input.name}
                rules={[{ required: true }]}
                style={{ fontWeight: 700 }}
              >
                <Input
                  type='text'
                  placeholder={input.placeholder}
                  maxLength={200}
                  showCount
                  id={CDEP_INPUT_NOVO}
                />
              </Form.Item>
            ))}
          </CardContent>
        </Form>
      </Col>
    </>
  );
};

export default FormCadastrosAuxiliares;
