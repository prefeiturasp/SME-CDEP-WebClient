import { Col, Form, Modal, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import Auditoria from '~/components/cdep/text/auditoria';
import CardContent from '~/components/lib/card-content';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_MODAL_CANCELAR,
  CDEP_BUTTON_MODAL_SALVAR,
} from '~/core/constants/ids/button/intex';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import {
  URL_API_ACERVO_ARTE_GRAFICA,
  URL_API_ACERVO_AUDIOVISUAL,
  URL_API_ACERVO_BIBLIOGRAFICO,
  URL_API_ACERVO_DOCUMENTACAO_HISTORICA,
  URL_API_ACERVO_FOTOGRAFICO,
  URL_API_ACERVO_TRIDIMENSIONAL,
} from '~/core/constants/urls-api';
import { validateMessages } from '~/core/constants/validate-messages';
import { AcervoLinhaRetornoDTO } from '~/core/dto/acervo-linha-retorno-dto';
import { CoAutorDTO } from '~/core/dto/coautores-dto';
import {
  FormDefaultCadastroAcervoDTO,
  FormPageConfigCadastroAcervoProps,
} from '~/core/dto/form-cadastro-acervo';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { confirmacao } from '~/core/services/alerta-service';
import { alterarRegistro, inserirRegistro, obterRegistro } from '~/core/services/api';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { mapearDtoCadastrosAcervo } from '../utils';
import FormContentCadastroAcervo from './form-content-cadastro-acervo';
import { FieldsArtesGraficas } from './form-fields-config/artes-graficas';
import { FieldsAudiovisual } from './form-fields-config/audiovisual';
import { FieldsBibliografico } from './form-fields-config/bibliografico';
import { FieldsDocumentacaoHistorica } from './form-fields-config/documentacao-historica';
import { FieldsAcervoFotografico } from './form-fields-config/fotografico';
import { FieldsTridimensional } from './form-fields-config/tridimensional';
import FormCadastroAcervoHeader from './form-header-cadastro-acervo';

type FormAcervoProps = {
  setOpenFormModal?: (params: { open: boolean; updateData: boolean }) => void;
  modalFormInitialValues?: FormDefaultCadastroAcervoDTO;
  errosAcervoLinhaRetorno?: AcervoLinhaRetornoDTO;
};

const FormAcervo: React.FC<FormAcervoProps> = ({
  setOpenFormModal,
  modalFormInitialValues,
  errosAcervoLinhaRetorno,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const [form] = useForm();

  const { desabilitarCampos } = useContext(PermissaoContext);

  const state = location.state;

  const acervoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const stateTipoAcervoId = state?.tipoAcervoId;

  const formTipoAcervoId = Form.useWatch('tipoAcervoId', form);

  const tipo = stateTipoAcervoId || formTipoAcervoId;

  const [formInitialValues, setFormInitialValues] = useState<FormDefaultCadastroAcervoDTO>();
  const [fieldsConfig, setFieldsConfig] = useState<FormPageConfigCadastroAcervoProps | undefined>();

  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const carregarDados = useCallback(async () => {
    const resposta = await obterRegistro<FormDefaultCadastroAcervoDTO>(
      `${fieldsConfig?.urlBase}/${acervoId}`,
    );

    if (resposta.sucesso) {
      const dados = mapearDtoCadastrosAcervo(resposta.dados);

      setFormInitialValues(dados);
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

  useEffect(() => {
    if (modalFormInitialValues && setOpenFormModal) {
      const dados = mapearDtoCadastrosAcervo(modalFormInitialValues);

      setFormInitialValues(dados);
      form.resetFields();
    }
  }, [form, modalFormInitialValues, setOpenFormModal]);

  const onFinish = async (values: FormDefaultCadastroAcervoDTO) => {
    const valoresSalvar = { ...values };

    if (valoresSalvar?.arquivos?.length) {
      valoresSalvar.arquivos = valoresSalvar.arquivos?.map((item: any) => item?.id);
    } else {
      valoresSalvar.arquivos = [];
    }

    if (fieldsConfig) {
      let response = null;

      if (valoresSalvar?.codigo) {
        valoresSalvar.codigo;
      } else {
        valoresSalvar.codigo = null;
      }

      if (valoresSalvar?.codigoNovo) {
        valoresSalvar.codigo;
      } else {
        valoresSalvar.codigoNovo = null;
      }

      if (valoresSalvar?.numeroPagina) {
        valoresSalvar.numeroPagina;
      } else {
        valoresSalvar.numeroPagina = null;
      }

      if (valoresSalvar?.coAutores?.length && valoresSalvar?.listaTipoAutoria?.length) {
        const coAutores = [...valoresSalvar.coAutores];
        const listaTipoAutoria = [...valoresSalvar.listaTipoAutoria];
        const coAutoresJoin = coAutores.map((item) => {
          const tipoAutoriaAtual = listaTipoAutoria?.find(
            (itemTipoAutoria: CoAutorDTO) => itemTipoAutoria.creditoAutorId === item.value,
          );

          return {
            creditoAutorId: item.value,
            tipoAutoria: tipoAutoriaAtual?.tipoAutoria || '',
          };
        });

        valoresSalvar.coAutores = coAutoresJoin;
      } else {
        valoresSalvar.coAutores = [];
      }

      if (setOpenFormModal) setLoadingModal(true);

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

        if (setOpenFormModal) {
          setOpenFormModal({ open: false, updateData: true });
        } else {
          navigate(ROUTES.ACERVO);
        }
      }

      setLoadingModal(false);
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
      case TipoAcervo.DocumentacaoHistorica:
        return {
          tipo: TipoAcervo.DocumentacaoHistorica,
          urlBase: URL_API_ACERVO_DOCUMENTACAO_HISTORICA,
          fields: FieldsDocumentacaoHistorica,
        };
      case TipoAcervo.Bibliografico:
        return {
          tipo: TipoAcervo.Bibliografico,
          urlBase: URL_API_ACERVO_BIBLIOGRAFICO,
          fields: FieldsBibliografico,
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

  const montarCampos = () => (
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={12}>
        <SelectTipoAcervo
          formItemProps={{ rules: [{ required: true }], name: 'tipoAcervoId' }}
          selectProps={{
            disabled: !!acervoId || !!setOpenFormModal,
            onChange: (newValue) => {
              setFieldsConfig(undefined);
              form.resetFields();
              form.setFieldValue('tipoAcervoId', newValue);
            },
          }}
        />
      </Col>
      {tipo ? (
        <FormContentCadastroAcervo
          form={form}
          fieldsConfig={fieldsConfig}
          errosAcervoLinhaRetorno={errosAcervoLinhaRetorno}
        />
      ) : (
        <></>
      )}
    </Row>
  );

  const formDefault = (children: any) => {
    return (
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
        initialValues={formInitialValues}
        validateMessages={validateMessages}
        disabled={desabilitarCampos}
      >
        {children}
      </Form>
    );
  };

  const montarForm = () => {
    if (setOpenFormModal) {
      return (
        <Modal
          open
          style={{ minWidth: '80%' }}
          title='Novo Acervo'
          onOk={() => {
            form.validateFields().then(() => {
              onFinish(form.getFieldsValue());
            });
          }}
          onCancel={() => {
            if (form.isFieldsTouched()) {
              confirmacao({
                content: DESEJA_CANCELAR_ALTERACOES,
                onOk() {
                  form.resetFields();
                  setOpenFormModal({ open: false, updateData: false });
                },
              });
            } else {
              form.resetFields();
              setOpenFormModal({ open: false, updateData: false });
            }
          }}
          centered
          destroyOnClose
          cancelButtonProps={{ disabled: loadingModal, id: CDEP_BUTTON_MODAL_CANCELAR }}
          okButtonProps={{ disabled: loadingModal, id: CDEP_BUTTON_MODAL_SALVAR }}
          closable={!loadingModal}
          maskClosable={!loadingModal}
          keyboard={!loadingModal}
          okText='Salvar'
          cancelText='Cancelar'
        >
          <Col
            style={{
              overflow: 'auto',
              maxHeight: 'calc(100vh - 200px)',
            }}
          >
            {formDefault(montarCampos())}
          </Col>
        </Modal>
      );
    }

    return formDefault(
      <>
        <FormCadastroAcervoHeader fieldsConfig={fieldsConfig} />
        <CardContent>
          {montarCampos()}
          <Auditoria dados={formInitialValues?.auditoria} />
        </CardContent>
      </>,
    );
  };

  return <Col>{montarForm()}</Col>;
};

export default FormAcervo;
