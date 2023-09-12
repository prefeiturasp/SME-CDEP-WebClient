import { Col, Form, Row, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import CardContent from '~/components/lib/card-content';
import { validateMessages } from '~/core/constants/validate-messages';
import {
  FormDefaultCadastroAcervoDTO,
  FormPageConfigCadastroAcervoProps,
} from '~/core/dto/form-cadastro-acervo';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { URL_API_ACERVO_FOTOGRAFICO } from '~/core/services/acervo-fotografico-service';
import { alterarRegistro, inserirRegistro, obterRegistro } from '~/core/services/api';
import FormContentCadastroAcervo from './form-content-cadastro-acervo';
import { FieldsAcervoFotografico } from './form-fields-config/acervo-fotografico-fields-config';
import FormCadastroAcervoHeader from './form-header-cadastro-acervo';
import { ROUTES } from '~/core/enum/routes';
import Auditoria from '~/components/cdep/text/auditoria';

const FormAcervo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const [form] = useForm();

  const state = location.state;

  const id = paramsRoute?.id ? Number(paramsRoute.id) : 0;
  const stateTipoAcervoId = state?.tipoAcervoId;

  const tipo = Form.useWatch('tipoAcervoId', form);

  const [fieldsConfig, setFieldsConfig] = useState<FormPageConfigCadastroAcervoProps | undefined>();
  const [formInitialValues, setFormInitialValues] = useState<FormDefaultCadastroAcervoDTO>();

  const carregarDados = useCallback(async () => {
    const resposta = await obterRegistro<FormDefaultCadastroAcervoDTO>(
      `${fieldsConfig?.urlBase}/${id}`,
    );
    if (resposta.sucesso) {
      setFormInitialValues(resposta.dados);
    }
  }, [fieldsConfig, id]);

  useEffect(() => {
    if (id && fieldsConfig?.urlBase) {
      carregarDados();
    }
  }, [carregarDados, fieldsConfig, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const onFinish = async (values: FormDefaultCadastroAcervoDTO) => {
    const valoresSalvar = { ...values };
    // TODO - Descrição - Editor
    valoresSalvar.descricao = 'MOCK DESCRIÇÃO';

    valoresSalvar.id = id;

    if (fieldsConfig) {
      let response = null;

      if (id && formInitialValues) {
        valoresSalvar.id = id;
        valoresSalvar.acervoId = formInitialValues.acervoId;
        valoresSalvar.tipoAcervoId = formInitialValues.tipoAcervoId;
        response = await alterarRegistro(fieldsConfig.urlBase, valoresSalvar);
      } else {
        response = await inserirRegistro(fieldsConfig.urlBase, valoresSalvar);
      }

      if (response.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: `Registro ${id ? 'alterado' : 'inserido'} com sucesso!`,
        });
        navigate(ROUTES.ACERVO);
      }
    }
  };

  const onterCampos = useCallback((): FormPageConfigCadastroAcervoProps | undefined => {
    switch (tipo || stateTipoAcervoId) {
      case TipoAcervo.Fotografico:
        return {
          tipo: TipoAcervo.Fotografico,
          urlBase: URL_API_ACERVO_FOTOGRAFICO,
          fields: FieldsAcervoFotografico,
        };

      default:
        return undefined;
    }
  }, [tipo, stateTipoAcervoId]);

  useEffect(() => {
    if (!id) {
      if (tipo) {
        setFieldsConfig(onterCampos());
      } else {
        setFieldsConfig(undefined);
        form.resetFields();
      }
    } else {
      setFieldsConfig(onterCampos());
    }
  }, [onterCampos, id, form, tipo]);

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
        initialValues={formInitialValues}
        validateMessages={validateMessages}
      >
        <FormCadastroAcervoHeader fieldsConfig={fieldsConfig} />

        <CardContent>
          <Row gutter={[16, 8]}>
            <Col xs={24}>
              <SelectTipoAcervo
                formItemProps={{ required: true, name: 'tipoAcervoId' }}
                selectProps={{
                  disabled: !!id,
                  onChange: (newValue) => {
                    setFieldsConfig(undefined);
                    form.resetFields();
                    form.setFieldValue('tipoAcervoId', newValue);
                  },
                }}
              />
            </Col>
            {tipo ? <FormContentCadastroAcervo fieldsConfig={fieldsConfig} /> : <></>}
          </Row>
          <Auditoria dados={formInitialValues?.auditoria} />
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormAcervo;
