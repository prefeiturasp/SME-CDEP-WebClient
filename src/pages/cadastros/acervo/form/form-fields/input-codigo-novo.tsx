import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_CODIGO_NOVO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoNovo];

type InputCodigoNovoProps = {
  extra?: React.ReactNode;
};
const InputCodigoNovo: React.FC<InputCodigoNovoProps> = ({ extra }) => (
  <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
    {(form) => {
      const codigoAntigoEstaPreenchido = !!form.getFieldValue(
        PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoAntigo].name,
      );

      return (
        <Form.Item
          label={fieldProps.label}
          name={fieldProps.name}
          rules={[{ required: !codigoAntigoEstaPreenchido, whitespace: true }]}
          extra={extra}
        >
          <Input
            type='text'
            placeholder={fieldProps.label}
            maxLength={200}
            id={CDEP_INPUT_CODIGO_NOVO}
          />
        </Form.Item>
      );
    }}
  </Form.Item>
);

export default InputCodigoNovo;
