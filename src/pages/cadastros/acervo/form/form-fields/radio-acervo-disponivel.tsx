import { Form, Radio as RadioAnt } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React from 'react';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.AcervoDisponivel];

type RadioAcervoDisponivelProps = {
  tipoAcervo?: TipoAcervo;
  extra?: React.ReactNode;
};

export const RadioAcervoDisponivel: React.FC<RadioAcervoDisponivelProps> = ({ extra }) => {
  const options: AbstractCheckboxGroupProps['options'] = [
    {
      label: 'Sim',
      value: true,
    },
    {
      label: 'Não',
      value: false,
    },
  ];

  return (
    <Form.Item
      initialValue={true}
      name={fieldProps.name}
      label={fieldProps.label}
      rules={[{ required: true }]}
      extra={extra}
    >
      <RadioAnt.Group options={options} />
    </Form.Item>
  );
};
