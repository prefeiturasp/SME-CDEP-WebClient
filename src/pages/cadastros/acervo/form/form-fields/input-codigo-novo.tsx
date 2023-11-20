import { Col, Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_CODIGO_NOVO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputCodigoNovoProps = {
  extra?: React.ReactNode;
};
const InputCodigoNovo: React.FC<InputCodigoNovoProps> = ({ extra }) => {
  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const codigoAntigoEstaPreenchido = !!form.getFieldValue(
          AcervoFieldName[FieldAcervoEnum.CodigoNovo],
        );

        return (
          <Col xs={24} sm={12}>
            <Form.Item
              label='Codigo novo'
              name={AcervoFieldName[FieldAcervoEnum.CodigoNovo]}
              rules={[{ required: !codigoAntigoEstaPreenchido, whitespace: true }]}
              extra={extra}
            >
              <Input
                type='text'
                placeholder='Codigo novo'
                maxLength={15}
                id={CDEP_INPUT_CODIGO_NOVO}
              />
            </Form.Item>
          </Col>
        );
      }}
    </Form.Item>
  );
};

export default InputCodigoNovo;
