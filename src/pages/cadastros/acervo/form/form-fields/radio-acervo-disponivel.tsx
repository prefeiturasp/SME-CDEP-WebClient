import { Form, Radio as RadioAnt } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React from 'react';
import { AcervoDisponibilidadeEnum } from '~/core/enum/acervo-disponibilidade-enum';
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
      value: AcervoDisponibilidadeEnum.DISPONIVEL,
    },
    {
      label: 'Não',
      value: AcervoDisponibilidadeEnum.INDISPONIVEL,
    },
  ];

  return (
    <Form.Item
      initialValue={AcervoDisponibilidadeEnum.DISPONIVEL}
      name={fieldProps.name}
      label={fieldProps.label}
      rules={[{ required: true }]}
      extra={extra}
    >
      <RadioAnt.Group options={options} />
    </Form.Item>
  );
};
