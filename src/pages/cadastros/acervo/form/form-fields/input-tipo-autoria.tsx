import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_TIPO_AUTORIA } from '~/core/constants/ids/input';

const InputTipoAutoria: React.FC = () => {
  return (
    <Form.Item label='Tipo de autoria' name='tipoAutoria'>
      <Input
        type='text'
        placeholder='Tipo de autoria'
        maxLength={15}
        id={CDEP_INPUT_TIPO_AUTORIA}
      />
    </Form.Item>
  );
};

export default InputTipoAutoria;
