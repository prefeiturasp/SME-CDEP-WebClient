import { Form, Input } from 'antd';
import React from 'react';
import { CDEP_INPUT_DISPONIBILIZACAO } from '~/core/constants/ids/input';

const InputDisponibilizacao: React.FC = () => {
  return (
    <Form.Item
      label='Disponibilizacao'
      name='disponibilizacao'
      rules={[{ required: false, whitespace: true }]}
    >
      <Input
        type='text'
        placeholder='Disponibilização'
        maxLength={100}
        id={CDEP_INPUT_DISPONIBILIZACAO}
      />
    </Form.Item>
  );
};

export default InputDisponibilizacao;
