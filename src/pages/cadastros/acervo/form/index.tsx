import { Col, Form, Row, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import Auditoria from '~/components/cdep/text/auditoria';
import CardContent from '~/components/lib/card-content';
import {
  URL_API_ACERVO_ARTE_GRAFICA,
  URL_API_ACERVO_AUDIOVISUAL,
  URL_API_ACERVO_FOTOGRAFICO,
  URL_API_ACERVO_TRIDIMENSIONAL,
} from '~/core/constants/urls-api';
import { validateMessages } from '~/core/constants/validate-messages';
import {
  FormDefaultCadastroAcervoDTO,
  FormPageConfigCadastroAcervoProps,
} from '~/core/dto/form-cadastro-acervo';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { alterarRegistro, inserirRegistro, obterRegistro } from '~/core/services/api';
import { formatarDuasCasasDecimais, removerTudoQueNaoEhDigito } from '~/core/utils/functions';
import FormContentCadastroAcervo from './form-content-cadastro-acervo';
import { FieldsArtesGraficas } from './form-fields-config/artes-graficas';
import { FieldsAudiovisual } from './form-fields-config/audiovisual';
import { FieldsAcervoFotografico } from './form-fields-config/fotografico';
import { FieldsTridimensional } from './form-fields-config/tridimensional';
import FormCadastroAcervoHeader from './form-header-cadastro-acervo';

const FormAcervo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const [form] = useForm();

  const state = location.state;

  const acervoId = paramsRoute?.acervoId ? Number(paramsRoute.acervoId) : 0;
  const stateTipoAcervoId = state?.tipoAcervoId;

  const formTipoAcervoId = Form.useWatch('tipoAcervoId', form);

  const tipo = stateTipoAcervoId || formTipoAcervoId;

  const [fieldsConfig, setFieldsConfig] = useState<FormPageConfigCadastroAcervoProps | undefined>();
  const [formInitialValues, setFormInitialValues] = useState<FormDefaultCadastroAcervoDTO>();

  const carregarDados = useCallback(async () => {
    const resposta = await obterRegistro<FormDefaultCadastroAcervoDTO>(
      `${fieldsConfig?.urlBase}/${acervoId}`,
    );
    if (resposta.sucesso) {
      if (resposta.dados?.arquivos?.length) {
        resposta.dados.arquivos = resposta.dados.arquivos.map((item: any) => ({
          xhr: item?.codigo,
          name: item?.nome,
          id: item?.id,
          status: 'done',
        }));
      }

      if (resposta.dados?.altura) {
        resposta.dados.altura = formatarDuasCasasDecimais(resposta.dados.altura);
      }
      if (resposta.dados?.largura) {
        resposta.dados.largura = formatarDuasCasasDecimais(resposta.dados.largura);
      }
      setFormInitialValues(resposta.dados);
    }
  }, [fieldsConfig, acervoId]);

  useEffect(() => {
    if (acervoId && fieldsConfig?.urlBase) {
      carregarDados();
    }
  }, [carregarDados, fieldsConfig, acervoId]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const onFinish = async (values: FormDefaultCadastroAcervoDTO) => {
    const valoresSalvar = { ...values };

    if (valoresSalvar?.arquivos?.length) {
      valoresSalvar.arquivos = valoresSalvar.arquivos?.map((item: any) => item?.id);
    } else {
      valoresSalvar.arquivos = [];
    }

    if (fieldsConfig) {
      let response = null;

      if (valoresSalvar?.altura) {
        valoresSalvar.altura = removerTudoQueNaoEhDigito(valoresSalvar.altura);
      } else {
        valoresSalvar.altura = null;
      }
      if (valoresSalvar?.largura) {
        valoresSalvar.largura = removerTudoQueNaoEhDigito(valoresSalvar.largura);
      } else {
        valoresSalvar.largura = null;
      }
      if (valoresSalvar?.diametro) {
        valoresSalvar.diametro = removerTudoQueNaoEhDigito(valoresSalvar.diametro);
      } else {
        valoresSalvar.diametro = null;
      }
      if (valoresSalvar?.profundidade) {
        valoresSalvar.profundidade = removerTudoQueNaoEhDigito(valoresSalvar.profundidade);
      } else {
        valoresSalvar.profundidade = null;
      }

      if (acervoId && formInitialValues) {
        valoresSalvar.id = formInitialValues.id;
        valoresSalvar.acervoId = formInitialValues.acervoId;
        valoresSalvar.tipoAcervoId = formInitialValues.tipoAcervoId;
        response = await alterarRegistro(fieldsConfig.urlBase, valoresSalvar);
      } else {
        response = await inserirRegistro(fieldsConfig.urlBase, valoresSalvar);
      }

      if (response.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: `Acervo ${acervoId ? 'alterado' : 'registrado'} com sucesso!`,
        });
        navigate(ROUTES.ACERVO);
      }
    }
  };

  const obterCampos = useCallback((): FormPageConfigCadastroAcervoProps | undefined => {
    switch (tipo || stateTipoAcervoId) {
      case TipoAcervo.Fotografico:
        return {
          tipo: TipoAcervo.Fotografico,
          urlBase: URL_API_ACERVO_FOTOGRAFICO,
          fields: FieldsAcervoFotografico,
        };
      case TipoAcervo.ArtesGraficas:
        return {
          tipo: TipoAcervo.ArtesGraficas,
          urlBase: URL_API_ACERVO_ARTE_GRAFICA,
          fields: FieldsArtesGraficas,
        };
      case TipoAcervo.Tridimensional:
        return {
          tipo: TipoAcervo.Tridimensional,
          urlBase: URL_API_ACERVO_TRIDIMENSIONAL,
          fields: FieldsTridimensional,
        };
      case TipoAcervo.Audiovisual:
        return {
          tipo: TipoAcervo.Audiovisual,
          urlBase: URL_API_ACERVO_AUDIOVISUAL,
          fields: FieldsAudiovisual,
        };

      default:
        return undefined;
    }
  }, [tipo, stateTipoAcervoId]);

  useEffect(() => {
    if (!acervoId) {
      if (tipo) {
        setFieldsConfig(obterCampos());
      } else {
        setFieldsConfig(undefined);
        form.resetFields();
      }
    } else {
      setFieldsConfig(obterCampos());
    }
  }, [obterCampos, acervoId, form, tipo]);

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
            <Col xs={24} sm={12}>
              <SelectTipoAcervo
                formItemProps={{ rules: [{ required: true }], name: 'tipoAcervoId' }}
                selectProps={{
                  disabled: !!acervoId,
                  onChange: (newValue) => {
                    setFieldsConfig(undefined);
                    form.resetFields();
                    form.setFieldValue('tipoAcervoId', newValue);
                  },
                }}
              />
            </Col>
            {tipo ? <FormContentCadastroAcervo fieldsConfig={fieldsConfig} form={form} /> : <></>}
          </Row>
          <Auditoria dados={formInitialValues?.auditoria} />
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormAcervo;
