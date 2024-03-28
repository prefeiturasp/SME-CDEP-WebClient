import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';

type InputInstituicaoProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputInstituicao: React.FC<InputInstituicaoProps> = ({ inputProps, formItemProps }) => {
  const form = useFormInstance();
  const tipo = Form.useWatch('tipo', form);

  const campoEhObrigatorio = () => {
    if (tipo === TipoUsuario.POPULACAO_GERAL) {
      return false;
    }

    return true;
  };

  return (
    <Form.Item
      label='Instituição/Empresa'
      name='instituicao'
      dependencies={['tipo']}
      rules={[{ required: campoEhObrigatorio() }]}
      {...formItemProps}
    >
      <Input
        placeholder='Informe a instituição ou empresa'
        id='INPUT_INSTITUICAO'
        maxLength={100}
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputInstituicao;
