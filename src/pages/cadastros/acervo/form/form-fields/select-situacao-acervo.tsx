import { Form, FormItemProps, Row } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.SituacaoAcervo];

type SelectSituacaoAcervoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectSituacaoAcervo: React.FC<SelectSituacaoAcervoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = () => {
    const newOptions: DefaultOptionType[] = [
      { label: 'Ativo', value: 1 },
      { label: 'Inativo', value: 2 },
    ];
    setOptions(newOptions);
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <>
      <Row wrap={false}>
        <Form.Item
          label={fieldProps.label}
          name={fieldProps.name}
          style={{ width: '100%', marginRight: '8px' }}
          {...formItemProps}
          extra={undefined}
        >
          <Select
            showSearch
            allowClear
            {...selectProps}
            options={options}
            placeholder={fieldProps.label}
          />
        </Form.Item>
      </Row>
      {formItemProps?.extra}
    </>
  );
};

export default SelectSituacaoAcervo;
