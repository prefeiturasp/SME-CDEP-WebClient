import { Col, Form, Input, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Auditoria from '~/components/cdep/text/auditoria';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_MODAL_CANCELAR,
  CDEP_BUTTON_MODAL_SALVAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NOVO } from '~/core/constants/ids/input';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  DESEJA_EXCLUIR_ACERVO,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { CadastroAuxiliarDTO } from '~/core/dto/cadastro-auxiliar-dto';
import { FormCadastrosAuxiliaresProps } from '~/core/dto/form-cadastros-auxiliares';
import { confirmacao } from '~/core/services/alerta-service';
import {
  alterarRegistro,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from '~/core/services/api';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import FormCadastrosAuxiliaresBotoesAcoes from './botoes-acoes';

const FormCadastrosAuxiliares: React.FC<FormCadastrosAuxiliaresProps> = ({
  page,
  title,
  maxLength,
  initialValues = {},
  isModal = false,
  setOpenModal = () => false,
}) => {
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const [form] = useForm();

  const { desabilitarCampos, permissao } = useContext(PermissaoContext);

  const [formInitialValues, setFormInitialValues] = useState<CadastroAuxiliarDTO>(initialValues);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const id = paramsRoute?.id || 0;

  const carregarDados = useCallback(async () => {
    const resposta = await obterRegistro<any>(`${page.urlBase}/${id}`);

    if (resposta.sucesso) {
      setFormInitialValues((prevState) => {
        return {
          ...prevState,
          ...resposta.dados,
        };
      });
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
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          navigate(page.urlMainPage);
        },
      });
    } else {
      navigate(page.urlMainPage);
    }
  };

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
          setOpenModal(false);
        },
      });
    } else {
      if (isModal) {
        form.resetFields();
        setOpenModal(false);
      }
    }
  };

  const salvar = async (values: any) => {
    const valoresSalvar = { ...initialValues, ...values };

    if (isModal) setLoadingModal(true);

    let response = null;
    if (id) {
      response = await alterarRegistro(page.urlBase, {
        id,
        ...valoresSalvar,
      });
    } else {
      response = await inserirRegistro(page.urlBase, valoresSalvar);
    }

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: `Registro ${id ? 'alterado' : 'inserido'} com sucesso!`,
      });

      if (isModal) {
        setOpenModal(false, true);
      } else {
        navigate(page.urlMainPage);
      }
    }

    setLoadingModal(false);
  };

  const onClickExcluir = () => {
    if (id && permissao.podeExcluir) {
      confirmacao({
        content: DESEJA_EXCLUIR_ACERVO,
        onOk() {
          deletarRegistro(`${page.urlBase}/${id}`).then((response) => {
            if (response.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: 'Acervo excluído com sucesso',
              });
              navigate(page.urlMainPage);
            }
          });
        },
      });
    }
  };

  const montarCampos = () => {
    return page.inputs.map((input) => (
      <Form.Item
        key={input.name}
        label='Nome'
        name={input.name}
        rules={[{ required: true, whitespace: true }]}
      >
        <Input
          type='text'
          placeholder={input.placeholder}
          maxLength={maxLength}
          showCount
          id={CDEP_INPUT_NOVO}
        />
      </Form.Item>
    ));
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      salvar(form.getFieldsValue());
    });
  };

  const formDefault = (children: any) => {
    return (
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={salvar}
        validateMessages={validateMessages}
        initialValues={formInitialValues}
        disabled={desabilitarCampos}
      >
        {children}
      </Form>
    );
  };

  const montarForm = () => {
    if (isModal) {
      return (
        <Modal
          open
          title={title}
          onOk={validateFields}
          onCancel={onClickCancelar}
          centered
          destroyOnClose
          cancelButtonProps={{ disabled: loadingModal, id: CDEP_BUTTON_MODAL_CANCELAR }}
          okButtonProps={{
            disabled: loadingModal,
            id: CDEP_BUTTON_MODAL_SALVAR,
          }}
          closable={!loadingModal}
          maskClosable={!loadingModal}
          keyboard={!loadingModal}
          okText='Salvar'
          cancelText='Cancelar'
        >
          <Spin spinning={loadingModal}>{formDefault(montarCampos())}</Spin>
        </Modal>
      );
    }

    return formDefault(
      <>
        <HeaderPage title={page.title}>
          <FormCadastrosAuxiliaresBotoesAcoes
            id={id}
            form={form}
            onClickCancelar={onClickCancelar}
            onClickExcluir={onClickExcluir}
            onClickVoltar={onClickVoltar}
          />
        </HeaderPage>
        <CardContent>
          {montarCampos()}
          <Auditoria dados={formInitialValues} />
        </CardContent>
      </>,
    );
  };

  return <Col>{montarForm()}</Col>;
};

export default FormCadastrosAuxiliares;
