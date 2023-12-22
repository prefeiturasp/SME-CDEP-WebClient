import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_CODIGO_ANTIGO } from '~/core/constants/ids/input';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoAntigo];

type InputCodigoAntigoProps = {
  extra?: React.ReactNode;
};
const InputCodigoAntigo: React.FC<InputCodigoAntigoProps> = ({ extra }) => (
  <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
    {(form) => {
      const codigoNovoEstaPreenchido = !!form.getFieldValue(fieldProps.name);

      return (
        <Form.Item
          label={fieldProps.label}
          name={fieldProps.name}
          rules={[{ required: !codigoNovoEstaPreenchido, whitespace: true }]}
          extra={extra}
        >
          <Input
            type='text'
            placeholder={fieldProps.label}
            maxLength={15}
            id={CDEP_INPUT_CODIGO_ANTIGO}
          />
        </Form.Item>
      );
    }}
  </Form.Item>
);

export default InputCodigoAntigo;
