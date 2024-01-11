import { Button, Col, Form, Row } from 'antd';
import { FormInstance } from 'rc-field-form/lib/interface';
import React, { useContext } from 'react';
import ButtonExcluir from '~/components/cdep/button/excluir';
import ButtonVoltar from '~/components/cdep/button/voltar';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_EXCLUIR,
  CDEP_BUTTON_NOVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

type FormCadastrosAuxiliaresBotoesAcoesProps = {
  id: string | number;
  form: FormInstance;
  onClickVoltar: () => void;
  onClickExcluir: () => void;
  onClickCancelar: () => void;
};

const FormCadastrosAuxiliaresBotoesAcoes: React.FC<FormCadastrosAuxiliaresBotoesAcoesProps> = ({
  id,
  form,
  onClickVoltar,
  onClickExcluir,
  onClickCancelar,
}) => {
  const { permissao } = useContext(PermissaoContext);

  return (
    <Col span={24}>
      <Row gutter={[8, 8]}>
        <Col>
          <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
        </Col>
        {id ? (
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
            {id ? 'Alterar' : 'Salvar'}
          </Button>
        </Col>
      </Row>
    </Col>
  );
};

export default FormCadastrosAuxiliaresBotoesAcoes;
