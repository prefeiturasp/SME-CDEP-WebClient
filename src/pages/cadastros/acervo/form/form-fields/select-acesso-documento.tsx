import { Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_ACESSO_DOCUMENTO } from '~/core/constants/ids/select';
import { obterAcessoDocumento } from '~/core/services/acervo-documentacao-historica-service';

type SelectAcessoDocumentoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectAcessoDocumento: React.FC<SelectAcessoDocumentoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterAcessoDocumento();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Row wrap={false} align='middle'>
      <Form.Item
        label='Acesso do documento'
        name='acessoDocumentos'
        rules={[{ required: true }]}
        style={{ width: '100%', marginRight: '8px' }}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          mode='multiple'
          id={CDEP_SELECT_ACESSO_DOCUMENTO}
          {...selectProps}
          options={options}
          placeholder='Acesso do documento'
        />
      </Form.Item>
    </Row>
  );
};

export default SelectAcessoDocumento;
