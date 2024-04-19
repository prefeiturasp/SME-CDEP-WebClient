import { Button, Col, Form, Row } from 'antd';
import { FormInstance } from 'rc-field-form';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonExcluir from '~/components/cdep/button/excluir';
import ButtonVoltar from '~/components/cdep/button/voltar';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_EXCLUIR,
  CDEP_BUTTON_SALVAR_ALTERAR,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  ACERVO_EXCLUIDO_SUCESSO,
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  DESEJA_EXCLUIR_ACERVO,
} from '~/core/constants/mensagens';
import { FormPageConfigCadastroAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { ROUTES } from '~/core/enum/routes';
import { confirmacao } from '~/core/services/alerta-service';
import { deletarRegistro } from '~/core/services/api';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

type FormHeaderCadastroAcervoProps = {
  fieldsConfig?: FormPageConfigCadastroAcervoProps;
};

const FormHeaderCadastroAcervo: React.FC<FormHeaderCadastroAcervoProps> = ({ fieldsConfig }) => {
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const { permissao } = useContext(PermissaoContext);

  const acervoId = paramsRoute?.id || 0;
  const title = acervoId ? 'Editar Acervo' : 'Novo Acervo';

  const onClickVoltar = (form: FormInstance) => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          navigate(ROUTES.ACERVO);
        },
      });
    } else {
      navigate(ROUTES.ACERVO);
    }
  };

  const onClickCancelar = (form: FormInstance) => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
        },
      });
    }
  };

  const onClickExcluir = () => {
    if (acervoId && permissao.podeExcluir) {
      confirmacao({
        content: DESEJA_EXCLUIR_ACERVO,
        onOk() {
          deletarRegistro(`${fieldsConfig?.urlBase}/${acervoId}`).then((response) => {
            if (response.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: ACERVO_EXCLUIDO_SUCESSO,
              });
              navigate(ROUTES.ACERVO);
            }
          });
        },
      });
    }
  };

  return (
    <HeaderPage title={title}>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col>
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => (
                <ButtonVoltar onClick={() => onClickVoltar(form)} id={CDEP_BUTTON_VOLTAR} />
              )}
            </Form.Item>
          </Col>
          {acervoId ? (
            <Col>
              <ButtonExcluir
                id={CDEP_BUTTON_EXCLUIR}
                onClick={onClickExcluir}
                disabled={!permissao.podeExcluir}
              />
            </Col>
          ) : (
            <></>
          )}
          <Col>
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => (
                <Button
                  block
                  type='default'
                  id={CDEP_BUTTON_CANCELAR}
                  onClick={() => onClickCancelar(form)}
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
              id={CDEP_BUTTON_SALVAR_ALTERAR}
              style={{ fontWeight: 700 }}
            >
              {acervoId ? 'Alterar' : 'Salvar'}
            </Button>
          </Col>
        </Row>
      </Col>
    </HeaderPage>
  );
};

export default FormHeaderCadastroAcervo;
