import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_CODIGO_ANTIGO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type InputCodigoAntigoProps = {
  extra?: React.ReactNode;
};
const InputCodigoAntigo: React.FC<InputCodigoAntigoProps> = ({ extra }) => {
  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const codigoNovoEstaPreenchido = !!form.getFieldValue(
          AcervoFieldName[FieldAcervoEnum.CodigoNovo],
        );

        return (
          <Form.Item
            label='Codigo antigo'
            name={AcervoFieldName[FieldAcervoEnum.CodigoAntigo]}
            rules={[{ required: !codigoNovoEstaPreenchido, whitespace: true }]}
            extra={extra}
          >
            <Input
              type='text'
              placeholder='Codigo antigo'
              maxLength={15}
              id={CDEP_INPUT_CODIGO_ANTIGO}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default InputCodigoAntigo;
